using Metadata;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Communication.AspNetCore;
using Microsoft.ServiceFabric.Services.Communication.Client;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Microsoft.ServiceFabric.Services.Runtime;
using System.Fabric;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Gateway
{
    internal sealed class Gateway : StatelessService
    {
        public Gateway(StatelessServiceContext context)
            : base(context)
        { }

        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return new ServiceInstanceListener[]
            {
                new ServiceInstanceListener(serviceContext =>
                    new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
                    {
                        ServiceEventSource.Current.ServiceMessage(serviceContext, $"Starting Kestrel on {url}");

                        var builder = WebApplication.CreateBuilder();

                        builder.Services.AddSingleton<StatelessServiceContext>(serviceContext);
                        builder.WebHost
                                    .UseKestrel()
                                    .UseContentRoot(Directory.GetCurrentDirectory())
                                    .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
                                    .UseUrls(url);

                        builder.Services.AddCors();

                        builder.Services.AddAuthentication(options =>
                        {
                            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                        })
                        .AddJwtBearer(options =>
                        {
                            var jwtSettings = builder.Configuration.GetSection("Jwt");
                            options.TokenValidationParameters = new TokenValidationParameters
                            {
                                ValidateIssuer = true,
                                ValidateAudience = true,
                                ValidateLifetime = true,
                                ValidateIssuerSigningKey = true,
                                ValidIssuer = jwtSettings["Issuer"],
                                ValidAudience = jwtSettings["Audience"],
                                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? ""))
                            };
                        });

                        builder.Services.AddAuthorization(options =>
                        {
                            options.AddPolicy("AdminOrUserOrDriver", policy => policy.RequireRole("Admin", "User", "Driver"));
                            options.AddPolicy("UserOrDriver", policy => policy.RequireRole("User", "Driver"));
                            options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
                            options.AddPolicy("User", policy => policy.RequireRole("User"));
                            options.AddPolicy("Driver", policy => policy.RequireRole("Driver"));
                        });

                        var app = builder.Build();
                        app.UseCors(options => options.WithOrigins("http://localhost:5173").AllowAnyMethod().AllowAnyHeader());
                        app.UseAuthentication();
                        app.UseAuthorization();

                        IDContract ids = ServiceProxy.Create<IDContract>(new Uri("fabric:/TaxiSF/IdService"), new ServicePartitionKey(0), TargetReplicaSelector.PrimaryReplica);
                        IUDContract uds = ServiceProxy.Create<IUDContract>(new Uri("fabric:/TaxiSF/UDService"));
                        IDDContract dds = ServiceProxy.Create<IDDContract>(new Uri("fabric:/TaxiSF/DDService"));

                        // Gateway
                        app.MapPost("/api/v1/auth/login", async (IConfiguration configuration, LoginDto data) =>
                        {
                            var uid = await ids.Login(data);
                            if (uid == null) return Results.Unauthorized();
                            return Results.Ok(CreateToken(configuration, uid));
                        });

                        app.MapPost("/api/v1/auth/reg", async (IConfiguration configuration, RegisterDto data) =>
                        {
                            var uid = await ids.Register(data);
                            if (uid == null) return Results.Unauthorized();
                            return Results.Ok(CreateToken(configuration, uid));
                        });

                        app.MapGet("/api/v1/state/{id}/{isdriver}", async (int id, bool isdriver) =>
                        {
                            var user = await ids.Get(id, isdriver);
                            if (user == null) return Results.NotFound();
                            return Results.Ok(user);
                        }).RequireAuthorization("UserOrDriver");

                        // User Data Service routes
                        app.MapGet("/api/v1/user/{id}", async (int id) =>
                        {
                            var user = await uds.GetUser(id);
                            if (user == null) return Results.NotFound();
                            return Results.Ok(user);
                        }).RequireAuthorization("AdminOrUserOrDriver");

                        app.MapPut("/api/v1/user", async (UserDto user) =>
                        {
                            var updatedUser = await uds.UpdateUser(user);
                            if (updatedUser == null) return Results.NotFound();
                            return Results.Ok();
                        }).RequireAuthorization("AdminOrUserOrDriver");

                        app.MapPost("/api/v1/driver/verify/{driver}/{ver}", async (int driver, string ver) =>
                        {
                            var success = await uds.VerifyDriver(driver, ver);
                            if (!success) return Results.BadRequest();
                            return Results.Ok();
                        }).RequireAuthorization("Admin");

                        app.MapPost("/api/v1/driver/block/{driver}", async (int driver) =>
                        {
                            var success = await uds.BlockDriver(driver);
                            if (!success) return Results.BadRequest();
                            return Results.Ok();
                        }).RequireAuthorization("Admin");

                        app.MapGet("/api/v1/drivers", async () =>
                        {
                            var drivers = await uds.GetAllDrivers();
                            return Results.Ok(drivers);
                        }).RequireAuthorization("Admin");

                        app.MapPost("/api/v1/driver/rate/{driver}/{rating}", async (int driver, int rating) =>
                        {
                            await uds.AddUserRating(driver, rating);
                            return Results.Ok();
                        }).RequireAuthorization("User");

                        // Drive Data Service routes
                        app.MapPost("/api/v1/drive", async (AddDriveDto addDriveDto) =>
                        {
                            var success = await dds.AddDrive(addDriveDto);
                            if (!success) return Results.BadRequest();
                            return Results.Ok();
                        }).RequireAuthorization("User");

                        app.MapPost("/api/v1/drive/accept", async (DriveDto driveDto) =>
                        {
                            var can = await uds.GetUser(driveDto.DriverId ?? 0);
                            if(can == null || can.Blocked || can.AccountStatus != "Allowed")
                                return Results.BadRequest();

                            var success = await dds.AcceptDrive(driveDto);
                            if (!success) return Results.BadRequest();
                            return Results.Ok();
                        }).RequireAuthorization("Driver");

                        app.MapGet("/api/v1/drives", async (string role, int user) =>
                        {
                            var drives = await dds.GetDrives(role, user);
                            return Results.Ok(drives);
                        });

                        app.MapGet("/api/v1/drives/new", async () =>
                        {
                            var newDrives = await dds.GetNewDrives();
                            return Results.Ok(newDrives);
                        }).RequireAuthorization("Driver");

                        return app;
                    }))
            };
        }

        public string CreateToken(IConfiguration configuration, UserIdDto id)
        {
            var jwtSettings = configuration.GetSection("Jwt");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? ""));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: [
                    new Claim("id", id.Id.ToString()),
                    new Claim("role", id.Role)
                    ],
                expires: DateTime.Now.AddDays(double.Parse(jwtSettings["ExpirationTime"] ?? "")),
                signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

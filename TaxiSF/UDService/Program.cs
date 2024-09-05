using AutoMapper;
using Metadata;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Services.Runtime;
using System.Diagnostics;

namespace UDService
{
    internal static class Program
    {
        private static void Main()
        {
            try
            {
                IConfiguration configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json", optional: true, reloadOnChange: true).Build();
                ServiceCollection? serviceCollection = new ServiceCollection();
                serviceCollection.AddSingleton(configuration);
                serviceCollection.AddDbContext<EFDatabaseSqliteDbContext>(options => options.UseSqlite(configuration.GetConnectionString("db")));
                serviceCollection.AddAutoMapper(typeof(EFDatabaseMappers));
                ServiceProvider provider = serviceCollection.BuildServiceProvider();
                ServiceRuntime.RegisterServiceAsync("UDServiceType",
                    context => new UDService(context, provider.GetRequiredService<IMapper>())).GetAwaiter().GetResult();

                ServiceEventSource.Current.ServiceTypeRegistered(Process.GetCurrentProcess().Id, typeof(UDService).Name);

                Thread.Sleep(Timeout.Infinite);
            }
            catch (Exception e)
            {
                ServiceEventSource.Current.ServiceHostInitializationFailed(e.ToString());
                throw;
            }
        }
    }
}

using Metadata;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.Linq.Expressions;

namespace UDService
{
    public class EFDatabaseSqliteDbContext(DbContextOptions<EFDatabaseSqliteDbContext> options, IConfiguration config) : DbContext(options)
    {
        public DbSet<User> Users { get; set; } = default!;

        private readonly IConfiguration app = config;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                string? connectionString = app.GetConnectionString("db");
                if (!string.IsNullOrEmpty(connectionString)) optionsBuilder.UseSqlite(connectionString);
            }
        }

        public class EFContextual : IDesignTimeDbContextFactory<EFDatabaseSqliteDbContext>
        {
            public EFDatabaseSqliteDbContext CreateDbContext(string[] args)
            {
                var configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build();
                var optionsBuilder = new DbContextOptionsBuilder<EFDatabaseSqliteDbContext>();
                var connectionString = configuration.GetConnectionString("db");
                optionsBuilder.UseSqlite(connectionString);
                return new EFDatabaseSqliteDbContext(optionsBuilder.Options, configuration);
            }

            public static EFDatabaseSqliteDbContext EFSqliteContextual() => new EFContextual().CreateDbContext([]);
        }
    }

    public class EFDatabaseSqliteRepository
    {
        private readonly EFDatabaseSqliteDbContext _context;

        public EFDatabaseSqliteRepository() => _context = EFDatabaseSqliteDbContext.EFContextual.EFSqliteContextual();

        // Create
        public async Task<User> CreateAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        // Read
        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<IEnumerable<User>> GetByConditionAsync(Expression<Func<User, bool>> expression)
        {
            return await _context.Users.Where(expression).ToListAsync();
        }

        // Update
        public async Task<User?> UpdateAsync(User user)
        {
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return user;
        }

        // Delete
        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        // Get one entity by lambda expression
        public async Task<User?> GetOneByConditionAsync(Expression<Func<User, bool>> expression)
        {
            return await _context.Users.FirstOrDefaultAsync(expression);
        }

        // Get multiple entities by IDs
        public async Task<IEnumerable<User>> GetByIdsAsync(IEnumerable<int> ids)
        {
            return await _context.Users.Where(u => ids.Contains(u.Id)).ToListAsync();
        }

        // Count entities
        public async Task<int> CountAsync(Expression<Func<User, bool>>? expression = null)
        {
            return expression == null
                ? await _context.Users.CountAsync()
                : await _context.Users.CountAsync(expression);
        }

        // Check if any entity satisfies a condition
        public async Task<bool> AnyAsync(Expression<Func<User, bool>> expression)
        {
            return await _context.Users.AnyAsync(expression);
        }
    }
}

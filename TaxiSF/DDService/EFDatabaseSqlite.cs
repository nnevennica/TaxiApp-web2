﻿using Metadata;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.Linq.Expressions;

namespace DDService
{
    public class EFDatabaseSqliteDbContext(DbContextOptions<EFDatabaseSqliteDbContext> options, IConfiguration config) : DbContext(options)
    {
        public DbSet<Drive> Drives { get; set; } = default!;

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
        public async Task<Drive> CreateAsync(Drive drive)
        {
            _context.Drives.Add(drive);
            await _context.SaveChangesAsync();
            return drive;
        }

        // Read
        public async Task<Drive?> GetByIdAsync(int id)
        {
            return await _context.Drives.FindAsync(id);
        }

        public async Task<IEnumerable<Drive>> GetAllAsync()
        {
            return await _context.Drives.ToListAsync();
        }

        public async Task<IEnumerable<Drive>> GetByConditionAsync(Expression<Func<Drive, bool>> expression)
        {
            return await _context.Drives.Where(expression).ToListAsync();
        }

        // Update
        public async Task<Drive?> UpdateAsync(Drive drive)
        {
            _context.Entry(drive).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return drive;
        }

        // Get one entity by lambda expression
        public async Task<Drive?> GetOneByConditionAsync(Expression<Func<Drive, bool>> expression)
        {
            return await _context.Drives.FirstOrDefaultAsync(expression);
        }
    }
}

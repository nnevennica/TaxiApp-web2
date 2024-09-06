using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDService.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Drives",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    DriverId = table.Column<int>(type: "INTEGER", nullable: true),
                    StartAddress = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    EndAddress = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    WaitingTime = table.Column<int>(type: "INTEGER", nullable: false),
                    TravelTime = table.Column<int>(type: "INTEGER", nullable: true),
                    DriveStatus = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drives", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Drives");
        }
    }
}

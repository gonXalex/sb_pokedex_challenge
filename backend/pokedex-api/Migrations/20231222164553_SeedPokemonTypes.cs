using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pokedex_api.Migrations
{
    /// <inheritdoc />
    public partial class SeedPokemonTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PokemonPokemonType_PokemonType_TypesId",
                table: "PokemonPokemonType");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonType",
                table: "PokemonType");

            migrationBuilder.RenameTable(
                name: "PokemonType",
                newName: "PokemonTypes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonTypes",
                table: "PokemonTypes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonPokemonType_PokemonTypes_TypesId",
                table: "PokemonPokemonType",
                column: "TypesId",
                principalTable: "PokemonTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            var typeNames = new List<string>
            {
                "Acero", "Agua", "Bicho", "Dragón", "Eléctrico",
                "Fantasma", "Fuego", "Hada", "Hielo", "Lucha",
                "Normal", "Planta", "Psíquico", "Roca", "Siniestro",
                "Tierra", "Veneno", "Volador"
            };

            foreach (var typeName in typeNames)
            {
                migrationBuilder.InsertData(
                    table: "PokemonTypes",
                    columns: new[] { "TypeName" },
                    values: new object[] { typeName });
            }
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PokemonPokemonType_PokemonTypes_TypesId",
                table: "PokemonPokemonType");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonTypes",
                table: "PokemonTypes");

            migrationBuilder.RenameTable(
                name: "PokemonTypes",
                newName: "PokemonType");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonType",
                table: "PokemonType",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonPokemonType_PokemonType_TypesId",
                table: "PokemonPokemonType",
                column: "TypesId",
                principalTable: "PokemonType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
                
            migrationBuilder.Sql("DELETE FROM PokemonTypes");
        }
    }
}

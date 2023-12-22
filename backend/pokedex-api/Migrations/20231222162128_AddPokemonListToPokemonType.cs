using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pokedex_api.Migrations
{
    /// <inheritdoc />
    public partial class AddPokemonListToPokemonType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PokemonType_Pokemons_PokemonId",
                table: "PokemonType");

            migrationBuilder.DropIndex(
                name: "IX_PokemonType_PokemonId",
                table: "PokemonType");

            migrationBuilder.DropColumn(
                name: "PokemonId",
                table: "PokemonType");

            migrationBuilder.CreateTable(
                name: "PokemonPokemonType",
                columns: table => new
                {
                    PokemonsId = table.Column<int>(type: "int", nullable: false),
                    TypesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokemonPokemonType", x => new { x.PokemonsId, x.TypesId });
                    table.ForeignKey(
                        name: "FK_PokemonPokemonType_PokemonType_TypesId",
                        column: x => x.TypesId,
                        principalTable: "PokemonType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PokemonPokemonType_Pokemons_PokemonsId",
                        column: x => x.PokemonsId,
                        principalTable: "Pokemons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PokemonPokemonType_TypesId",
                table: "PokemonPokemonType",
                column: "TypesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PokemonPokemonType");

            migrationBuilder.AddColumn<int>(
                name: "PokemonId",
                table: "PokemonType",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PokemonType_PokemonId",
                table: "PokemonType",
                column: "PokemonId");

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonType_Pokemons_PokemonId",
                table: "PokemonType",
                column: "PokemonId",
                principalTable: "Pokemons",
                principalColumn: "Id");
        }
    }
}

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using pokedex_api.Entities;

namespace pokedex_api.Data;

public class PokedexDbContext : IdentityDbContext
{
    public PokedexDbContext(DbContextOptions<PokedexDbContext> options) : base(options)
    {
    }

    public DbSet<Pokemon> Pokemons { get; set; }
    public DbSet<PokemonType> PokemonTypes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Pokemon>()
            .Property(x => x.Weight)
            .HasColumnType("decimal(6,2)");
    }
}

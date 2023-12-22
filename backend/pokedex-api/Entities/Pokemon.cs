using pokedex_api.Entities.Enums;

namespace pokedex_api.Entities;

public class Pokemon
{
    public int? Id { get; set; }
    public string? Name { get; set; }
    public PokemonGender? Gender { get; set; }
    public string? ImageUrl { get; set; }
    public ICollection<PokemonType> Types { get; set; } = [];
    public decimal? Weight { get; set; }
    public List<string>? Abilities { get; set; }
    public int? Hp { get; set; }
    public int? Def { get; set; }
    public int? Atk { get; set; }
    public int? Spdf { get; set; }
    public int? Spatk { get; set; }
    public int? Spd { get; set; }
}

public class PokemonType
{
    public int? Id { get; set; }
    public string? TypeName { get; set; }
    public List<Pokemon>? Pokemons { get; set; }
}

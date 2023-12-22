using pokedex_api.Entities;
using pokedex_api.Entities.Enums;

namespace pokedex_api.Models;

public class ListPokemonModel
{
    public ListPokemonModel(Pokemon pokemon)
    {
        Id = pokemon.Id;
        Name = pokemon.Name;
        Gender = pokemon.Gender;
        ImageUrl = pokemon.ImageUrl;
        PokemonTypes = pokemon.Types.Select(x => new PokemonTypeModel()
        {
            Id = x.Id, 
            TypeName = x.TypeName
        });
        Weight = pokemon.Weight;
        Abilities = pokemon.Abilities;
        Hp = pokemon.Hp;
        Def = pokemon.Def;
        Atk = pokemon.Atk;
        Spdf = pokemon.Spdf;
        Spatk = pokemon.Spatk;
        Spd = pokemon.Spd;
    }

    public int? Id { get; set; }
    public string? Name { get; set; }
    public PokemonGender? Gender { get; set; }
    public string? ImageUrl { get; set; }
    public IEnumerable<PokemonTypeModel>? PokemonTypes { get; set; }
    public decimal? Weight { get; set; }
    public List<string>? Abilities { get; set; }
    public int? Hp { get; set; }
    public int? Def { get; set; }
    public int? Atk { get; set; }
    public int? Spdf { get; set; }
    public int? Spatk { get; set; }
    public int? Spd { get; set; }
}
public class PokemonTypeModel 
{
    public int? Id { get; set; }
    public string? TypeName { get; set; }
}
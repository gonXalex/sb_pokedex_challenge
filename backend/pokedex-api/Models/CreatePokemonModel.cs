using pokedex_api.Entities;
using pokedex_api.Entities.Enums;
using System.Collections.Generic;
using System.Linq;


namespace pokedex_api.Models;

public class CreatePokemonModel
{
    public string? Name { get; set; }
    public PokemonGender? Gender { get; set; }
    public string? ImageUrl { get; set; }

    public decimal? Weight { get; set; }
    public List<string>? Abilities { get; set; }
    public List<int> TypeIds { get; set; } = [];
    public int? Hp { get; set; }
    public int? Atk { get; set; }
    public int? Spdf { get; set; }
    public int? Def { get; set; }
    public int? Spatk { get; set; }
    public int? Spd { get; set; }

    internal Pokemon ToPokemon()
        {
            var pokemon = new Pokemon
            {
                Name = Name,
                Gender = Gender,
                ImageUrl = ImageUrl,
                Weight = Weight,
                Abilities = Abilities,
                Hp = Hp,
                Def = Def,
                Atk = Atk,
                Spdf = Spdf,
                Spatk = Spatk,
                Spd = Spd,
            };

            return pokemon;
        }
}

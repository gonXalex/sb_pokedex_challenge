using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pokedex_api.Data;
using pokedex_api.Entities;
using pokedex_api.Entities.Enums;
using pokedex_api.Models;
using System.ComponentModel.DataAnnotations;

namespace pokedex_api.Controllers;

[ApiController]
[Route("[controller]")]
public class PokemonsController : ControllerBase
{
    private readonly ILogger<PokemonsController> _logger;
    private readonly PokedexDbContext _dbContext;

    public PokemonsController(ILogger<PokemonsController> logger, PokedexDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<PaginatedResult<ListPokemonModel>> GetAll(
        int skip = 0,
        [Range(0, 100)] int take = 20)
    {
        var query = _dbContext.Pokemons.Include(x => x.Types).AsQueryable();

        var pokemons = await query
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        var pokemonModels = pokemons.Select(x => new ListPokemonModel(x));
        return new PaginatedResult<ListPokemonModel>(pokemonModels, query.Count());
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesErrorResponseType(typeof(void))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PokemonModel>> GetById(int id)
    {
        var pokemon = await _dbContext.Pokemons.FirstOrDefaultAsync(x => x.Id == id);

        if (pokemon is null)
            return NotFound();

        return new PokemonModel(pokemon);
    }

    [HttpGet("{id}/types")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<PokemonType>>> GetPokemonTypes(int id)
    {
        var pokemon = await _dbContext.Pokemons
            .Include(p => p.Types) 
            .FirstOrDefaultAsync(p => p.Id == id);

        if (pokemon is null)
            return NotFound();

        var types = pokemon.Types;
        return Ok(types);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [Authorize]
    public async Task<IActionResult> Create(CreatePokemonModel request)
    {
        var pokemon = request.ToPokemon();
        foreach(var id in request.TypeIds) 
        {
            var type = await _dbContext.PokemonTypes.FindAsync(id);

            if(type == null) 
            {
                return BadRequest("El id del PokeonType es invalido");
            }
            
            pokemon.Types.Add(type);
        }
        await _dbContext.Pokemons.AddAsync(pokemon);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = pokemon.Id }, null);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesErrorResponseType(typeof(void))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    public async Task<IActionResult> Update(int id, UpdatePokemonModel request)
    {
        var pokemon = await _dbContext.Pokemons.FindAsync(id);

        if (pokemon is null)
            return NotFound();

        _dbContext.Entry(pokemon).CurrentValues.SetValues(request);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var pokemon = await _dbContext.Pokemons.FindAsync(id);

        if (pokemon is null)
            return NotFound();

        _dbContext.Pokemons.Remove(pokemon);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}

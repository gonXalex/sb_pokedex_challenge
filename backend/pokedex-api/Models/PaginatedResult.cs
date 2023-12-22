namespace pokedex_api.Models;

public class PaginatedResult<T> where T : class
{
    public PaginatedResult(IEnumerable<T> items, int totalCount)
    {
        Data = items;
        TotalCount = totalCount;
    }

    public int TotalCount { get; set; }
    public IEnumerable<T> Data { get; set; } = [];
}

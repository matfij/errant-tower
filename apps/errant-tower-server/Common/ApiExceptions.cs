namespace ErrantTowerServer.Common;

public class ApiError
{
    public string Key { get; set; } = String.Empty;
    public string? Field { get; set; }
}

public class ApiException(string key, string? field = null) : Exception(String.Empty)
{
    public string Key { get; } = key;
    public string? Field { get; } = field;
}

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    private readonly RequestDelegate _next = next;
    private readonly ILogger<ExceptionMiddleware> _logger = logger;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ApiException ex)
        {
            _logger.LogWarning(ex, "API Exception: {Key}", ex.Key);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsJsonAsync(
                new { error = new { key = ex.Key, field = ex.Field } }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled Exception: {Message}", ex.Message);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsJsonAsync(new { error = new { key = "errors.fatal" } });
        }
    }
}

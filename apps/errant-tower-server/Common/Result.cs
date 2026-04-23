using Microsoft.AspNetCore.Mvc;

namespace ErrantTowerServer.Common;

public class ApiError
{
    public required string Key { get; set; }
    public string? Field { get; set; } = null;
}

public class Result
{
    public bool IsSuccess { get; }
    public List<ApiError> Errors { get; }

    protected Result(bool isSuccess, List<ApiError>? errors)
    {
        IsSuccess = isSuccess;
        Errors = errors ?? [];
    }

    public static Result Success() => new(true, null);

    public static Result Failure(List<ApiError> errors) => new(false, errors);
}

public class Result<T> : Result
{
    public T? Value { get; }

    protected Result(T value) : base(true, null)
    {
        Value = value;
    }

    protected Result(List<ApiError> errors) : base(false, errors) { }

    public static Result<T> Success(T value) => new(value);

    public static new Result<T> Failure(List<ApiError> errors) => new(errors);
}

public static class ResultExtensions
{
    public static IActionResult ToActionResult(this Result result)
    {
        return result.IsSuccess ? new OkResult() : new BadRequestObjectResult(result);
    }

    public static IActionResult ToActionResult<T>(this Result<T> result)
    {
        return result.IsSuccess ? new OkObjectResult(result.Value) : new BadRequestObjectResult(result);
    }

    public static async Task<Result<U>> Bind<T, U>(
        this Task<Result<T>> resultTask,
        Func<T, Task<Result<U>>> function)
    {
        var result = await resultTask;
        if (!result.IsSuccess)
        {
            return Result<U>.Failure(result.Errors);
        }
        return await function(result.Value!);
    }

    public static Result<U> Map<T, U>(
        this Result<T> result,
        Func<T, U> function)
    {
        if (!result.IsSuccess)
        {
            return Result<U>.Failure(result.Errors);
        }
        return Result<U>.Success(function(result.Value!));
    }
}

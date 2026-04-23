namespace ErrantTowerServer.Common;

public class ApiError
{
    public string Key { get; set; } = default!;
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

    public static Result<U> Matp<T, U>(
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

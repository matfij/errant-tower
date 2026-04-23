using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.User;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Resend;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactClient", policy =>
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddSingleton(provider =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection is required");
    return new MongoClient(connectionString);
});

builder.Services.AddSingleton(provider =>
{
    var client = provider.GetRequiredService<MongoClient>();
    var databaseName = builder.Configuration.GetValue<string>("DatabaseName")
        ?? throw new InvalidOperationException("DatabaseName configuration is required");
    return client.GetDatabase(databaseName);
});
builder.Services.AddHostedService<MongoDbIndexService>();

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(x => x.Value?.Errors.Count > 0)
            .SelectMany(x => x.Value!.Errors.Select(e => new ApiError
            {
                Key = "errors.validation",
                Field = x.Key
            }))
            .ToList();
        var result = Result.Failure(errors);
        return new BadRequestObjectResult(result);
    };
});

builder.Services.AddOptions();
builder.Services.AddHttpClient<ResendClient>();
builder.Services.Configure<ResendClientOptions>(options =>
{
    var apiKey = builder.Configuration.GetValue<string>("Email:ApiKey")
        ?? throw new InvalidOperationException("Email:ApiKey configuration is required");
    options.ApiToken = apiKey;
});
builder.Services.AddTransient<IResend, ResendClient>();
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("ReactClient");
app.UseAuthorization();

app.MapControllers();

app.Run();

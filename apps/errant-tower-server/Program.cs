using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.User;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Resend;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// CORS
builder
    .Services
    .AddCors(options =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? throw new InvalidOperationException("Cors:AllowedOrigins configuration is required");

        options.AddPolicy("ReactClient", policy =>
            policy
                .WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials());
    });

// Session authorization
builder
    .Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "errant_tower_auth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.None;
        options.ExpireTimeSpan = TimeSpan.FromDays(7);
        options.SlidingExpiration = true;
    });
builder.Services.AddAuthorization();

// MongoDB
builder
    .Services
    .AddSingleton(provider =>
    {
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection is required");
        return new MongoClient(connectionString);
    });

builder
    .Services
    .AddSingleton(provider =>
    {
        var client = provider.GetRequiredService<MongoClient>();
        var databaseName = builder.Configuration.GetValue<string>("DatabaseName")
            ?? throw new InvalidOperationException("DatabaseName configuration is required");
        return client.GetDatabase(databaseName);
    });
builder.Services.AddHostedService<MongoDbIndexService>();

// Configure API behavior for model validation errors
builder
    .Services
    .Configure<ApiBehaviorOptions>(options =>
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

            return new BadRequestObjectResult(new { errors });
        };
    });

// Resend email service
builder.Services.AddOptions();
builder.Services.AddHttpClient<ResendClient>();
builder
    .Services
    .Configure<ResendClientOptions>(options =>
    {
        var apiKey = builder.Configuration.GetValue<string>("Email:ApiKey")
            ?? throw new InvalidOperationException("Email:ApiKey configuration is required");
        options.ApiToken = apiKey;
    });
builder.Services.AddTransient<IResend, ResendClient>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Domain services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();
app.UseCors("ReactClient");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

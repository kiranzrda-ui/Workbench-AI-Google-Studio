using Microsoft.EntityFrameworkCore;
using Serilog;
using Workbench.Api.Persistence;
using Workbench.Api.Services;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<WorkbenchDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));

builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IModelService, ModelService>();

builder.Services.AddHealthChecks().AddNpgSql(builder.Configuration.GetConnectionString("Postgres")!);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSerilogRequestLogging();
app.UseHttpsRedirection();
app.MapHealthChecks("/health");
app.MapControllers();

await app.RunAsync();

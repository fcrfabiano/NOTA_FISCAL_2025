using Notas.Domain.Repositories;
using Notas.Infrastructure.Repositories;
using Notas.Application.Services;
using Notas.Application.DTOs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddSingleton<INotaRepository, InNotaMemoryRepository>();
builder.Services.AddScoped<NotaService>();

var app = builder.Build();

app.UseCors("AllowAll");

app.MapPost("/notas", async (CreateNotaDto dto, NotaService notaService) => {
    if (string.IsNullOrWhiteSpace(dto.Numero) || string.IsNullOrWhiteSpace(dto.Cliente))
        return Results.BadRequest("Número e Cliente são obrigatórios");

    var created = await notaService.CreateAsync(dto);

    return Results.Created($"/notas/{created.Id}", created);
});

app.MapGet("/notas", async (NotaService notaService) => {
    var notas = await notaService.GetAllAsync();

    var response = notas.Select(
        nota => new {
            nota.Id,
            nota.Numero,
            nota.Cliente,
            nota.Valor,
            DataEmissao = nota.DataEmissao.ToString("dd/MM/yyyy"),
            DataCadastro = nota.DataCadastro.ToString("dd/MM/yyyy")
        }
    );

    return Results.Ok(response);
});

app.Run();
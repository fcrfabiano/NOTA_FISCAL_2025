namespace Notas.Application.DTOs
{
    public record NotaViewDto(string Id, string Numero, string Cliente, decimal Valor, DateTime DataEmissao, DateTime DataCadastro);
}
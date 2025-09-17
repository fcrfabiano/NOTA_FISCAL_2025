using System;

namespace Notas.Domain.Entities
{
    public class NotaFiscal
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string Numero { get; private set; }
        public string Cliente { get; private set; }
        public decimal Valor { get; private set; }
        public DateTime DataEmissao { get; private set; }
        public DateTime DataCadastro { get; private set; }

        public NotaFiscal(string numero, string cliente, decimal valor, DateTime dataEmissao)
        {
            if(string.IsNullOrWhiteSpace(numero)) throw new ArgumentException("Número obrigatório", nameof(numero));
            if(string.IsNullOrWhiteSpace(cliente)) throw new ArgumentException("Cliente obrigatório", nameof(cliente));
            if(valor <= 0) throw new ArgumentException("Valor deve ser maior que 0", nameof(valor));

            Numero = numero;
            Cliente = cliente;
            Valor = valor;
            DataEmissao = dataEmissao;
            DataCadastro = DateTime.UtcNow;
        }
    }
}
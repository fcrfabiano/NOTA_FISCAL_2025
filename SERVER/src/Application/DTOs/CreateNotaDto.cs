using System.ComponentModel.DataAnnotations;

namespace Notas.Application.DTOs
{
    public class CreateNotaDto
    {
        [Required]
        public string Numero { get; set; }

        [Required]
        public string Cliente { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Valor { get; set; }

        [Required]
        public DateTime DataEmissao { get; set; }
    }
}
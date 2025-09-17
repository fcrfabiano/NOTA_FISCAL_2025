using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Notas.Domain.Repositories;
using Notas.Domain.Entities;
using Notas.Application.DTOs;

namespace Notas.Application.Services
{
    public class NotaService
    {
        private readonly INotaRepository _repo;

        public NotaService(INotaRepository repo) => _repo = repo;

        public async Task<NotaViewDto> CreateAsync(CreateNotaDto dto)
        {
            var nota = new NotaFiscal(dto.Numero, dto.Cliente, dto.Valor, dto.DataEmissao);
            await _repo.AddAsync(nota);
            return new NotaViewDto(nota.Id.ToString(), nota.Numero, nota.Cliente, nota.Valor, nota.DataEmissao, nota.DataCadastro);
        }

        public async Task<IEnumerable<NotaViewDto>> GetAllAsync()
        {
            var notas = await _repo.GetAllAsync();

            return notas.Select(
                nota=> new NotaViewDto(
                    nota.Id.ToString(),
                    nota.Numero,
                    nota.Cliente,
                    nota.Valor,
                    nota.DataEmissao,
                    nota.DataCadastro
                    )
                );
        }
    }
}

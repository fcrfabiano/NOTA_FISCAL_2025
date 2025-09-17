using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Notas.Domain.Repositories;
using Notas.Domain.Entities;
using System;

namespace Notas.Infrastructure.Repositories
{
    public class InNotaMemoryRepository : INotaRepository
    {
        private static readonly List<NotaFiscal> _store = new();
        private static readonly object _lock = new();
        
        public Task AddAsync(NotaFiscal nota)
        {
            lock(_lock)
            {
                _store.Add(nota);
            }

            return Task.CompletedTask;
        }

        public Task<IEnumerable<NotaFiscal>> GetAllAsync()
        {
            IEnumerable<NotaFiscal> copy;

            lock(_lock)
            {
                copy = _store.ToList();
            }

            return Task.FromResult(copy);
        }
    }
}

import React from 'react';
import { TransacaoFinanceira, TipoTransacao } from '../../types';

interface ListaTransacoesProps {
  transacoes: TransacaoFinanceira[];
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString + 'T00:00:00'); // Assume data local se não houver hora
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const ListaTransacoes: React.FC<ListaTransacoesProps> = ({ transacoes }) => {
  if (transacoes.length === 0) {
    return <p className="text-center text-gray-500 py-8">Nenhuma transação registrada ainda.</p>;
  }

  const sortedTransacoes = [...transacoes].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
      <h3 className="text-xl font-semibold text-gray-700 p-4 border-b">Histórico de Transações</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descrição
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoria
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Detalhe (Pag./Gasto)
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedTransacoes.map((transacao) => (
            <tr key={transacao.id} className={transacao.tipo === TipoTransacao.SAIDA ? 'bg-red-50 hover:bg-red-100' : 'bg-green-50 hover:bg-green-100'}>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatDate(transacao.data)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  transacao.tipo === TipoTransacao.ENTRADA 
                    ? 'bg-green-200 text-green-800' 
                    : 'bg-red-200 text-red-800'
                }`}>
                  {transacao.tipo}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 max-w-xs truncate" title={transacao.descricao}>
                {transacao.descricao}
                {transacao.pacienteNome && <span className="block text-xs text-gray-500">Paciente: {transacao.pacienteNome}</span>}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {transacao.categoria || 'N/A'}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {transacao.tipo === TipoTransacao.ENTRADA ? transacao.metodoPagamento || 'N/A' : transacao.tipoGasto || 'N/A'}
              </td>
              <td className={`px-4 py-4 whitespace-nowrap text-sm text-right font-medium ${
                transacao.tipo === TipoTransacao.ENTRADA ? 'text-green-700' : 'text-red-700'
              }`}>
                {formatCurrency(transacao.valor)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaTransacoes;

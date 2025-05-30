
import React, { useState, useMemo } from 'react';
import { TransacaoFinanceira, TipoTransacao } from '../types';
import TransacaoFormModal from '../components/financeiro/TransacaoFormModal';
import ListaTransacoes from '../components/financeiro/ListaTransacoes';

interface FinanceiroPageProps {
  transacoes: TransacaoFinanceira[];
  onAddTransacao: (transacaoData: Omit<TransacaoFinanceira, 'id' | 'pacienteNome'>) => void;
}

const FinanceiroPage: React.FC<FinanceiroPageProps> = ({ transacoes, onAddTransacao }) => {
  const [isTransacaoFormModalOpen, setIsTransacaoFormModalOpen] = useState(false);

  const handleOpenNewTransacaoModal = () => setIsTransacaoFormModalOpen(true);
  const handleCloseTransacaoFormModal = () => setIsTransacaoFormModalOpen(false);

  const handleSaveTransacao = (data: Omit<TransacaoFinanceira, 'id' | 'pacienteNome'>) => {
    onAddTransacao(data);
    handleCloseTransacaoFormModal();
  };

  const totalEntradas = useMemo(() => transacoes.filter(t => t.tipo === TipoTransacao.ENTRADA).reduce((sum, t) => sum + t.valor, 0), [transacoes]);
  const totalSaidas = useMemo(() => transacoes.filter(t => t.tipo === TipoTransacao.SAIDA).reduce((sum, t) => sum + t.valor, 0), [transacoes]);
  const saldoAtual = useMemo(() => totalEntradas - totalSaidas, [totalEntradas, totalSaidas]);

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3 sm:gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800">Financeiro</h2>
        <button onClick={handleOpenNewTransacaoModal} className="btn btn-primary w-full sm:w-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Nova Transação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <FinancialCard title="Total Entradas" value={formatCurrency(totalEntradas)} color="green" />
        <FinancialCard title="Total Saídas" value={formatCurrency(totalSaidas)} color="red" />
        <FinancialCard title="Saldo Atual" value={formatCurrency(saldoAtual)} color={saldoAtual >= 0 ? "blue" : "yellow"} />
      </div>

      <ListaTransacoes transacoes={transacoes} />

      {isTransacaoFormModalOpen && (
        <TransacaoFormModal
          isOpen={isTransacaoFormModalOpen}
          onClose={handleCloseTransacaoFormModal}
          onSave={handleSaveTransacao}
        />
      )}
    </div>
  );
};

interface FinancialCardProps {
    title: string;
    value: string;
    color: 'green' | 'red' | 'blue' | 'yellow';
}
const FinancialCard: React.FC<FinancialCardProps> = ({ title, value, color }) => {
    const colorClasses = {
        green: { bg: 'bg-emerald-50', border: 'border-emerald-200', textTitle: 'text-emerald-700', textValue: 'text-emerald-600' },
        red: { bg: 'bg-rose-50', border: 'border-rose-200', textTitle: 'text-rose-700', textValue: 'text-rose-600' },
        blue: { bg: 'bg-sky-50', border: 'border-sky-200', textTitle: 'text-sky-700', textValue: 'text-sky-600' },
        yellow: { bg: 'bg-amber-50', border: 'border-amber-200', textTitle: 'text-amber-700', textValue: 'text-amber-600' },
    };
    const currentColors = colorClasses[color];
    return (
        <div className={`${currentColors.bg} p-4 sm:p-6 rounded-xl shadow-lg text-center border ${currentColors.border}`}>
          <h3 className={`text-md sm:text-lg font-semibold ${currentColors.textTitle}`}>{title}</h3>
          <p className={`text-xl sm:text-2xl font-bold ${currentColors.textValue} mt-2`}>{value}</p>
        </div>
    );
}


export default FinanceiroPage;

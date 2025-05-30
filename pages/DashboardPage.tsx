import React, { useMemo } from 'react';
import { AgendaEvent, Paciente, TransacaoFinanceira, TipoTransacao } from '../types';

interface DashboardPageProps {
  agendaEvents?: AgendaEvent[];
  pacientes?: Paciente[];
  transacoes?: TransacaoFinanceira[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ agendaEvents = [], pacientes = [], transacoes = [] }) => {
  // Cálculos para estatísticas
  const hoje = new Date();
  const agendamentosHoje = useMemo(() => 
    agendaEvents.filter(event => {
      const eventDate = new Date(event.startDateTime);
      return eventDate.toDateString() === hoje.toDateString();
    }), [agendaEvents]);

  const proximosAgendamentos = useMemo(() => 
    agendaEvents
      .filter(event => new Date(event.startDateTime) > hoje)
      .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
      .slice(0, 5), [agendaEvents]);

  const resumoFinanceiro = useMemo(() => {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const transacoesMes = transacoes.filter(t => new Date(t.data) >= inicioMes);
    
    const entradas = transacoesMes.filter(t => t.tipo === TipoTransacao.ENTRADA)
      .reduce((sum, t) => sum + t.valor, 0);
    const saidas = transacoesMes.filter(t => t.tipo === TipoTransacao.SAIDA)
      .reduce((sum, t) => sum + t.valor, 0);
    
    return { entradas, saidas, saldo: entradas - saidas };
  }, [transacoes]);

  const formatCurrency = (value: number) => 
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const formatDate = (date: Date) => 
    new Date(date).toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

  return (
    <div className="p-2 sm:p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800">Dashboard</h2>
        <div className="text-sm text-slate-600">
          {hoje.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
          })}
        </div>
      </div>

      {/* Resumo do Dia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-lg border border-sky-100">
          <h3 className="text-lg font-semibold text-sky-700 mb-2">Agendamentos Hoje</h3>
          <div className="text-3xl font-bold text-sky-600">{agendamentosHoje.length}</div>
          <p className="text-sm text-slate-600 mt-1">
            {agendamentosHoje.length === 0 
              ? 'Nenhum agendamento para hoje' 
              : `${agendamentosHoje.length} ${agendamentosHoje.length === 1 ? 'agendamento' : 'agendamentos'} programados`}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-emerald-100">
          <h3 className="text-lg font-semibold text-emerald-700 mb-2">Total de Pacientes</h3>
          <div className="text-3xl font-bold text-emerald-600">{pacientes.length}</div>
          <p className="text-sm text-slate-600 mt-1">
            {pacientes.length === 0 
              ? 'Nenhum paciente cadastrado' 
              : `${pacientes.length} ${pacientes.length === 1 ? 'paciente' : 'pacientes'} no sistema`}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg border border-indigo-100">
          <h3 className="text-lg font-semibold text-indigo-700 mb-2">Saldo do Mês</h3>
          <div className={`text-3xl font-bold ${resumoFinanceiro.saldo >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
            {formatCurrency(resumoFinanceiro.saldo)}
          </div>
          <p className="text-sm text-slate-600 mt-1">
            {resumoFinanceiro.entradas > 0 && `Entradas: ${formatCurrency(resumoFinanceiro.entradas)}`}
            {resumoFinanceiro.saidas > 0 && ` | Saídas: ${formatCurrency(resumoFinanceiro.saidas)}`}
          </p>
        </div>
      </div>

      {/* Próximos Compromissos e Resumo Financeiro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Compromissos */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Próximos Compromissos</h3>
          {proximosAgendamentos.length > 0 ? (
            <div className="space-y-3">
              {proximosAgendamentos.map((event, index) => (
                <div key={index} className="flex items-center p-3 bg-slate-50 rounded-lg">
                  <div className="flex-shrink-0 w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-slate-800">{event.pacienteNome}</p>
                    <p className="text-sm text-slate-600">{formatDate(new Date(event.startDateTime))}</p>
                    <p className="text-sm text-sky-600">{event.tipo}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">Nenhum compromisso agendado</p>
          )}
        </div>

        {/* Resumo Financeiro Detalhado */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Resumo Financeiro do Mês</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-3 rounded-lg">
                <p className="text-sm text-emerald-700 font-medium">Entradas</p>
                <p className="text-xl font-bold text-emerald-600">{formatCurrency(resumoFinanceiro.entradas)}</p>
              </div>
              <div className="bg-rose-50 p-3 rounded-lg">
                <p className="text-sm text-rose-700 font-medium">Saídas</p>
                <p className="text-xl font-bold text-rose-600">{formatCurrency(resumoFinanceiro.saidas)}</p>
              </div>
            </div>
            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between items-center">
                <p className="text-slate-700 font-medium">Saldo do Mês</p>
                <p className={`text-lg font-bold ${resumoFinanceiro.saldo >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatCurrency(resumoFinanceiro.saldo)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores de Produtividade */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Indicadores de Produtividade</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">Taxa de Ocupação</p>
            <div className="mt-2 flex items-end">
              <div className="text-2xl font-bold text-slate-800">
                {agendamentosHoje.length > 0 ? `${Math.min(100, (agendamentosHoje.length / 8) * 100).toFixed(0)}%` : '0%'}
              </div>
              <p className="ml-2 text-sm text-slate-500">da agenda</p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">Média de Pacientes/Dia</p>
            <div className="mt-2 flex items-end">
              <div className="text-2xl font-bold text-slate-800">
                {agendaEvents.length > 0 
                  ? (agendaEvents.length / 30).toFixed(1) 
                  : '0'}
              </div>
              <p className="ml-2 text-sm text-slate-500">últimos 30 dias</p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">Ticket Médio</p>
            <div className="mt-2 flex items-end">
              <div className="text-2xl font-bold text-slate-800">
                {transacoes.length > 0 
                  ? formatCurrency(transacoes.reduce((sum, t) => sum + t.valor, 0) / transacoes.length)
                  : formatCurrency(0)}
              </div>
              <p className="ml-2 text-sm text-slate-500">por procedimento</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, bgColor="bg-slate-50", borderColor="border-slate-200", textColor="text-slate-700" }) => (
  <div className={`p-4 rounded-lg shadow-md border ${bgColor} ${borderColor}`}>
    <h3 className={`font-semibold ${textColor}`}>{title}</h3>
    {children}
  </div>
);

export default DashboardPage;

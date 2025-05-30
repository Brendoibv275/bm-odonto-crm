
import React from 'react';
import { AgendaEvent, AgendaEventType, AgendaEventStatus } from '../../types';

interface AgendaEventItemProps {
  event: AgendaEvent;
  onEventClick: (event: AgendaEvent) => void;
}

const getEventStyle = (type: AgendaEventType, status: AgendaEventStatus): string => {
  if (status === AgendaEventStatus.CANCELADO) return 'bg-slate-200 border-slate-400 text-slate-500 line-through opacity-80 hover:bg-slate-300';
  if (status === AgendaEventStatus.CONCLUIDO) return 'bg-emerald-100 border-emerald-300 text-emerald-700 opacity-90 hover:bg-emerald-200';
  
  const baseHover = 'hover:shadow-lg hover:brightness-105';
  switch (type) {
    case AgendaEventType.AGENDAMENTO_TRATAMENTO: return `bg-sky-100 border-sky-300 text-sky-800 ${baseHover}`;
    case AgendaEventType.AVALIACAO: return `bg-indigo-100 border-indigo-300 text-indigo-800 ${baseHover}`;
    case AgendaEventType.CONSULTA_INICIAL: return `bg-purple-100 border-purple-300 text-purple-800 ${baseHover}`;
    case AgendaEventType.REUNIAO: return `bg-amber-100 border-amber-300 text-amber-800 ${baseHover}`;
    case AgendaEventType.EVENTO_GERAL: return `bg-slate-100 border-slate-300 text-slate-700 ${baseHover}`;
    case AgendaEventType.BLOQUEIO: return `bg-rose-100 border-rose-300 text-rose-700 ${baseHover}`;
    default: return `bg-slate-100 border-slate-300 text-slate-700 ${baseHover}`;
  }
};

const AgendaEventItem: React.FC<AgendaEventItemProps> = ({ event, onEventClick }) => {
  const startTime = new Date(event.startDateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const styleClass = getEventStyle(event.tipo, event.status);
  let displayTime = startTime;
  if(event.tipo === AgendaEventType.BLOQUEIO && new Date(event.endDateTime).getTime() - new Date(event.startDateTime).getTime() > 23 * 60 * 60 * 1000){
    displayTime = "Dia todo";
  }

  return (
    <div 
        className={`p-2 rounded-lg border text-xs shadow-md ${styleClass} cursor-pointer transition-all duration-150 ease-in-out transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1`}
        title={`${event.tipo} - ${event.titulo}\nStatus: ${event.status}${event.pacienteNome ? `\nPaciente: ${event.pacienteNome}` : ''}`}
        onClick={() => onEventClick(event)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onEventClick(event);}}
    >
      <p className="font-semibold truncate text-[13px] leading-tight">{displayTime} - {event.titulo}</p>
      {event.pacienteNome && event.tipo !== AgendaEventType.BLOQUEIO && (
        <p className="text-[11px] truncate opacity-80">Paciente: {event.pacienteNome}</p>
      )}
       {(event.status !== AgendaEventStatus.AGENDADO || event.tipo === AgendaEventType.BLOQUEIO) && (
         <p className="text-[11px] font-medium mt-0.5 opacity-90">Status: {event.status}</p>
      )}
    </div>
  );
};

export default AgendaEventItem;

import React from 'react';
import { AgendaEvent } from '../../types';
import AgendaEventItem from './AgendaEventItem';

interface AgendaDayColumnProps {
  date: Date;
  dayName: string;
  events: AgendaEvent[];
  onEventClick: (event: AgendaEvent) => void; // Nova prop
}

const AgendaDayColumn: React.FC<AgendaDayColumnProps> = ({ date, dayName, events, onEventClick }) => {
  const isToday = new Date().toDateString() === date.toDateString();

  return (
    <div className={`flex flex-col ${isToday ? 'bg-sky-50' : 'bg-white'}`}>
      <div className={`p-2 border-b border-gray-200 text-center sticky top-0 ${isToday ? 'bg-sky-100' : 'bg-gray-50'} z-10`}>
        <p className={`text-sm font-semibold ${isToday ? 'text-sky-700' : 'text-gray-700'}`}>{dayName}</p>
        <p className={`text-xs ${isToday ? 'text-sky-600' : 'text-gray-500'}`}>{date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</p>
      </div>
      <div className="flex-grow overflow-y-auto p-1 space-y-1">
        {events.length > 0 ? (
          events.map(event => (
            <AgendaEventItem 
              key={event.id} 
              event={event} 
              onEventClick={onEventClick} // Passar handler
            />
          ))
        ) : (
          <p className="text-xs text-gray-400 text-center mt-4">Nenhum evento.</p>
        )}
      </div>
    </div>
  );
};

export default AgendaDayColumn;
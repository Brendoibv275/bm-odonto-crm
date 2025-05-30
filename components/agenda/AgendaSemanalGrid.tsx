import React from 'react';
import { AgendaEvent } from '../../types';
import AgendaDayColumn from './AgendaDayColumn';

interface AgendaSemanalGridProps {
  startDateOfWeek: Date; // Deve ser um Sábado
  allEvents: AgendaEvent[];
  onEventClick: (event: AgendaEvent) => void; // Nova prop
}

const AgendaSemanalGrid: React.FC<AgendaSemanalGridProps> = ({ startDateOfWeek, allEvents, onEventClick }) => {
  const daysOfWeek: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDateOfWeek);
    day.setDate(startDateOfWeek.getDate() + i);
    daysOfWeek.push(day);
  }

  const getEventsForDay = (date: Date): AgendaEvent[] => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return allEvents
      .filter(event => {
        const eventStartDate = new Date(event.startDateTime);
        const eventEndDate = new Date(event.endDateTime);
        // Evento começa antes ou no mesmo dia E termina depois ou no mesmo dia
        // Considera eventos que cruzam o dia
        return eventStartDate <= dayEnd && eventEndDate >= dayStart;
      })
      .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
  };

  const dayNames = ["Sábado", "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 h-full divide-x divide-gray-200 border-t border-gray-200">
      {daysOfWeek.map((day, index) => (
        <AgendaDayColumn
          key={day.toISOString()}
          date={day}
          dayName={dayNames[index]} 
          events={getEventsForDay(day)}
          onEventClick={onEventClick} // Passar handler
        />
      ))}
    </div>
  );
};

export default AgendaSemanalGrid;
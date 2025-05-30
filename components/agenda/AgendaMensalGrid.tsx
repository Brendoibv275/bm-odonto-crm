import React from 'react';
import { AgendaEvent, AgendaEventType } from '../../types';

interface AgendaMensalGridProps {
  currentMonthDate: Date; 
  allEvents: AgendaEvent[];
  onEventClick: (event: AgendaEvent) => void; // Nova prop
}

const AgendaMensalGrid: React.FC<AgendaMensalGridProps> = ({ currentMonthDate, allEvents, onEventClick }) => {
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); 

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth: Date[] = [];
  for (let d = new Date(firstDayOfMonth); d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) {
    daysInMonth.push(new Date(d));
  }

  const firstDayGrid = new Date(firstDayOfMonth);
  // Ajustar para Sábado como início da semana (0 = Sábado, 1 = Domingo, ..., 6 = Sexta)
  const startDayOffset = (firstDayGrid.getDay() + 1) % 7; // Sábado = 0
  firstDayGrid.setDate(firstDayGrid.getDate() - startDayOffset);


  const allGridCells: (Date | null)[] = [];
  const tempDate = new Date(firstDayGrid);
  // Gerar células para 6 semanas (42 dias) para garantir cobertura
  for(let i = 0; i < 42; i++) {
    allGridCells.push(new Date(tempDate));
    tempDate.setDate(tempDate.getDate() + 1);
  }


  const getEventsForDay = (date: Date): AgendaEvent[] => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return allEvents.filter(event => {
      const eventStartDate = new Date(event.startDateTime);
      const eventEndDate = new Date(event.endDateTime);
      return eventStartDate <= dayEnd && eventEndDate >= dayStart;
    }).sort((a,b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
  };

  const dayNames = ["Sáb", "Dom", "Seg", "Ter", "Qua", "Qui", "Sex"];

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 border-b border-gray-200">
        {dayNames.map(name => (
          <div key={name} className="py-2 text-center text-xs font-medium text-gray-500 uppercase">
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 grid-rows-6 flex-grow divide-x divide-y divide-gray-200">
        {allGridCells.map((dayCell, index) => {
          if (!dayCell) { // Should not happen with the new logic, but as a fallback
            return <div key={`pad-${index}`} className="bg-gray-50"></div>;
          }
          const day = dayCell as Date; // Cast as it's always a Date now
          const isToday = new Date().toDateString() === day.toDateString();
          const isCurrentMonth = day.getMonth() === month;
          const eventsOnDay = getEventsForDay(day);

          return (
            <div 
              key={day.toISOString()} 
              className={`p-1.5 relative flex flex-col ${
                !isCurrentMonth ? 'bg-gray-50 opacity-60' : isToday ? 'bg-sky-50' : 'bg-white'
              } hover:bg-gray-100 transition-colors`}
            >
              <span className={`text-xs font-medium ${
                !isCurrentMonth ? 'text-gray-400' : isToday ? 'text-sky-600 font-bold' : 'text-gray-700'
              }`}>
                {day.getDate()}
              </span>
              <div className="mt-1 space-y-0.5 overflow-y-auto flex-grow max-h-20 text-[10px]">
                {eventsOnDay.slice(0, 2).map(event => ( // Show max 2 events initially for monthly view
                  <div 
                    key={event.id} 
                    className={`px-1 py-0.5 rounded truncate cursor-pointer ${
                      event.tipo === AgendaEventType.AGENDAMENTO_TRATAMENTO ? 'bg-sky-100 text-sky-700' :
                      event.tipo === AgendaEventType.BLOQUEIO ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}
                    title={event.titulo}
                    onClick={() => onEventClick(event)} // Adicionar onClick
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') onEventClick(event);}}
                  >
                    {event.titulo}
                  </div>
                ))}
                {eventsOnDay.length > 2 && (
                  <div className="text-sky-600 font-semibold">+{eventsOnDay.length - 2} mais</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgendaMensalGrid;
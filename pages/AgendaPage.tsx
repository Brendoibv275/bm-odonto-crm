
import React, { useState, useMemo, useCallback } from 'react';
import { AgendaEvent, Paciente, AgendaEventStatus } from '../types';
import AgendaSemanalGrid from '../components/agenda/AgendaSemanalGrid';
import AgendaMensalGrid from '../components/agenda/AgendaMensalGrid';
import AgendaEventFormModal from '../components/agenda/AgendaEventFormModal';

interface AgendaPageProps {
  agendaEvents: AgendaEvent[];
  onAddAgendaEvent: (eventData: Omit<AgendaEvent, 'id'>) => void; 
  onUpdateAgendaEvent: (eventData: AgendaEvent) => void;
  pacientes: Paciente[]; 
}

type ViewMode = 'semanal' | 'mensal';

const getWeekStartDate = (date: Date): Date => {
  const newDate = new Date(date);
  const dayOfWeek = newDate.getDay(); 
  const diffToSaturday = dayOfWeek === 6 ? 0 : dayOfWeek + 1; 
  newDate.setDate(newDate.getDate() - diffToSaturday);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const AgendaPage: React.FC<AgendaPageProps> = ({ agendaEvents, onAddAgendaEvent, onUpdateAgendaEvent, pacientes }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('semanal');
  const [isEventFormModalOpen, setIsEventFormModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AgendaEvent | null>(null);

  const startDateOfWeek = useMemo(() => getWeekStartDate(currentDate), [currentDate]);

  const handlePrevious = useCallback(() => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (viewMode === 'semanal') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setMonth(newDate.getMonth() - 1);
      }
      return newDate;
    });
  }, [viewMode]);

  const handleNext = useCallback(() => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (viewMode === 'semanal') {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  }, [viewMode]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode(prevMode => prevMode === 'semanal' ? 'mensal' : 'semanal');
  }, []);

  const handleOpenNewEventModal = useCallback(() => {
    setEditingEvent(null);
    setIsEventFormModalOpen(true);
  }, []);

  const handleOpenEditEventModal = useCallback((event: AgendaEvent) => {
    setEditingEvent(event);
    setIsEventFormModalOpen(true);
  }, []);

  const handleCloseEventFormModal = useCallback(() => {
    setIsEventFormModalOpen(false);
    setEditingEvent(null);
  }, []);

  const handleSaveEvent = useCallback((eventData: Omit<AgendaEvent, 'id'> | AgendaEvent) => {
    if (editingEvent && 'id' in eventData) {
        onUpdateAgendaEvent(eventData as AgendaEvent);
    } else if (!editingEvent && !('id' in eventData)) {
        onAddAgendaEvent(eventData as Omit<AgendaEvent, 'id'>);
    }
    handleCloseEventFormModal();
  }, [onAddAgendaEvent, onUpdateAgendaEvent, handleCloseEventFormModal, editingEvent]);

  const formatDateRange = (date: Date, mode: ViewMode): string => {
    if (mode === 'semanal') {
      const start = getWeekStartDate(date);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const startDay = start.toLocaleDateString('pt-BR', { day: '2-digit' });
      const startMonth = start.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
      const endDay = end.toLocaleDateString('pt-BR', { day: '2-digit'});
      const endMonth = end.toLocaleDateString('pt-BR', { month: 'short'}).replace('.', '');
      const year = start.getFullYear();
      if (startMonth === endMonth) return `${startDay} - ${endDay} de ${startMonth} ${year}`;
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
    } else {
      return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    }
  };

  return (
    <div className="p-2 sm:p-4 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800">Agenda</h2>
          <p className="text-md sm:text-lg text-sky-600 font-medium">{formatDateRange(currentDate, viewMode)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleToday} className="btn btn-secondary px-3 py-2 text-sm">Hoje</button>
          <div className="flex items-center">
            <button onClick={handlePrevious} className="p-2.5 text-slate-600 bg-white hover:bg-slate-200 rounded-l-md shadow-sm border border-r-0 border-slate-300" title={viewMode === 'semanal' ? "Semana Anterior" : "Mês Anterior"}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={handleNext} className="p-2.5 text-slate-600 bg-white hover:bg-slate-200 rounded-r-md shadow-sm border border-slate-300" title={viewMode === 'semanal' ? "Próxima Semana" : "Próximo Mês"}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <button onClick={handleOpenNewEventModal} className="btn btn-primary text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            Novo Evento
          </button>
          <button onClick={toggleViewMode} className="btn btn-secondary text-sm">
            {viewMode === 'semanal' ? 'Visão Mensal' : 'Visão Semanal'}
          </button>
        </div>
      </div>
      
      <div className="flex-grow bg-white p-1 sm:p-2 rounded-xl shadow-xl overflow-hidden">
        {viewMode === 'semanal' ? (
            <AgendaSemanalGrid startDateOfWeek={startDateOfWeek} allEvents={agendaEvents} onEventClick={handleOpenEditEventModal} />
        ) : (
            <AgendaMensalGrid currentMonthDate={currentDate} allEvents={agendaEvents} onEventClick={handleOpenEditEventModal} />
        )}
      </div>
      {isEventFormModalOpen && (
        <AgendaEventFormModal
            isOpen={isEventFormModalOpen} onClose={handleCloseEventFormModal}
            onSaveEvent={handleSaveEvent} pacientes={pacientes} eventToEdit={editingEvent}
        />
      )}
    </div>
  );
};

export default AgendaPage;

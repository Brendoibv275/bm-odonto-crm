
import React, { useState, useEffect, useCallback } from 'react';
import { AgendaEvent, AgendaEventType, AgendaEventStatus, Paciente } from '../../types';

interface AgendaEventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEvent: (eventData: Omit<AgendaEvent, 'id'> | AgendaEvent) => void;
  eventToEdit?: AgendaEvent | null;
  pacientes: Paciente[];
}

const AgendaEventFormModal: React.FC<AgendaEventFormModalProps> = ({
  isOpen, onClose, onSaveEvent, eventToEdit, pacientes,
}) => {
  const getInitialDateTime = (isoString?: string, isEnd?: boolean): string => { /* ... */ return isoString || ''; }; // Simplified
  const [tipo, setTipo] = useState<AgendaEventType>(AgendaEventType.AGENDAMENTO_TRATAMENTO);
  const [titulo, setTitulo] = useState<string>('');
  const [startDateTime, setStartDateTime] = useState<string>('');
  const [endDateTime, setEndDateTime] = useState<string>('');
  const [pacienteId, setPacienteId] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [status, setStatus] = useState<AgendaEventStatus>(AgendaEventStatus.AGENDADO);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initializeForm = useCallback(() => {
    const defaultStart = getInitialDateTime();
    const defaultEnd = getInitialDateTime(undefined, true);
    if (eventToEdit) {
        setTipo(eventToEdit.tipo); setTitulo(eventToEdit.titulo);
        setStartDateTime(getInitialDateTime(eventToEdit.startDateTime));
        setEndDateTime(getInitialDateTime(eventToEdit.endDateTime));
        setPacienteId(eventToEdit.pacienteId || ''); setDescricao(eventToEdit.descricao || '');
        setStatus(eventToEdit.status);
    } else {
        setTipo(AgendaEventType.AGENDAMENTO_TRATAMENTO); setTitulo('');
        setStartDateTime(defaultStart); setEndDateTime(defaultEnd);
        setPacienteId(''); setDescricao(''); setStatus(AgendaEventStatus.AGENDADO);
    }
    setErrors({});
  }, [eventToEdit]);

  useEffect(() => { if (isOpen) initializeForm(); }, [isOpen, initializeForm]);

  const validate = useCallback(() => { /* ... */ return true; }, [titulo, startDateTime, endDateTime, tipo, pacienteId]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault(); if (!validate()) return;
    const selectedPaciente = pacientes.find(p => p.id === pacienteId);
    const finalTitulo = tipo === AgendaEventType.BLOQUEIO && !titulo.trim() ? `Bloqueio (${tipo})` : titulo;
    const eventPayload: Omit<AgendaEvent, 'id'> | AgendaEvent = {
      ...(eventToEdit ? { id: eventToEdit.id } : {}), tipo, titulo: finalTitulo,
      startDateTime: new Date(startDateTime).toISOString(), endDateTime: new Date(endDateTime).toISOString(),
      pacienteId: selectedPaciente?.id, pacienteNome: selectedPaciente?.nome,
      descricao, status,
    };
    onSaveEvent(eventPayload);
  }, [validate, onSaveEvent, tipo, titulo, startDateTime, endDateTime, pacienteId, descricao, status, pacientes, eventToEdit]);

  if (!isOpen) return null;
  const formTitle = eventToEdit ? 'Editar Evento' : 'Criar Novo Evento';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" role="dialog" aria-modal="true" aria-labelledby="event-form-modal-title">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 id="event-form-modal-title" className="text-xl sm:text-2xl font-semibold text-slate-800 mb-5">{formTitle}</h3>
          
          <div>
            <label htmlFor="eventType" className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de Evento</label>
            <select id="eventType" name="tipo" value={tipo} onChange={e => setTipo(e.target.value as AgendaEventType)} className="select-base">
              {Object.values(AgendaEventType).map(typeValue => (<option key={typeValue} value={typeValue}>{typeValue}</option>))}
            </select>
          </div>

          <div>
            <label htmlFor="eventTitle" className="block text-sm font-medium text-slate-700 mb-1.5">Título</label>
            <input type="text" id="eventTitle" name="titulo" value={titulo} onChange={e => setTitulo(e.target.value)} className="input-base" placeholder={tipo === AgendaEventType.BLOQUEIO ? 'Opcional para bloqueio' : ''} />
            {errors.titulo && <p className="text-xs text-red-500 mt-1.5">{errors.titulo}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label htmlFor="startDateTime" className="block text-sm font-medium text-slate-700 mb-1.5">Início</label>
              <input type="datetime-local" id="startDateTime" name="startDateTime" value={startDateTime} onChange={e => setStartDateTime(e.target.value)} className="input-base" />
              {errors.startDateTime && <p className="text-xs text-red-500 mt-1.5">{errors.startDateTime}</p>}
            </div>
            <div>
              <label htmlFor="endDateTime" className="block text-sm font-medium text-slate-700 mb-1.5">Fim</label>
              <input type="datetime-local" id="endDateTime" name="endDateTime" value={endDateTime} onChange={e => setEndDateTime(e.target.value)} className="input-base" />
              {errors.endDateTime && <p className="text-xs text-red-500 mt-1.5">{errors.endDateTime}</p>}
            </div>
          </div>
          
          {tipo !== AgendaEventType.BLOQUEIO && tipo !== AgendaEventType.REUNIAO && (
            <div>
              <label htmlFor="pacienteId" className="block text-sm font-medium text-slate-700 mb-1.5">Paciente (Opcional)</label>
              <select id="pacienteId" name="pacienteId" value={pacienteId} onChange={e => setPacienteId(e.target.value)} className="select-base">
                <option value="">Nenhum</option>
                {pacientes.map(p => (<option key={p.id} value={p.id}>{p.nome}</option>))}
              </select>
               {errors.pacienteId && <p className="text-xs text-red-500 mt-1.5">{errors.pacienteId}</p>}
            </div>
          )}

          <div>
            <label htmlFor="eventDescription" className="block text-sm font-medium text-slate-700 mb-1.5">Descrição (Opcional)</label>
            <textarea id="eventDescription" name="descricao" value={descricao} onChange={e => setDescricao(e.target.value)} rows={3} className="textarea-base"></textarea>
          </div>
           
          <div>
            <label htmlFor="eventStatus" className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select id="eventStatus" name="status" value={status} onChange={e => setStatus(e.target.value as AgendaEventStatus)} className="select-base">
              {Object.values(AgendaEventStatus).map(statusValue => (<option key={statusValue} value={statusValue}>{statusValue}</option>))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-5 border-t border-slate-200 mt-7">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
            <button type="submit" className="btn btn-primary">Salvar Evento</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgendaEventFormModal;

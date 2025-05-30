
import React, { useState, useCallback } from 'react';
import { TratamentoPacienteDisplay } from '../../types';

interface AgendamentoTratamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dia: string, hora: string) => void;
  tratamentoInfo?: { nomeProcedimento: string; denteNumero: number; } | null;
}

const AgendamentoTratamentoModal: React.FC<AgendamentoTratamentoModalProps> = ({
  isOpen, onClose, onConfirm, tratamentoInfo,
}) => {
  const [dia, setDia] = useState<string>(new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState<string>('09:00');

  const handleConfirm = useCallback(() => {
    if (dia && hora) onConfirm(dia, hora);
    else alert('Por favor, selecione o dia e a hora.');
  }, [dia, hora, onConfirm]);

  if (!isOpen || !tratamentoInfo) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" role="dialog" aria-modal="true" aria-labelledby="agendamento-modal-title">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
        <h3 id="agendamento-modal-title" className="text-xl font-semibold text-slate-800 mb-3">
          Agendar Tratamento
        </h3>
        <p className="text-sm text-slate-600 mb-1">Procedimento: <span className="font-medium text-slate-700">{tratamentoInfo.nomeProcedimento}</span></p>
        <p className="text-sm text-slate-600 mb-5">Dente: <span className="font-medium text-slate-700">{tratamentoInfo.denteNumero}</span></p>
        
        <div className="space-y-5">
          <div>
            <label htmlFor="agendamento-dia" className="block text-sm font-medium text-slate-700 mb-1.5">Dia</label>
            <input type="date" id="agendamento-dia" value={dia} onChange={(e) => setDia(e.target.value)} className="input-base" min={new Date().toISOString().split('T')[0]}/>
          </div>
          <div>
            <label htmlFor="agendamento-hora" className="block text-sm font-medium text-slate-700 mb-1.5">Hora</label>
            <input type="time" id="agendamento-hora" value={hora} onChange={(e) => setHora(e.target.value)} className="input-base"/>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
          <button type="button" onClick={handleConfirm} className="btn btn-primary">Confirmar Agendamento</button>
        </div>
      </div>
    </div>
  );
};

export default AgendamentoTratamentoModal;

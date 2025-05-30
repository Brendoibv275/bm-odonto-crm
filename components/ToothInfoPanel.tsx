
import React, { useState, useEffect, useCallback } from 'react';
// FIX: Use Tooth, StatusGeralDenteTipo from types. Remove ToothCondition.
import { Tooth, StatusGeralDenteTipo } from '../types';
// FIX: Use STATUS_GERAL_DENTE_LABELS from constants.
import { STATUS_GERAL_DENTE_LABELS } from '../constants';

interface ToothInfoPanelProps {
  selectedTooth: Tooth | null;
  onUpdateTooth: (updatedTooth: Tooth) => void;
  onClosePanel: () => void;
}

const ToothInfoPanel: React.FC<ToothInfoPanelProps> = ({ selectedTooth, onUpdateTooth, onClosePanel }) => {
  // FIX: Rename state to reflect it's a StatusGeralDenteTipo and use StatusGeralDenteTipo type
  const [currentStatusTipo, setCurrentStatusTipo] = useState<StatusGeralDenteTipo | ''>('');
  const [currentNotes, setCurrentNotes] = useState<string>('');

  useEffect(() => {
    if (selectedTooth) {
      // FIX: Access selectedTooth.statusGeral.tipo
      setCurrentStatusTipo(selectedTooth.statusGeral.tipo);
      setCurrentNotes(selectedTooth.notes || '');
    } else {
      // FIX: Reset currentStatusTipo
      setCurrentStatusTipo('');
      setCurrentNotes('');
    }
  }, [selectedTooth]);

  // FIX: Rename handler and update type
  const handleStatusTipoChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentStatusTipo(e.target.value as StatusGeralDenteTipo);
  }, []);

  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentNotes(e.target.value);
  }, []);

  const handleSaveChanges = useCallback(() => {
    // FIX: Check currentStatusTipo
    if (selectedTooth && currentStatusTipo !== '') {
      // FIX: Update selectedTooth.statusGeral.tipo correctly
      onUpdateTooth({
        ...selectedTooth,
        statusGeral: {
          // Spread existing statusGeral properties if any, though this old panel doesn't manage them
          ...(selectedTooth.statusGeral || {}), 
          tipo: currentStatusTipo as StatusGeralDenteTipo,
        },
        notes: currentNotes,
      });
    }
    // FIX: Update dependencies
  }, [selectedTooth, currentStatusTipo, currentNotes, onUpdateTooth]);

  if (!selectedTooth) {
    return (
      <div className="p-6 bg-white shadow-xl rounded-lg h-full flex flex-col justify-center items-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-sky-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-2.471rm-1.131-1.131l2.471-.569-2.225 2.511M3 11.952V8.548a2.25 2.25 0 012.25-2.25h2.998c.513 0 .983.208 1.32.549l6.356 6.356a2.25 2.25 0 010 3.182l-2.998 2.998a2.25 2.25 0 01-3.182 0l-6.356-6.356A2.25 2.25 0 013 11.952z" />
        </svg>
        <p className="text-xl font-semibold text-gray-700">Nenhum Dente Selecionado</p>
        <p className="text-sm text-gray-500 mt-1">Clique em um dente no odontograma para ver os detalhes.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-xl rounded-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-sky-700">Dente {selectedTooth.number}</h3>
        <button
          onClick={onClosePanel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fechar painel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-6 flex-grow">
        <div>
          {/* FIX: Update label text to "Status Atual" */}
          <label htmlFor="toothCondition" className="block text-sm font-medium text-gray-700 mb-1">
            Status Atual
          </label>
          <select
            id="toothCondition" // ID can remain, but it now refers to status
            name="toothCondition"
            // FIX: Use currentStatusTipo and handleStatusTipoChange
            value={currentStatusTipo}
            onChange={handleStatusTipoChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md shadow-sm"
          >
            {/* FIX: Update placeholder text */}
            <option value="" disabled>Selecione um status</option>
            {/* FIX: Iterate over StatusGeralDenteTipo and use STATUS_GERAL_DENTE_LABELS. statusType is a string and a valid key. */}
            {Object.values(StatusGeralDenteTipo).map((statusType) => (
              <option key={statusType} value={statusType}>
                {STATUS_GERAL_DENTE_LABELS[statusType]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="toothNotes" className="block text-sm font-medium text-gray-700 mb-1">
            Anotações
          </label>
          <textarea
            id="toothNotes"
            name="toothNotes"
            rows={4}
            value={currentNotes}
            onChange={handleNotesChange}
            placeholder="Adicione anotações sobre o dente..."
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
          ></textarea>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleSaveChanges}
          // FIX: Disable based on currentStatusTipo
          disabled={currentStatusTipo === ''}
          className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-md shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default ToothInfoPanel;

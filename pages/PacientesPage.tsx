
import React, { useState, useCallback } from 'react';
import { Paciente, AnamneseClinicaData, Tooth, ExameExtraoralData, ExameIntraoralData, AgendaEvent, TransacaoFinanceira } from '../types';
import PacienteForm from '../components/pacientes/PacienteForm';
import PacienteList from '../components/pacientes/PacienteList';
import PacienteDetailPage from './PacienteDetailPage';

interface PacientesPageProps {
  pacientes: Paciente[];
  onSavePaciente: (pacienteData: Omit<Paciente, 'id' | 'odontograma' | 'anamnese' | 'exameExtraoral' | 'exameIntraoral'> | Paciente) => void;
  onDeletePaciente: (pacienteId: string) => void;
  onSaveAnamnese: (pacienteId: string, anamneseData: AnamneseClinicaData) => void;
  onSaveExameExtraoral: (pacienteId: string, exameData: ExameExtraoralData) => void;
  onSaveExameIntraoral: (pacienteId: string, exameData: ExameIntraoralData) => void;
  onUpdateOdontograma: (pacienteId: string, updatedTeeth: Tooth[]) => void;
  onAddAgendaEvent: (eventData: Omit<AgendaEvent, 'id'>) => void; 
  onAddTransacaoFinanceira: (transacaoData: Omit<TransacaoFinanceira, 'id'>) => void;
}


const PacientesPage: React.FC<PacientesPageProps> = ({
    pacientes,
    onSavePaciente,
    onDeletePaciente,
    onSaveAnamnese,
    onSaveExameExtraoral,
    onSaveExameIntraoral,
    onUpdateOdontograma,
    onAddAgendaEvent,
    onAddTransacaoFinanceira
}) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);
  const [selectedPacienteId, setSelectedPacienteId] = useState<string | null>(null);

  const handleOpenForm = useCallback(() => {
    setEditingPaciente(null);
    setIsFormModalOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingPaciente(null);
  }, []);

  const handleEditPaciente = useCallback((paciente: Paciente) => {
    setEditingPaciente(paciente);
    setIsFormModalOpen(true);
  }, []);

  const handleViewDetails = useCallback((pacienteId: string) => {
    setSelectedPacienteId(pacienteId);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedPacienteId(null);
  }, []);

  const selectedPaciente = pacientes.find(p => p.id === selectedPacienteId);

  if (selectedPaciente) {
    return (
      <PacienteDetailPage 
        paciente={selectedPaciente} 
        onGoBack={handleBackToList}
        onSaveAnamnese={onSaveAnamnese}
        onSaveExameExtraoral={onSaveExameExtraoral}
        onSaveExameIntraoral={onSaveExameIntraoral}
        onUpdateOdontograma={onUpdateOdontograma}
        onAddAgendaEvent={onAddAgendaEvent}
        onAddTransacaoFinanceira={onAddTransacaoFinanceira}
      />
    );
  }

  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3 sm:gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800">Gerenciamento de Pacientes</h2>
        <button
          onClick={handleOpenForm}
          className="btn btn-primary w-full sm:w-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Novo Paciente
        </button>
      </div>

      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" role="dialog" aria-modal="true" aria-labelledby="form-title">
            <div className="bg-white p-5 sm:p-8 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-100">
                 <PacienteForm
                    onSave={(data) => {
                        onSavePaciente(data);
                        handleCloseForm();
                    }}
                    onCancel={handleCloseForm}
                    initialData={editingPaciente}
                />
            </div>
        </div>
      )}

      <PacienteList 
        pacientes={pacientes}
        onEdit={handleEditPaciente}
        onDelete={onDeletePaciente}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default PacientesPage;

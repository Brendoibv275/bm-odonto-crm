import React from 'react';
import { Paciente } from '../../types';

interface PacienteListItemProps {
  paciente: Paciente;
  onEdit: (paciente: Paciente) => void;
  onDelete: (pacienteId: string) => void;
  onViewDetails: (pacienteId: string) => void;
}

const PacienteListItem: React.FC<PacienteListItemProps> = ({ paciente, onEdit, onDelete, onViewDetails }) => {
  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };
  
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{paciente.nome}</div>
        {paciente.email && <div className="text-xs text-gray-500">{paciente.email}</div>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatCPF(paciente.cpf)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{paciente.telefone}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <button
          onClick={() => onViewDetails(paciente.id)}
          className="text-sky-600 hover:text-sky-800 transition-colors"
          title="Ver Detalhes"
        >
          Ver Detalhes
        </button>
        <button
          onClick={() => onEdit(paciente)}
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
          title="Editar"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(paciente.id)}
          className="text-red-600 hover:text-red-800 transition-colors"
          title="Excluir"
        >
          Excluir
        </button>
      </td>
    </tr>
  );
};

export default PacienteListItem;

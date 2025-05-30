import React from 'react';
import { Paciente } from '../../types';
import PacienteListItem from './PacienteListItem';

interface PacienteListProps {
  pacientes: Paciente[];
  onEdit: (paciente: Paciente) => void;
  onDelete: (pacienteId: string) => void;
  onViewDetails: (pacienteId: string) => void;
}

const PacienteList: React.FC<PacienteListProps> = ({ pacientes, onEdit, onDelete, onViewDetails }) => {
  if (pacientes.length === 0) {
    return <p className="text-center text-gray-500 py-8">Nenhum paciente cadastrado ainda.</p>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CPF
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Telefone
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pacientes.map((paciente) => (
            <PacienteListItem
              key={paciente.id}
              paciente={paciente}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewDetails={onViewDetails}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PacienteList;

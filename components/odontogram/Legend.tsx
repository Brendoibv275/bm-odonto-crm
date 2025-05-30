import React from 'react';
import { StatusGeralDenteTipo } from '../../types';
import { STATUS_GERAL_DENTE_COLORS, STATUS_GERAL_DENTE_LABELS } from '../../constants';

const Legend: React.FC = () => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Legenda - Status Geral</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Object.values(StatusGeralDenteTipo).map((statusKey) => {
          const status = statusKey as StatusGeralDenteTipo;
          return (
            <div key={status} className="flex items-center space-x-2">
              <div className={`w-5 h-5 rounded ${STATUS_GERAL_DENTE_COLORS[status]}`}></div>
              <span className="text-sm text-gray-600">{STATUS_GERAL_DENTE_LABELS[status]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Legend;

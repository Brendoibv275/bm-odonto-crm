
import React from 'react';
// FIX: Use StatusGeralDenteTipo from types
import { StatusGeralDenteTipo } from '../types';
// FIX: Use STATUS_GERAL_DENTE_COLORS and STATUS_GERAL_DENTE_LABELS from constants
import { STATUS_GERAL_DENTE_COLORS, STATUS_GERAL_DENTE_LABELS } from '../constants';

const Legend: React.FC = () => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      {/* FIX: Update title to reflect new status types */}
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Legenda - Status Geral</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {/* FIX: Iterate over Object.values(StatusGeralDenteTipo) */}
        {Object.values(StatusGeralDenteTipo).map((statusKey) => {
          // FIX: Cast statusKey to StatusGeralDenteTipo
          const status = statusKey as StatusGeralDenteTipo;
          return (
            // FIX: Use status as key
            <div key={status} className="flex items-center space-x-2">
              {/* FIX: Use STATUS_GERAL_DENTE_COLORS[status] */}
              <div className={`w-5 h-5 rounded ${STATUS_GERAL_DENTE_COLORS[status]}`}></div>
              {/* FIX: Use STATUS_GERAL_DENTE_LABELS[status] */}
              <span className="text-sm text-gray-600">{STATUS_GERAL_DENTE_LABELS[status]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Legend;

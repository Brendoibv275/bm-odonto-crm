import React from 'react';
import { Tooth as ToothType, StatusGeralDenteTipo } from '../../types';
import { STATUS_GERAL_DENTE_COLORS, STATUS_GERAL_DENTE_LABELS } from '../../constants';

interface ToothProps {
  toothData: ToothType;
  onSelectTooth: (tooth: ToothType) => void;
  isSelected: boolean;
}

const Tooth: React.FC<ToothProps> = ({ toothData, onSelectTooth, isSelected }) => {
  const { number, statusGeral } = toothData;
  const currentStatusTipo = statusGeral?.tipo || StatusGeralDenteTipo.PRESENTE;

  const colorClass = STATUS_GERAL_DENTE_COLORS[currentStatusTipo] || 'bg-gray-300 hover:bg-gray-400';
  const textColorClass = currentStatusTipo === StatusGeralDenteTipo.EXTRAIDO ? 'text-white' : 'text-gray-800';
  const borderClass = isSelected ? 'ring-2 ring-sky-500 ring-offset-1' : 'border border-gray-400';

  const displayLabel = STATUS_GERAL_DENTE_LABELS[currentStatusTipo];
  let shortLabel = '';
  if (currentStatusTipo === StatusGeralDenteTipo.EXTRAIDO) shortLabel = '(X)';
  if (currentStatusTipo === StatusGeralDenteTipo.AUSENTE_AGENESIA) shortLabel = '(AG)';
  if (currentStatusTipo === StatusGeralDenteTipo.NAO_ERUPCIONADO_INCLUSO) shortLabel = '(NE)';
  if (currentStatusTipo === StatusGeralDenteTipo.RAIZ_RESIDUAL) shortLabel = '(RR)';
  if (currentStatusTipo === StatusGeralDenteTipo.DECIDUO) shortLabel = '(D)';


  return (
    <button
      onClick={() => onSelectTooth(toothData)}
      className={`w-12 h-16 m-1 flex flex-col items-center justify-center rounded-md shadow transition-all duration-150 ease-in-out transform hover:scale-105 ${colorClass} ${borderClass}`}
      aria-label={`Dente ${number}, Status: ${displayLabel}`}
      title={`Dente ${number}: ${displayLabel}`}
    >
      <span className={`font-bold text-sm ${textColorClass}`}>{number}</span>
      {shortLabel && (
         <span className={`text-xs ${textColorClass}`}>{shortLabel}</span>
      )}
    </button>
  );
};

export default Tooth;

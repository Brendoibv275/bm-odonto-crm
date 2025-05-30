
import React from 'react';
import { Tooth as ToothType, StatusGeralDenteTipo } from '../types';
import { STATUS_GERAL_DENTE_COLORS, STATUS_GERAL_DENTE_LABELS } from '../constants';

interface ToothProps {
  toothData: ToothType;
  onSelectTooth: (tooth: ToothType) => void;
  isSelected: boolean;
}

const Tooth: React.FC<ToothProps> = ({ toothData, onSelectTooth, isSelected }) => {
  const { number, statusGeral } = toothData;
  const currentStatusTipo = statusGeral?.tipo || StatusGeralDenteTipo.PRESENTE;

  const colorClass = STATUS_GERAL_DENTE_COLORS[currentStatusTipo] || 'bg-slate-300 hover:bg-slate-400';
  const textColorClass = currentStatusTipo === StatusGeralDenteTipo.EXTRAIDO ? 'text-white' : 'text-slate-800';
  const borderClass = isSelected ? 'ring-2 ring-sky-500 ring-offset-2 shadow-lg' : 'border border-slate-400 hover:border-sky-500';

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
      className={`w-14 h-20 m-1 flex flex-col items-center justify-center rounded-lg shadow-md transition-all duration-150 ease-in-out transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1 ${colorClass} ${borderClass}`}
      aria-label={`Dente ${number}, Status: ${displayLabel}`}
      title={`Dente ${number}: ${displayLabel}`}
    >
      <span className={`font-bold text-base ${textColorClass}`}>{number}</span>
      {shortLabel && (
         <span className={`text-xs mt-0.5 ${textColorClass}`}>{shortLabel}</span>
      )}
    </button>
  );
};

export default Tooth;

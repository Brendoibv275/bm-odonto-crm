import React from 'react';
import { Tooth as ToothType, Quadrant } from '../../types';
import { TEETH_DISPLAY_ORDER_MAP, QUADRANT_DISPLAY_ORDER } from '../../constants';
import ToothComponent from './Tooth';

interface OdontogramDisplayProps {
  teeth: ToothType[];
  selectedTooth: ToothType | null;
  onSelectTooth: (tooth: ToothType) => void;
}

const QuadrantSection: React.FC<{
  quadrantName: string;
  teethInQuadrant: ToothType[];
  selectedTooth: ToothType | null;
  onSelectTooth: (tooth: ToothType) => void;
}> = ({ quadrantName, teethInQuadrant, selectedTooth, onSelectTooth }) => (
  <div className="p-2">
    <h4 className="text-sm font-medium text-gray-600 mb-2 text-center">{quadrantName}</h4>
    <div className="flex flex-wrap justify-center">
      {teethInQuadrant.map((tooth) => (
        <ToothComponent
          key={tooth.id}
          toothData={tooth}
          onSelectTooth={onSelectTooth}
          isSelected={selectedTooth?.id === tooth.id}
        />
      ))}
    </div>
  </div>
);

const OdontogramDisplay: React.FC<OdontogramDisplayProps> = ({ teeth, selectedTooth, onSelectTooth }) => {
  const getQuadrantTeeth = (quadrant: Quadrant): ToothType[] => {
    const orderedNumbers = TEETH_DISPLAY_ORDER_MAP[quadrant];
    return orderedNumbers.map(num => teeth.find(t => t.number === num)).filter(Boolean) as ToothType[];
  };
  
  const upperLeftTeeth = getQuadrantTeeth(QUADRANT_DISPLAY_ORDER.UPPER_ROW_LEFT); // Q2
  const upperRightTeeth = getQuadrantTeeth(QUADRANT_DISPLAY_ORDER.UPPER_ROW_RIGHT); // Q1
  const lowerLeftTeeth = getQuadrantTeeth(QUADRANT_DISPLAY_ORDER.LOWER_ROW_LEFT); // Q3
  const lowerRightTeeth = getQuadrantTeeth(QUADRANT_DISPLAY_ORDER.LOWER_ROW_RIGHT); // Q4

  return (
    <div className="bg-white p-4 md:p-6 shadow-lg rounded-lg w-full">
      <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">Odontograma (Vista do Profissional)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-300 border border-gray-300">
        {/* Upper Row */}
        <div className="bg-slate-50">
          <QuadrantSection 
            quadrantName={`Quadrante ${QUADRANT_DISPLAY_ORDER.UPPER_ROW_LEFT} (Sup. Esq. Paciente)`}
            teethInQuadrant={upperLeftTeeth} 
            selectedTooth={selectedTooth} 
            onSelectTooth={onSelectTooth} 
          />
        </div>
        <div className="bg-slate-50">
          <QuadrantSection 
            quadrantName={`Quadrante ${QUADRANT_DISPLAY_ORDER.UPPER_ROW_RIGHT} (Sup. Dir. Paciente)`}
            teethInQuadrant={upperRightTeeth} 
            selectedTooth={selectedTooth} 
            onSelectTooth={onSelectTooth} 
          />
        </div>
        {/* Lower Row */}
        <div className="bg-slate-50">
           <QuadrantSection 
            quadrantName={`Quadrante ${QUADRANT_DISPLAY_ORDER.LOWER_ROW_LEFT} (Inf. Esq. Paciente)`}
            teethInQuadrant={lowerLeftTeeth} 
            selectedTooth={selectedTooth} 
            onSelectTooth={onSelectTooth} 
          />
        </div>
        <div className="bg-slate-50">
          <QuadrantSection 
            quadrantName={`Quadrante ${QUADRANT_DISPLAY_ORDER.LOWER_ROW_RIGHT} (Inf. Dir. Paciente)`}
            teethInQuadrant={lowerRightTeeth} 
            selectedTooth={selectedTooth} 
            onSelectTooth={onSelectTooth} 
          />
        </div>
      </div>
       <p className="text-xs text-gray-500 mt-4 text-center">
        Numeração FDI. Visualização como se estivesse olhando para o paciente.
      </p>
    </div>
  );
};

export default OdontogramDisplay;

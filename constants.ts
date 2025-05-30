import { Quadrant, Tooth, ProcedimentoDentario, StatusGeralDenteTipo, StatusGeralDente, FaceDentaria } from './types';

// Mapeamento de cores para o novo StatusGeralDenteTipo
export const STATUS_GERAL_DENTE_COLORS: Record<StatusGeralDenteTipo, string> = {
  [StatusGeralDenteTipo.PRESENTE]: 'bg-green-500 hover:bg-green-600',
  [StatusGeralDenteTipo.EXTRAIDO]: 'bg-gray-700 hover:bg-gray-800 text-white',
  [StatusGeralDenteTipo.AUSENTE_AGENESIA]: 'bg-gray-400 hover:bg-gray-500',
  [StatusGeralDenteTipo.NAO_ERUPCIONADO_INCLUSO]: 'bg-yellow-400 hover:bg-yellow-500',
  [StatusGeralDenteTipo.RAIZ_RESIDUAL]: 'bg-orange-400 hover:bg-orange-500',
  [StatusGeralDenteTipo.DECIDUO]: 'bg-sky-400 hover:bg-sky-500',
  // Adicionar mais conforme necessário
};

// Mapeamento de labels para o novo StatusGeralDenteTipo
export const STATUS_GERAL_DENTE_LABELS: Record<StatusGeralDenteTipo, string> = {
  [StatusGeralDenteTipo.PRESENTE]: 'Presente',
  [StatusGeralDenteTipo.EXTRAIDO]: 'Extraído (X)',
  [StatusGeralDenteTipo.AUSENTE_AGENESIA]: 'Ausente - Agenesia (AG)',
  [StatusGeralDenteTipo.NAO_ERUPCIONADO_INCLUSO]: 'Não Erupcionado/Incluso (NE)', // Corrigido
  [StatusGeralDenteTipo.RAIZ_RESIDUAL]: 'Raiz Residual (RR)',
  [StatusGeralDenteTipo.DECIDUO]: 'Decíduo (D)',
};

// Helper para criar um objeto Tooth com a nova estrutura
const createTooth = (number: number, quadrant: Quadrant): Tooth => ({
  id: `T${number}`,
  number,
  quadrant,
  statusGeral: { tipo: StatusGeralDenteTipo.PRESENTE }, // Padrão como Presente
  condicoesPatologicas: [],
  restauracoesProtesesExistentes: [],
  anomalias: [],
  tratamentos: [],
  notes: '',
});

// Este INITIAL_TEETH_DATA agora serve como um template mestre.
// Cada paciente terá sua própria cópia (deep copy) deste template.
export const INITIAL_TEETH_DATA: Tooth[] = [
  // Quadrant 1 (Patient's Upper Right)
  ...[18, 17, 16, 15, 14, 13, 12, 11].map(num => createTooth(num, Quadrant.SUPERIOR_DIREITO)),
  // Quadrant 2 (Patient's Upper Left)
  ...[21, 22, 23, 24, 25, 26, 27, 28].map(num => createTooth(num, Quadrant.SUPERIOR_ESQUERDO)),
  // Quadrant 3 (Patient's Lower Left)
  ...[31, 32, 33, 34, 35, 36, 37, 38].map(num => createTooth(num, Quadrant.INFERIOR_ESQUERDO)),
  // Quadrant 4 (Patient's Lower Right)
  ...[41, 42, 43, 44, 45, 46, 47, 48].map(num => createTooth(num, Quadrant.INFERIOR_DIREITO)),
].sort((a,b) => { 
    const quadrantOrder = [Quadrant.SUPERIOR_DIREITO, Quadrant.SUPERIOR_ESQUERDO, Quadrant.INFERIOR_ESQUERDO, Quadrant.INFERIOR_DIREITO];
    if (quadrantOrder.indexOf(a.quadrant) < quadrantOrder.indexOf(b.quadrant)) return -1;
    if (quadrantOrder.indexOf(a.quadrant) > quadrantOrder.indexOf(b.quadrant)) return 1;
    if (a.number < b.number) return -1;
    if (a.number > b.number) return 1;
    return 0;
});

export const QUADRANT_DISPLAY_ORDER = {
    UPPER_ROW_LEFT: Quadrant.SUPERIOR_ESQUERDO, // Q2
    UPPER_ROW_RIGHT: Quadrant.SUPERIOR_DIREITO, // Q1
    LOWER_ROW_LEFT: Quadrant.INFERIOR_ESQUERDO, // Q3
    LOWER_ROW_RIGHT: Quadrant.INFERIOR_DIREITO, // Q4
};

export const TEETH_DISPLAY_ORDER_MAP: Record<Quadrant, number[]> = {
    [Quadrant.SUPERIOR_ESQUERDO]: [28, 27, 26, 25, 24, 23, 22, 21], // Da distal para mesial
    [Quadrant.SUPERIOR_DIREITO]: [11, 12, 13, 14, 15, 16, 17, 18], // Da mesial para distal
    [Quadrant.INFERIOR_ESQUERDO]: [38, 37, 36, 35, 34, 33, 32, 31], // Da distal para mesial
    [Quadrant.INFERIOR_DIREITO]: [41, 42, 43, 44, 45, 46, 47, 48], // Da mesial para distal
};

export const FACES_DENTARIAS_OPTIONS = Object.values(FaceDentaria).map(face => ({
  id: face,
  label: face,
}));


export const PROCEDIMENTOS_DENTARIOS: ProcedimentoDentario[] = [
  // 1. Prevenção e Profilaxia
  { id: 'prof_01', nome: 'Profilaxia Dental (Limpeza)' },
  { id: 'prof_02', nome: 'Aplicação Tópica de Flúor' },
  { id: 'prof_03', nome: 'Aplicação de Selantes' },
  { id: 'prof_04', nome: 'Orientação de Higiene Oral' },
  // 2. Dentística Restauradora
  { id: 'dent_01', nome: 'Restauração Resina Composta (1 face)' },
  { id: 'dent_02', nome: 'Restauração Resina Composta (2 faces)' },
  { id: 'dent_03', nome: 'Restauração Resina Composta (3 faces)' },
  { id: 'dent_04', nome: 'Restauração Resina Composta (4+ faces/Indireta)' },
  { id: 'dent_05', nome: 'Restauração Ionômero de Vidro' },
  { id: 'dent_06', nome: 'Facetas Diretas em Resina Composta' },
  { id: 'dent_07', nome: 'Inlay/Onlay/Overlay (Bloco)' },
  // 3. Endodontia
  { id: 'endo_01', nome: 'Tratamento Endodôntico (Canal) - Incisivo/Canino' },
  { id: 'endo_02', nome: 'Tratamento Endodôntico (Canal) - Pré-Molar' },
  { id: 'endo_03', nome: 'Tratamento Endodôntico (Canal) - Molar' },
  { id: 'endo_04', nome: 'Retratamento Endodôntico' },
  { id: 'endo_05', nome: 'Pulpotomia/Pulpectomia' },
  { id: 'endo_06', nome: 'Capeamento Pulpar' },
  // 4. Periodontia
  { id: 'perio_01', nome: 'Raspagem Supragengival e Subgengival (RAR)' },
  { id: 'perio_02', nome: 'Gengivectomia/Gengivoplastia (por sextante)' },
  { id: 'perio_03', nome: 'Aumento de Coroa Clínica' },
  // 5. Prótese Dentária
  { id: 'prot_01', nome: 'Coroa Unitária (Metalo-Cerâmica)' },
  { id: 'prot_02', nome: 'Coroa Unitária (Cerâmica Pura/Zircônia)' },
  { id: 'prot_03', nome: 'Prótese Fixa (Ponte) - por elemento' },
  { id: 'prot_04', nome: 'Prótese Parcial Removível (PPR) - Acrílica' },
  { id: 'prot_05', nome: 'Prótese Parcial Removível (PPR) - Metálica' },
  { id: 'prot_06', nome: 'Prótese Total (Dentadura) - Superior' },
  { id: 'prot_07', nome: 'Prótese Total (Dentadura) - Inferior' },
  { id: 'prot_08', nome: 'Prótese Sobre Implante - Coroa Unitária' },
  // 6. Estética Dental
  { id: 'est_01', nome: 'Clareamento Dental de Consultório' },
  { id: 'est_02', nome: 'Clareamento Dental Caseiro Supervisionado' },
  { id: 'est_03', nome: 'Facetas Laminadas (Lentes de Contato)' },
  // 7. Cirurgia Oral Menor
  { id: 'cir_01', nome: 'Extração Dentária Simples' },
  { id: 'cir_02', nome: 'Extração Dentária Siso Incluso/Impactado' },
  { id: 'cir_03', nome: 'Frenectomia (Labial ou Lingual)' },
  // 8. Ortodontia
  { id: 'orto_01', nome: 'Instalação Aparelho Ortodôntico Fixo' },
  { id: 'orto_02', nome: 'Manutenção Aparelho Ortodôntico' },
  { id: 'orto_03', nome: 'Alinhadores Transparentes (Setup)' },
  // 9. Outros
  { id: 'outros_01', nome: 'Consulta de Avaliação/Diagnóstico' },
  { id: 'outros_02', nome: 'Tratamento de Hipersensibilidade' },
  { id: 'outros_03', nome: 'Placa Oclusal (Bruxismo/DTM)' },
];
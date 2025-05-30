export enum AppView {
  DASHBOARD = 'DASHBOARD',
  PACIENTES = 'PACIENTES',
  AGENDA = 'AGENDA',
  FINANCEIRO = 'FINANCEIRO'
}

export enum AgendaEventType {
  CONSULTA = 'CONSULTA',
  RETORNO = 'RETORNO',
  PROCEDIMENTO = 'PROCEDIMENTO',
  OUTRO = 'OUTRO'
}

export enum AgendaEventStatus {
  AGENDADO = 'AGENDADO',
  CONFIRMADO = 'CONFIRMADO',
  CANCELADO = 'CANCELADO',
  REALIZADO = 'REALIZADO',
  FALTOU = 'FALTOU'
}

export enum TipoTransacao {
  RECEITA = 'RECEITA',
  DESPESA = 'DESPESA'
}

export interface Tooth {
  id: string;
  number: number;
  status: string;
  notes: string;
  procedures: ToothProcedure[];
}

export interface ToothProcedure {
  id: string;
  type: string;
  date: string;
  notes: string;
  status: 'PLANEJADO' | 'REALIZADO' | 'CANCELADO';
}

export interface AnamneseClinicaData {
  queixaPrincipal: string;
  historiaDoencaAtual: string;
  antecedentesPatologicos: string;
  antecedentesFamiliares: string;
  habitos: {
    alimentares: string;
    higiene: string;
    outros: string;
  };
  medicamentosEmUso: string[];
  alergias: string[];
  observacoes: string;
}

export interface ExameExtraoralData {
  face: string;
  perfil: string;
  labios: string;
  atm: string;
  ganglios: string;
  observacoes: string;
}

export interface ExameIntraoralData {
  mucosa: string;
  lingua: string;
  soalho: string;
  palato: string;
  orofaringe: string;
  gengiva: string;
  observacoes: string;
}

export interface Paciente {
  id: string;
  nome: string;
  email: string | null;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  endereco: string;
  odontograma: Tooth[];
  anamnese: AnamneseClinicaData | null;
  exameExtraoral: ExameExtraoralData | null;
  exameIntraoral: ExameIntraoralData | null;
}

export interface AgendaEvent {
  id: string;
  patientId: string;
  title: string;
  start: string;
  end: string;
  type: AgendaEventType;
  status: AgendaEventStatus;
  notes?: string;
}

export interface TransacaoFinanceira {
  id: string;
  patientId: string;
  valor: number;
  tipo: TipoTransacao;
  metodoPagamento: string;
  descricao: string;
  data: string;
  observacoes?: string;
} 
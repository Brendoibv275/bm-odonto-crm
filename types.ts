// import { INITIAL_TEETH_DATA } from './constants'; // REMOVED: To break circular dependency

export enum Quadrant {
  SUPERIOR_DIREITO = 'Superior Direito', // Patient's Upper Right (Quadrant 1)
  SUPERIOR_ESQUERDO = 'Superior Esquerdo', // Patient's Upper Left (Quadrant 2)
  INFERIOR_ESQUERDO = 'Inferior Esquerdo', // Patient's Lower Left (Quadrant 3)
  INFERIOR_DIREITO = 'Inferior Direito', // Patient's Lower Right (Quadrant 4)
}

export enum TratamentoStatus {
  PLANEJADO = 'Planejado',
  EXECUTADO = 'Executado',
  CONCLUIDO = 'Concluído',
}

export interface ProcedimentoDentario {
  id: string;
  nome: string;
}

export interface TratamentoDente {
  id: string; // UUID para o tratamento específico
  procedimentoId: string;
  procedimentoNome: string;
  status: TratamentoStatus;
  valor?: number;
  isAcaoSocial?: boolean;
  dataPlanejamento?: string; // YYYY-MM-DD
  dataExecucao?: string; // YYYY-MM-DD
  dataConclusao?: string; // YYYY-MM-DD
  observacoes?: string;
}

// Nova interface para exibir tratamentos na página do paciente
export interface TratamentoPacienteDisplay extends TratamentoDente {
  toothId: string;
  toothNumber: number;
}


export enum FaceDentaria {
  OCLUSAL = 'O',
  MESIAL = 'M',
  DISTAL = 'D',
  VESTIBULAR = 'V', // ou BUCAL (B)
  LINGUAL = 'L',   // ou PALATINA (P)
  CERVICAL = 'C',
}

export enum StatusGeralDenteTipo {
  PRESENTE = 'Presente',
  EXTRAIDO = 'Extraído',
  AUSENTE_AGENESIA = 'Ausente (Agenesia)',
  NAO_ERUPCIONADO_INCLUSO = 'Não Erupcionado/Incluso',
  RAIZ_RESIDUAL = 'Raiz Residual',
  DECIDUO = 'Decíduo',
}

export interface StatusGeralDente {
  tipo: StatusGeralDenteTipo;
  substituidoPorProtese?: boolean; // Para Extraído
  posicaoNaoErupcionado?: string; // Para Não Erupcionado/Incluso
}

export interface DetalheCarie {
  id: string; 
  faces?: FaceDentaria[];
  extensaoProfundidade?: string;
  atividade?: 'Ativa' | 'Inativa' | 'NaoEspecificado';
  recorrenteSecundaria?: boolean;
}

export interface DetalheLesaoPeriapical {
  id: string;
  tipoLesao?: 'Abscesso' | 'Granuloma' | 'Cisto' | 'Outro' | 'NaoEspecificado';
  aspectoRadiografico?: string;
  sintomas?: string;
}

export interface ProblemaPeriodontalDetalhe {
  id: string;
  mobilidade?: 'Grau I' | 'Grau II' | 'Grau III' | 'Nenhum';
  recessaoGengivalMm?: string; // Ex: "3mm na V"
  sangramentoSondagem?: boolean;
  supuracao?: boolean;
  envolvimentoFurca?: 'Grau I' | 'Grau II' | 'Grau III' | 'Nenhum';
  observacoes?: string;
}

export interface FraturaDentariaDetalhe {
  id: string;
  tipoFratura?: 'Coronária' | 'Radicular' | 'Corono-radicular';
  facesEnvolvidas?: FaceDentaria[];
  extensao?: string; // Ex: Esmalte, Dentina, Com envolvimento pulpar
}

export interface DesgasteDentarioDetalhe {
  id: string;
  tipoDesgaste?: 'Atrição' | 'Abrasão' | 'Erosão' | 'Abfração';
  facesEnvolvidas?: FaceDentaria[];
  severidade?: 'Leve' | 'Moderada' | 'Severa';
}

export enum TipoCondicaoPatologica {
  CARIE = 'Cárie',
  LESAO_PERIAPICAL = 'Lesão Periapical',
  PROBLEMA_PERIODONTAL = 'Problema Periodontal',
  FRATURA_DENTARIA = 'Fratura Dentária',
  DESGASTE_DENTARIO = 'Desgaste Dentário',
  MANCHA_DENTARIA = 'Mancha Dentária',
  HIPERPLASIA_GENGIVAL = 'Hiperplasia Gengival',
  RECESSAO_GENGIVAL = 'Recessão Gengival',
  MOBILIDADE_DENTARIA = 'Mobilidade Dentária',
  ANQUILOSE = 'Anquilose',
  ERUPCAO_ECTOPICA = 'Erupção Ectópica',
  IMPACTACAO = 'Impactação',
  RETENCAO_RAIZ = 'Retenção de Raiz',
  FISTULA = 'Fístula',
  ABSCESSO = 'Abscesso',
  GRANULOMA = 'Granuloma',
  CISTO = 'Cisto',
  HIPERMOBILIDADE_ATM = 'Hipermobilidade ATM',
  DISFUNCAO_ATM = 'Disfunção ATM',
  OUTRA_CONDICAO = 'Outra Condição'
}

export interface CondicaoPatologicaDente {
  id: string; 
  tipo: TipoCondicaoPatologica;
  detalheCarie?: DetalheCarie;
  detalheLesaoPeriapical?: DetalheLesaoPeriapical;
  problemaPeriodontalDetalhe?: ProblemaPeriodontalDetalhe;
  fraturaDentariaDetalhe?: FraturaDentariaDetalhe;
  desgasteDentarioDetalhe?: DesgasteDentarioDetalhe;
  detalheManchaDentaria?: DetalheManchaDentaria;
  detalheHiperplasiaGengival?: DetalheHiperplasiaGengival;
  detalheRecessaoGengival?: DetalheRecessaoGengival;
  detalheMobilidadeDentaria?: DetalheMobilidadeDentaria;
  detalheAnquilose?: DetalheAnquilose;
  detalheErupcaoEctopica?: DetalheErupcaoEctopica;
  detalheImpactacao?: DetalheImpactacao;
  detalheRetencaoRaiz?: DetalheRetencaoRaiz;
  detalheFistula?: DetalheFistula;
  detalheAbscesso?: DetalheAbscesso;
  detalheGranuloma?: DetalheGranuloma;
  detalheCisto?: DetalheCisto;
  detalheHipermobilidadeATM?: DetalheHipermobilidadeATM;
  detalheDisfuncaoATM?: DetalheDisfuncaoATM;
  detalheOutraCondicao?: DetalheOutraCondicao;
  observacoesGerais?: string; 
}

export interface DetalheRestauracaoExistente {
  id: string;
  material?: string; 
  faces?: FaceDentaria[];
  condicao?: string; 
}

export interface DetalheCoroaExistente {
  id: string;
  material?: 'Metalo-cerâmica' | 'Cerâmica Pura' | 'Zircônia' | 'Total Metálica' | 'Outro' | 'NaoEspecificado';
  condicao?: string; 
}

export interface DetalheTratamentoEndodonticoExistente {
  id: string;
  statusEndo?: 'Concluído' | 'Incompleto' | 'Necessita Retratamento';
  dataRealizacao?: string; // YYYY-MM-DD
}

export interface DetalheImplanteExistente {
  id: string;
  tipoProteseSobreImplante?: 'Coroa Unitária' | 'Ponte' | 'Prótese Total (Protocolo)';
  dataInstalacaoImplante?: string; // YYYY-MM-DD
  observacoesImplante?: string;
}

export interface DetalheSelanteExistente {
    id: string;
    faceOclusal?: boolean; // Geralmente oclusal
    condicaoSelante?: 'Íntegro' | 'Parcialmente Perdido' | 'Totalmente Perdido';
}

export enum TipoTratamentoExistente {
  RESTAURACAO = 'Restauração',
  COROA = 'Coroa Protética',
  TRATAMENTO_ENDODONTICO = 'Tratamento Endodôntico Existente',
  IMPLANTE = 'Implante Dentário com Prótese',
  SELANTE = 'Selante Oclusal',
  FACETA = 'Faceta Laminada',
  ONLAY_INLAY = 'Onlay/Inlay',
  PIVO = 'Pino/Pilar Intrarradicular',
  PROTESE_PARCIAL_REMOVIVEL = 'Prótese Parcial Removível',
  PROTESE_TOTAL = 'Prótese Total',
  PROTESE_FIXA = 'Prótese Fixa',
  APARELHO_ORTODONTICO = 'Aparelho Ortodôntico',
  MANTENEDOR_ESPACO = 'Mantenedor de Espaço',
  CONTENCAO_ORTODONTICA = 'Contenção Ortodôntica',
  OUTRO_TRATAMENTO = 'Outro Tratamento'
}

export interface DetalheManchaDentaria {
  id: string;
  tipoMancha?: 'Extrínseca' | 'Intrínseca' | 'Mista';
  cor?: string;
  faces?: FaceDentaria[];
  causa?: string;
}

export interface DetalheHiperplasiaGengival {
  id: string;
  faces?: FaceDentaria[];
  causa?: 'Medicamentosa' | 'Inflamatória' | 'Idiopática' | 'Outra';
  severidade?: 'Leve' | 'Moderada' | 'Severa';
}

export interface DetalheRecessaoGengival {
  id: string;
  faces?: FaceDentaria[];
  profundidadeMm?: string;
  causa?: 'Traumática' | 'Inflamatória' | 'Idiopática' | 'Outra';
}

export interface DetalheMobilidadeDentaria {
  id: string;
  grau?: 'Grau I' | 'Grau II' | 'Grau III';
  causa?: string;
}

export interface DetalheAnquilose {
  id: string;
  grau?: 'Parcial' | 'Total';
  observacoes?: string;
}

export interface DetalheErupcaoEctopica {
  id: string;
  posicao?: string;
  interferencia?: string;
}

export interface DetalheImpactacao {
  id: string;
  posicao?: string;
  profundidade?: string;
}

export interface DetalheRetencaoRaiz {
  id: string;
  tamanho?: string;
  posicao?: string;
}

export interface DetalheFistula {
  id: string;
  localizacao?: string;
  drenagem?: 'Ativa' | 'Inativa';
}

export interface DetalheAbscesso {
  id: string;
  localizacao?: string;
  tamanho?: string;
  drenagem?: 'Espontânea' | 'Induzida' | 'Não Drenado';
}

export interface DetalheGranuloma {
  id: string;
  tamanho?: string;
  aspectoRadiografico?: string;
}

export interface DetalheCisto {
  id: string;
  tipo?: 'Radicular' | 'Dentígero' | 'Primordial' | 'Outro';
  tamanho?: string;
  aspectoRadiografico?: string;
}

export interface DetalheHipermobilidadeATM {
  id: string;
  lado?: 'Direito' | 'Esquerdo' | 'Bilateral';
  sintomas?: string;
}

export interface DetalheDisfuncaoATM {
  id: string;
  tipo?: 'Dor' | 'Estalido' | 'Crepitação' | 'Limitação' | 'Misto';
  lado?: 'Direito' | 'Esquerdo' | 'Bilateral';
  sintomas?: string;
}

export interface DetalheOutraCondicao {
  id: string;
  descricao?: string;
  classificacao?: string;
  observacoes?: string;
}

export interface DetalheFaceta {
  id: string;
  material?: 'Cerâmica' | 'Resina' | 'Híbrido';
  faces?: FaceDentaria[];
  condicao?: string;
}

export interface DetalheOnlayInlay {
  id: string;
  tipo?: 'Onlay' | 'Inlay' | 'Overlay';
  material?: 'Cerâmica' | 'Resina' | 'Ouro' | 'Outro';
  faces?: FaceDentaria[];
  condicao?: string;
}

export interface DetalhePivo {
  id: string;
  material?: 'Fibra de Vidro' | 'Metal' | 'Zircônia' | 'Outro';
  tipo?: 'Pino' | 'Pilar' | 'Núcleo';
  condicao?: string;
}

export interface DetalheProteseParcialRemovivel {
  id: string;
  tipo?: 'Esquelética' | 'Flexível' | 'Acrílica';
  elementos?: string;
  condicao?: string;
}

export interface DetalheProteseTotal {
  id: string;
  material?: 'Acrílica' | 'Flexível' | 'Híbrida';
  condicao?: string;
}

export interface DetalheProteseFixa {
  id: string;
  tipo?: 'Ponte' | 'Unitária' | 'Maryland';
  elementos?: string;
  material?: string;
  condicao?: string;
}

export interface DetalheAparelhoOrtodontico {
  id: string;
  tipo?: 'Fixo' | 'Removível' | 'Alinhador';
  elementos?: string;
  fase?: string;
}

export interface DetalheMantenedorEspaco {
  id: string;
  tipo?: 'Fixo' | 'Removível';
  elementos?: string;
  condicao?: string;
}

export interface DetalheContencaoOrtodontica {
  id: string;
  tipo?: 'Fixa' | 'Removível';
  elementos?: string;
  condicao?: string;
}

export interface DetalheOutroTratamento {
  id: string;
  descricao?: string;
  tipo?: string;
  observacoes?: string;
}

export interface RestauracaoProteseExistente {
  id: string; 
  tipo: TipoTratamentoExistente;
  detalheRestauracao?: DetalheRestauracaoExistente;
  detalheCoroa?: DetalheCoroaExistente;
  detalheTratamentoEndodontico?: DetalheTratamentoEndodonticoExistente;
  detalheImplante?: DetalheImplanteExistente;
  detalheSelante?: DetalheSelanteExistente;
  detalheFaceta?: DetalheFaceta;
  detalheOnlayInlay?: DetalheOnlayInlay;
  detalhePivo?: DetalhePivo;
  detalheProteseParcialRemovivel?: DetalheProteseParcialRemovivel;
  detalheProteseTotal?: DetalheProteseTotal;
  detalheProteseFixa?: DetalheProteseFixa;
  detalheAparelhoOrtodontico?: DetalheAparelhoOrtodontico;
  detalheMantenedorEspaco?: DetalheMantenedorEspaco;
  detalheContencaoOrtodontica?: DetalheContencaoOrtodontica;
  detalheOutroTratamento?: DetalheOutroTratamento;
  observacoesGerais?: string;
}

export interface AnomaliaDenteDetalhe {
  id: string; 
  tipoAnomalia: 'Posição' | 'Forma' | 'Número' | 'Cor' | 'Diastema' | 'Outra';
  descricao: string;
}

export interface Tooth {
  id: string; 
  number: number; 
  quadrant: Quadrant;
  notes?: string;
  tratamentos?: TratamentoDente[]; 

  statusGeral: StatusGeralDente; 
  condicoesPatologicas: CondicaoPatologicaDente[]; // Alterado para não opcional
  restauracoesProtesesExistentes: RestauracaoProteseExistente[]; // Alterado para não opcional
  anomalias: AnomaliaDenteDetalhe[]; // Alterado para não opcional
}

export interface AnamneseClinicaData {
  queixaPrincipal: string;
  historiaDoencaAtual: string;
  dorLocalizacao?: string;
  dorTipo?: string; 
  dorIntensidade?: string; 
  dorIrradiacao?: string;
  dorAcordaNoite?: 'sim' | 'nao' | 'as_vezes';
  dorMediacao?: string;
  doencasPreexistentes?: string;
  tratamentoMedicoAtual?: string;
  medicacoesUsoContinuo?: string;
  alergias?: string;
  cirurgiasAnteriores?: string;
  internacoes?: string;
  febreReumaticaSoproCardiaco?: 'sim' | 'nao' | 'nao_sabe';
  problemasSangramentoCicatrizacao?: 'sim' | 'nao' | 'nao_sabe';
  profilaxiaAntibiotica?: 'sim' | 'nao' | 'nao_sabe';
  estaGravidaOuSuspeita?: 'sim' | 'nao' | 'nao_aplica';
  estaAmamentando?: 'sim' | 'nao' | 'nao_aplica';
  usaContraceptivoHormonal?: 'sim' | 'nao' | 'nao_aplica';
  ultimaVisitaDentista?: string;
  acompanhamentoRegular?: 'sim' | 'nao';
  experienciaNegativaDentista?: string;
  tratamentoCanal?: string;
  extracaoDente?: string;
  usaAparelho?: 'sim_atualmente' | 'nao_usou' | 'usou_antes';
  doencaGengiva?: 'sim' | 'nao' | 'talvez';
  sangramentoGengival?: 'sim_ao_escovar' | 'sim_espontaneo' | 'nao';
  sensibilidadeDentes?: string; 
  problemasATM?: string; 
  rangeDentes?: 'sim_dia' | 'sim_noite' | 'sim_ambos' | 'nao_sabe' | 'nao';
  fezClareamentoDental?: 'sim' | 'nao';
  higieneOralFrequenciaEscovacao?: string;
  usaFioDental?: 'sim_diario' | 'sim_as_vezes' | 'nao';
  tipoEscovaCremeDental?: string;
  usaEnxaguanteBucal?: string;
  fuma?: 'sim' | 'nao' | 'ex_fumante';
  fumaDetalhes?: string;
  consomeAlcool?: 'sim_frequente' | 'sim_moderado' | 'sim_raro' | 'nao';
  usaOutrasDrogas?: string;
  alimentacaoGeral?: string;
  esportesContatoProtetorBucal?: 'sim_usa_protetor' | 'sim_nao_usa_protetor' | 'nao_pratica';
  avaliacaoSaudeBucalPropria?: string;
  preocupacaoPrincipal?: string;
  expectativaTratamento?: string;
  ansiedadeTratamento?: 'nenhuma' | 'pouca' | 'moderada' | 'muita';
  restricoesTratamento?: string; 
  dataPreenchimento?: string; 
  ultimaAtualizacao?: string; 
}

export interface ExameExtraoralData {
  simetriaFacialObs?: string;
  peleObs?: string;
  perfilFacial?: 'reto' | 'concavo' | 'convexo' | 'nao_avaliado';
  perfilFacialObs?: string;
  proporcoesFaciaisObs?: string;
  atmPalpacaoObs?: string;
  atmAutscultaObs?: string; 
  atmDorObs?: string;
  atmAmplitudeAberturaMm?: string;
  atmDesviosDeflexoesObs?: string;
  atmLimitacoesMovimentoObs?: string;
  musculosPalpacaoObs?: string; 
  musculosDorObs?: string; 
  musculosHipertrofiaObs?: string;
  linfonodosPalpacaoObs?: string; 
  linfonodosCaracteristicasObs?: string; 
  glandulasSalivaresPalpacaoObs?: string; 
  glandulasSalivaresCaracteristicasObs?: string; 
  labiosExternoInspecaoObs?: string; 
  comissurasLabiaisObs?: string; 
  pescocoInspecaoPalpacaoObs?: string; 
  observacoesGeraisExtraoral?: string;
  dataPreenchimento?: string;
  ultimaAtualizacao?: string;
}

export interface ExameIntraoralData {
  labiosMucosaInternaFornixObs?: string;
  mucosaJugalFundoSacoObs?: string;
  gengivaMucosaAlveolarObs?: string;
  sondagemPeriodontalObsGeral?: string; 
  palatoDuroMoleObs?: string;
  assoalhoBucalObs?: string;
  linguaObs?: string;
  orofaringeTonsilasObs?: string;
  dentesContagemObs?: string;
  dentesCarieObsGeral?: string;
  dentesRestauracoesObsGeral?: string;
  dentesProtesesObsGeral?: string;
  dentesDesgastesObsGeral?: string;
  dentesFraturasObsGeral?: string;
  dentesAnomaliasObsGeral?: string; 
  dentesMobilidadeObsGeral?: string;
  dentesSensibilidadePercussaoObsGeral?: string;
  oclusaoRelacaoMolarCanina?: string; 
  oclusaoMordidaObs?: string; 
  oclusaoTrespasseHorizontalMm?: string; 
  oclusaoContatosPrematurosInterferenciasObs?: string;
  oclusaoLinhaMediaObs?: string;
  observacoesGeraisIntraoral?: string;
  dataPreenchimento?: string;
  ultimaAtualizacao?: string;
}

export interface Paciente {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email?: string;
  cpf: string;
  dataNascimento: string; 
  anamnese?: AnamneseClinicaData;
  exameExtraoral?: ExameExtraoralData;
  exameIntraoral?: ExameIntraoralData;
  odontograma: Tooth[]; 
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  PACIENTES = 'PACIENTES',
  AGENDA = 'AGENDA',
  FINANCEIRO = 'FINANCEIRO',
}

export enum PatientDetailView {
  INFO = 'INFO',
  ANAMNESE = 'ANAMNESE',
  EXAME_EXTRAORAL = 'EXAME_EXTRAORAL',
  EXAME_INTRAORAL = 'EXAME_INTRAORAL',
  ODONTOGRAMA = 'ODONTOGRAMA',
}

// Tipos para a Agenda
export enum AgendaEventType {
  AGENDAMENTO_TRATAMENTO = 'Agendamento de Tratamento',
  AVALIACAO = 'Avaliação',
  CONSULTA_INICIAL = 'Consulta Inicial',
  REUNIAO = 'Reunião',
  EVENTO_GERAL = 'Evento Geral',
  BLOQUEIO = 'Horário Bloqueado', // Para folgas, feriados, etc.
}

export enum AgendaEventStatus {
  AGENDADO = 'Agendado',
  EM_ATENDIMENTO = 'Em Atendimento',
  CONCLUIDO = 'Concluído',
  CANCELADO = 'Cancelado',
  NAO_COMPARECEU = 'Não Compareceu',
}

export interface AgendaEvent {
  id: string;
  tipo: AgendaEventType;
  titulo: string; // Ex: "Avaliação - João Silva", "Bloqueio - Almoço"
  startDateTime: string; // ISO string (YYYY-MM-DDTHH:mm:ss)
  endDateTime: string;   // ISO string
  pacienteId?: string;
  pacienteNome?: string;
  tratamentoId?: string; // ID do TratamentoDente
  descricao?: string;
  status: AgendaEventStatus;
}

// Tipos para o Financeiro
export enum TipoTransacao {
  ENTRADA = 'Entrada',
  SAIDA = 'Saída',
}

export interface TransacaoFinanceira {
  id: string;
  tipo: TipoTransacao;
  data: string; // YYYY-MM-DD
  descricao: string;
  valor: number;
  categoria?: string; // Ex: "Material de Consumo", "Salário", "Procedimento Odontológico"
  pacienteId?: string;
  pacienteNome?: string;
  tratamentoId?: string; // ID do TratamentoDente que gerou a entrada
  metodoPagamento?: 'Dinheiro' | 'Pix' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Outro';
  tipoGasto?: 'Fixo' | 'Programado' | 'Extra' | 'N/A'; // Para Saídas
}

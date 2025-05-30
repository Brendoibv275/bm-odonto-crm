import React, { useState, useEffect, useCallback } from 'react';
import { 
  Tooth, ProcedimentoDentario, TratamentoDente, TratamentoStatus,
  StatusGeralDente, StatusGeralDenteTipo, FaceDentaria,
  CondicaoPatologicaDente, TipoCondicaoPatologica, DetalheCarie, DetalheLesaoPeriapical,
  ProblemaPeriodontalDetalhe, FraturaDentariaDetalhe, DesgasteDentarioDetalhe, 
  RestauracaoProteseExistente, TipoTratamentoExistente, DetalheRestauracaoExistente,
  DetalheCoroaExistente, DetalheTratamentoEndodonticoExistente, 
  DetalheImplanteExistente, DetalheSelanteExistente,
  TransacaoFinanceira, TipoTransacao
} from '../../types';
import { FACES_DENTARIAS_OPTIONS, STATUS_GERAL_DENTE_LABELS } from '../../constants';
import TratamentoDenteForm from './TratamentoDenteForm';
import ConfirmacaoPagamentoModal from '../pacientes/ConfirmacaoPagamentoModal';
import { SelectField, TextAreaField, InputField } from '../common/FormFields';
import { v4 as uuidv4 } from 'uuid';

interface ToothInfoPanelProps {
  selectedTooth: Tooth | null;
  onUpdateTooth: (updatedTooth: Tooth) => void;
  onClosePanel: () => void;
  procedimentos: ProcedimentoDentario[];
  onAddTransacaoFinanceira: (transacaoData: Omit<TransacaoFinanceira, 'id'>) => void;
  pacienteId: string;
  pacienteNome: string;
}

const generateUniqueId = () => Math.random().toString(36).substr(2, 9);

const AccordionSection: React.FC<{ title: string; children: React.ReactNode; isOpenDefault?: boolean }> = 
({ title, children, isOpenDefault = false }) => {
    const [isOpen, setIsOpen] = useState(isOpenDefault);
    return (
        <div className="border border-slate-300 rounded-lg overflow-hidden">
            <div className="accordion-header">
              <button onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
                {title}
                <span className="icon transform transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-500 ${isOpen ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>
            </div>
            <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
              <div className="p-3 sm:p-4 space-y-3">
                {children}
              </div>
            </div>
        </div>
    );
};


const FacesSelector: React.FC<{
  selectedFaces: FaceDentaria[];
  onChange: (face: FaceDentaria) => void;
  disabled?: boolean;
}> = ({ selectedFaces, onChange, disabled = false }) => (
  <div className="flex flex-wrap gap-2 mt-1.5">
    {FACES_DENTARIAS_OPTIONS.map(opt => (
      <label key={opt.id} className={`flex items-center space-x-1.5 text-xs px-2 py-1.5 border rounded-md ${disabled ? 'cursor-not-allowed opacity-60 bg-slate-50' : 'cursor-pointer hover:bg-sky-50'}`}>
        <input
          type="checkbox"
          checked={selectedFaces.includes(opt.id as FaceDentaria)}
          onChange={() => onChange(opt.id as FaceDentaria)}
          className="form-checkbox h-3.5 w-3.5 text-sky-600 border-slate-400 rounded focus:ring-sky-500"
          disabled={disabled}
        />
        <span className="text-slate-700">{opt.label}</span>
      </label>
    ))}
  </div>
);


const ToothInfoPanel: React.FC<ToothInfoPanelProps> = ({ 
    selectedTooth, onUpdateTooth, onClosePanel, procedimentos,
    onAddTransacaoFinanceira, pacienteId, pacienteNome
}) => {
  const [currentNotes, setCurrentNotes] = useState<string>('');
  const [currentStatusGeral, setCurrentStatusGeral] = useState<StatusGeralDente>({ tipo: StatusGeralDenteTipo.PRESENTE });
  
  const [localTratamentos, setLocalTratamentos] = useState<TratamentoDente[]>([]);
  const [showTratamentoForm, setShowTratamentoForm] = useState(false);
  const [editingTratamento, setEditingTratamento] = useState<TratamentoDente | null>(null);

  const [localCondicoesPatologicas, setLocalCondicoesPatologicas] = useState<CondicaoPatologicaDente[]>([]);
  const [localRestauracoesExistentes, setLocalRestauracoesExistentes] = useState<RestauracaoProteseExistente[]>([]);

  const [selectedCondicaoTipoToAdd, setSelectedCondicaoTipoToAdd] = useState<TipoCondicaoPatologica | ''>('');
  const [editingCondicao, setEditingCondicao] = useState<CondicaoPatologicaDente | null>(null);
  
  const [selectedRestauracaoTipoToAdd, setSelectedRestauracaoTipoToAdd] = useState<TipoTratamentoExistente | ''>('');
  const [editingRestauracao, setEditingRestauracao] = useState<RestauracaoProteseExistente | null>(null);

  const [isConfirmModalOpenOdontograma, setIsConfirmModalOpenOdontograma] = useState(false);
  const [tratamentoParaConfirmarOdontograma, setTratamentoParaConfirmarOdontograma] = useState<TratamentoDente | null>(null);

  // Estados para condições patológicas
  const [tipoMancha, setTipoMancha] = useState<string>('');
  const [corMancha, setCorMancha] = useState('');
  const [causaMancha, setCausaMancha] = useState('');
  const [causaHiperplasia, setCausaHiperplasia] = useState<string>('');
  const [severidadeHiperplasia, setSeveridadeHiperplasia] = useState<string>('');
  const [profundidadeRecessao, setProfundidadeRecessao] = useState('');
  const [causaRecessao, setCausaRecessao] = useState<string>('');
  const [grauMobilidade, setGrauMobilidade] = useState<string>('');
  const [causaMobilidade, setCausaMobilidade] = useState('');
  const [grauAnquilose, setGrauAnquilose] = useState<string>('');
  const [observacoesAnquilose, setObservacoesAnquilose] = useState('');
  const [posicaoErupcao, setPosicaoErupcao] = useState('');
  const [interferenciaErupcao, setInterferenciaErupcao] = useState('');
  const [posicaoImpactacao, setPosicaoImpactacao] = useState('');
  const [profundidadeImpactacao, setProfundidadeImpactacao] = useState('');
  const [tamanhoRetencao, setTamanhoRetencao] = useState('');
  const [posicaoRetencao, setPosicaoRetencao] = useState('');
  const [localizacaoFistula, setLocalizacaoFistula] = useState('');
  const [drenagemFistula, setDrenagemFistula] = useState<"Ativa" | "Inativa">("Ativa");
  const [localizacaoAbscesso, setLocalizacaoAbscesso] = useState('');
  const [tamanhoAbscesso, setTamanhoAbscesso] = useState('');
  const [drenagemAbscesso, setDrenagemAbscesso] = useState<"Espontânea" | "Induzida" | "Não Drenado">("Espontânea");
  const [tamanhoGranuloma, setTamanhoGranuloma] = useState('');
  const [aspectoGranuloma, setAspectoGranuloma] = useState('');
  const [tipoCisto, setTipoCisto] = useState<string>('');
  const [tamanhoCisto, setTamanhoCisto] = useState('');
  const [aspectoCisto, setAspectoCisto] = useState('');
  const [ladoHipermobilidade, setLadoHipermobilidade] = useState<string>('');
  const [sintomasHipermobilidade, setSintomasHipermobilidade] = useState('');
  const [tipoDisfuncao, setTipoDisfuncao] = useState<string>('');
  const [ladoDisfuncao, setLadoDisfuncao] = useState<"Direito" | "Esquerdo" | "Bilateral">("Direito");
  const [sintomasDisfuncao, setSintomasDisfuncao] = useState<Array<"Dor" | "Estalido" | "Crepitação" | "Limitação" | "Misto">>([]);
  const [descricaoOutraCondicao, setDescricaoOutraCondicao] = useState('');
  const [classificacaoOutraCondicao, setClassificacaoOutraCondicao] = useState('');
  const [observacoesOutraCondicao, setObservacoesOutraCondicao] = useState('');

  // Estados para tratamentos existentes
  const [materialFaceta, setMaterialFaceta] = useState<string>('');
  const [condicaoFaceta, setCondicaoFaceta] = useState('');
  const [tipoOnlayInlay, setTipoOnlayInlay] = useState<string>('');
  const [materialOnlayInlay, setMaterialOnlayInlay] = useState<string>('');
  const [condicaoOnlayInlay, setCondicaoOnlayInlay] = useState('');
  const [materialPivo, setMaterialPivo] = useState<string>('');
  const [tipoPivo, setTipoPivo] = useState<string>('');
  const [condicaoPivo, setCondicaoPivo] = useState('');
  const [tipoProteseParcial, setTipoProteseParcial] = useState<string>('');
  const [elementosProteseParcial, setElementosProteseParcial] = useState<string[]>([]);
  const [condicaoProteseParcial, setCondicaoProteseParcial] = useState('');
  const [materialProteseTotal, setMaterialProteseTotal] = useState<string>('');
  const [condicaoProteseTotal, setCondicaoProteseTotal] = useState('');
  const [tipoProteseFixa, setTipoProteseFixa] = useState<string>('');
  const [elementosProteseFixa, setElementosProteseFixa] = useState<string[]>([]);
  const [materialProteseFixa, setMaterialProteseFixa] = useState('');
  const [condicaoProteseFixa, setCondicaoProteseFixa] = useState('');
  const [tipoAparelhoOrtodontico, setTipoAparelhoOrtodontico] = useState<string>('');
  const [elementosAparelhoOrtodontico, setElementosAparelhoOrtodontico] = useState<string[]>([]);
  const [faseAparelhoOrtodontico, setFaseAparelhoOrtodontico] = useState('');
  const [tipoMantenedorEspaco, setTipoMantenedorEspaco] = useState<string>('');
  const [elementosMantenedorEspaco, setElementosMantenedorEspaco] = useState<string[]>([]);
  const [condicaoMantenedorEspaco, setCondicaoMantenedorEspaco] = useState('');
  const [tipoContencaoOrtodontica, setTipoContencaoOrtodontica] = useState<string>('');
  const [elementosContencaoOrtodontica, setElementosContencaoOrtodontica] = useState<string[]>([]);
  const [condicaoContencaoOrtodontica, setCondicaoContencaoOrtodontica] = useState('');
  const [descricaoOutroTratamento, setDescricaoOutroTratamento] = useState('');
  const [tipoOutroTratamento, setTipoOutroTratamento] = useState('');
  const [observacoesOutroTratamento, setObservacoesOutroTratamento] = useState('');

  // Estados para condições patológicas existentes
  const [observacoesCondicao, setObservacoesCondicao] = useState('');
  const [observacoesRestauracao, setObservacoesRestauracao] = useState('');
  const [selectedFaces, setSelectedFaces] = useState<FaceDentaria[]>([]);
  const [extensaoProfundidadeCarie, setExtensaoProfundidadeCarie] = useState('');
  const [atividadeCarie, setAtividadeCarie] = useState<'Ativa' | 'Inativa' | 'NaoEspecificado'>('NaoEspecificado');
  const [recorrenteSecundariaCarie, setRecorrenteSecundariaCarie] = useState(false);
  const [tipoLesaoPeriapical, setTipoLesaoPeriapical] = useState<'Abscesso' | 'Granuloma' | 'Cisto' | 'Outro' | 'NaoEspecificado'>('NaoEspecificado');
  const [aspectoRadiograficoLesao, setAspectoRadiograficoLesao] = useState('');
  const [sintomasLesaoPeriapical, setSintomasLesaoPeriapical] = useState('');
  const [tipoProblemaPeriodontal, setTipoProblemaPeriodontal] = useState('');
  const [profundidadeBolsa, setProfundidadeBolsa] = useState('');
  const [recessaoGengival, setRecessaoGengival] = useState('');
  const [mobilidade, setMobilidade] = useState<'Grau I' | 'Grau II' | 'Grau III' | 'Nenhum'>('Nenhum');
  const [tipoFratura, setTipoFratura] = useState<'Coronária' | 'Radicular' | 'Corono-radicular'>('Coronária');
  const [extensaoFratura, setExtensaoFratura] = useState('');
  const [sintomasFratura, setSintomasFratura] = useState('');
  const [tipoDesgaste, setTipoDesgaste] = useState<'Atrição' | 'Abrasão' | 'Erosão' | 'Abfração'>('Atrição');
  const [severidadeDesgaste, setSeveridadeDesgaste] = useState<'Leve' | 'Moderada' | 'Severa'>('Leve');
  const [causaDesgaste, setCausaDesgaste] = useState('');

  // Adicionar estados para restauração
  const [materialRestauracao, setMaterialRestauracao] = useState<"Amálgama" | "Resina" | "Ionômero" | "Outro">("Resina");
  const [condicaoRestauracao, setCondicaoRestauracao] = useState<string>("");

  const handleCancel = useCallback(() => {
    setSelectedCondicaoTipoToAdd('');
    setEditingCondicao(null);
    setSelectedRestauracaoTipoToAdd('');
    setEditingRestauracao(null);
    setShowTratamentoForm(false);
    setEditingTratamento(null);
  }, []);

  const resetFormStates = useCallback(() => {
    setShowTratamentoForm(false); setEditingTratamento(null);
    setSelectedCondicaoTipoToAdd(''); setEditingCondicao(null);
    setSelectedRestauracaoTipoToAdd(''); setEditingRestauracao(null);
    setIsConfirmModalOpenOdontograma(false); setTratamentoParaConfirmarOdontograma(null);
  }, []);

  useEffect(() => {
    if (selectedTooth) {
      setCurrentStatusGeral(JSON.parse(JSON.stringify(selectedTooth.statusGeral || { tipo: StatusGeralDenteTipo.PRESENTE })));
      setCurrentNotes(selectedTooth.notes || '');
      setLocalTratamentos(JSON.parse(JSON.stringify(selectedTooth.tratamentos || [])));
      setLocalCondicoesPatologicas(JSON.parse(JSON.stringify(selectedTooth.condicoesPatologicas || [])));
      setLocalRestauracoesExistentes(JSON.parse(JSON.stringify(selectedTooth.restauracoesProtesesExistentes || [])));
      resetFormStates();
    } else {
      setCurrentStatusGeral({ tipo: StatusGeralDenteTipo.PRESENTE }); setCurrentNotes('');
      setLocalTratamentos([]); setLocalCondicoesPatologicas([]); setLocalRestauracoesExistentes([]);
      resetFormStates();
    }
  }, [selectedTooth, resetFormStates]);

  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentNotes(e.target.value), []);
  const handleStatusGeralChange = useCallback((e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setCurrentStatusGeral(prev => {
      const newStatus = { ...prev };
      if (name === "tipo") {
        newStatus.tipo = value as StatusGeralDenteTipo;
        if (value !== StatusGeralDenteTipo.NAO_ERUPCIONADO_INCLUSO) delete newStatus.posicaoNaoErupcionado;
        if (value !== StatusGeralDenteTipo.EXTRAIDO) delete newStatus.substituidoPorProtese;
      } else if (name === "posicaoNaoErupcionado") newStatus.posicaoNaoErupcionado = value;
      else if (name === "substituidoPorProtese" && type === "checkbox") newStatus.substituidoPorProtese = (e.target as HTMLInputElement).checked;
      return newStatus;
    });
  }, []);

  const handleSaveChanges = useCallback(() => {
    if (selectedTooth) {
      if (isConfirmModalOpenOdontograma && tratamentoParaConfirmarOdontograma) {
        alert("Confirme ou cancele o pagamento do tratamento pendente antes de salvar."); return;
      }
      onUpdateTooth({
        ...selectedTooth, statusGeral: JSON.parse(JSON.stringify(currentStatusGeral)),
        notes: currentNotes, tratamentos: JSON.parse(JSON.stringify(localTratamentos)),
        condicoesPatologicas: JSON.parse(JSON.stringify(localCondicoesPatologicas)),
        restauracoesProtesesExistentes: JSON.parse(JSON.stringify(localRestauracoesExistentes)),
        anomalias: JSON.parse(JSON.stringify(selectedTooth.anomalias || [])), 
      });
    }
  }, [selectedTooth, currentStatusGeral, currentNotes, localTratamentos, localCondicoesPatologicas, localRestauracoesExistentes, onUpdateTooth, isConfirmModalOpenOdontograma, tratamentoParaConfirmarOdontograma]);

  const handleSaveTratamentoAssociado = useCallback((tratamentoData: TratamentoDente) => {
    const isNew = !editingTratamento;
    const originalStatus = editingTratamento?.status;
    const isBecomingConcluido = tratamentoData.status === TratamentoStatus.CONCLUIDO && (isNew || originalStatus !== TratamentoStatus.CONCLUIDO);
    const requiresPayment = tratamentoData.valor && tratamentoData.valor > 0 && !tratamentoData.isAcaoSocial;

    if (isBecomingConcluido && requiresPayment) {
      setTratamentoParaConfirmarOdontograma(tratamentoData);
      setIsConfirmModalOpenOdontograma(true);
    } else {
      setLocalTratamentos(prev => prev.find(t => t.id === tratamentoData.id) ? prev.map(t => t.id === tratamentoData.id ? tratamentoData : t) : [...prev, tratamentoData]);
      setShowTratamentoForm(false); setEditingTratamento(null);
    }
  }, [editingTratamento]);

  const handleConfirmarPagamentoEConcluirTratamentoOdontograma = useCallback((metodoPagamento: string) => {
    if (!tratamentoParaConfirmarOdontograma || !selectedTooth) return;
    const dataConclusao = new Date().toISOString().split('T')[0];
    const tratamentoConcluido: TratamentoDente = { ...tratamentoParaConfirmarOdontograma, status: TratamentoStatus.CONCLUIDO, dataConclusao };
    setLocalTratamentos(prev => prev.find(t => t.id === tratamentoConcluido.id) ? prev.map(t => t.id === tratamentoConcluido.id ? tratamentoConcluido : t) : [...prev, tratamentoConcluido]);

    if (tratamentoConcluido.valor && tratamentoConcluido.valor > 0 && !tratamentoConcluido.isAcaoSocial) {
        onAddTransacaoFinanceira({
            tipo: TipoTransacao.ENTRADA, data: dataConclusao,
            descricao: `Proc: ${tratamentoConcluido.procedimentoNome} (D${selectedTooth.number}) - P: ${pacienteNome}`,
            valor: tratamentoConcluido.valor, categoria: 'Procedimento Odontológico',
            pacienteId, pacienteNome, tratamentoId: tratamentoConcluido.id,
            metodoPagamento: metodoPagamento as TransacaoFinanceira['metodoPagamento'],
        });
    }
    setIsConfirmModalOpenOdontograma(false); setTratamentoParaConfirmarOdontograma(null);
    setShowTratamentoForm(false); setEditingTratamento(null);
  }, [tratamentoParaConfirmarOdontograma, selectedTooth, pacienteId, pacienteNome, onAddTransacaoFinanceira]);

  const handleCancelConfirmacaoPagamentoModalOdontograma = useCallback(() => setIsConfirmModalOpenOdontograma(false), []);
  const handleEditTratamentoAssociado = useCallback((tratamento: TratamentoDente) => { setEditingTratamento(tratamento); setShowTratamentoForm(true); }, []);
  const handleRemoveTratamentoAssociado = useCallback((tratamentoId: string) => { if (window.confirm("Remover este tratamento?")) setLocalTratamentos(prev => prev.filter(t => t.id !== tratamentoId)); }, []);
  
  const handleSaveCondicaoPatologica = (condicao: CondicaoPatologicaDente) => {
    setLocalCondicoesPatologicas(prev => editingCondicao ? prev.map(cp => cp.id === condicao.id ? condicao : cp) : [...prev, condicao]);
    setSelectedCondicaoTipoToAdd(''); setEditingCondicao(null);
  };
  const handleEditCondicaoPatologica = (condicao: CondicaoPatologicaDente) => { setEditingCondicao(condicao); setSelectedCondicaoTipoToAdd(condicao.tipo); };
  const handleRemoveCondicaoPatologica = (condId: string) => { if (window.confirm("Remover esta condição?")) setLocalCondicoesPatologicas(prev => prev.filter(cp => cp.id !== condId)); };
  
  const handleSaveRestauracaoExistente = (restauracao: RestauracaoProteseExistente) => {
    setLocalRestauracoesExistentes(prev => editingRestauracao ? prev.map(r => r.id === restauracao.id ? restauracao : r) : [...prev, restauracao]);
    setSelectedRestauracaoTipoToAdd(''); setEditingRestauracao(null);
  };
  const handleEditRestauracaoExistente = (restauracao: RestauracaoProteseExistente) => { setEditingRestauracao(restauracao); setSelectedRestauracaoTipoToAdd(restauracao.tipo); };
  const handleRemoveRestauracaoExistente = (restId: string) => { if (window.confirm("Remover esta restauração/prótese?")) setLocalRestauracoesExistentes(prev => prev.filter(r => r.id !== restId)); };

  const formatCurrency = (value?: number) => (typeof value !== 'number') ? 'N/A' : value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const renderCondicaoPatologicaForm = (tipo: TipoCondicaoPatologica) => {
    const handleSaveCondicao = () => {
      if (!selectedTooth) return;

      const novaCondicao: CondicaoPatologicaDente = {
        id: editingCondicao?.id || uuidv4(),
        tipo,
        observacoesGerais: observacoesCondicao
      };

      // Adiciona os detalhes específicos baseado no tipo
      switch (tipo) {
        case TipoCondicaoPatologica.CARIE:
          novaCondicao.detalheCarie = {
            id: uuidv4(),
            faces: selectedFaces,
            extensaoProfundidade: extensaoProfundidadeCarie,
            atividade: atividadeCarie,
            recorrenteSecundaria: recorrenteSecundariaCarie
          };
          break;
        case TipoCondicaoPatologica.LESAO_PERIAPICAL:
          novaCondicao.detalheLesaoPeriapical = {
            id: uuidv4(),
            tipoLesao: tipoLesaoPeriapical,
            aspectoRadiografico: aspectoRadiograficoLesao,
            sintomas: sintomasLesaoPeriapical
          };
          break;
        case TipoCondicaoPatologica.PROBLEMA_PERIODONTAL:
          novaCondicao.problemaPeriodontalDetalhe = {
            id: uuidv4(),
            mobilidade: mobilidade,
            recessaoGengivalMm: recessaoGengival,
            sangramentoSondagem: false, // TODO: Adicionar campo no formulário
            supuracao: false, // TODO: Adicionar campo no formulário
            envolvimentoFurca: 'Nenhum', // TODO: Adicionar campo no formulário
            observacoes: observacoesCondicao
          };
          break;
        case TipoCondicaoPatologica.FRATURA_DENTARIA:
          novaCondicao.fraturaDentariaDetalhe = {
            id: uuidv4(),
            tipoFratura: tipoFratura,
            facesEnvolvidas: selectedFaces,
            extensao: extensaoFratura
          };
          break;
        case TipoCondicaoPatologica.DESGASTE_DENTARIO:
          novaCondicao.desgasteDentarioDetalhe = {
            id: uuidv4(),
            tipoDesgaste: tipoDesgaste,
            facesEnvolvidas: selectedFaces,
            severidade: severidadeDesgaste
          };
          break;
        case TipoCondicaoPatologica.MANCHA_DENTARIA:
          novaCondicao.detalheManchaDentaria = {
            id: uuidv4(),
            tipoMancha: tipoMancha as "Extrínseca" | "Intrínseca" | "Mista" | undefined,
            cor: corMancha,
            faces: selectedFaces,
            causa: causaMancha
          };
          break;
        case TipoCondicaoPatologica.HIPERPLASIA_GENGIVAL:
          novaCondicao.detalheHiperplasiaGengival = {
            id: uuidv4(),
            faces: selectedFaces,
            causa: causaHiperplasia as "Medicamentosa" | "Inflamatória" | "Idiopática" | "Outra" | undefined,
            severidade: severidadeHiperplasia as "Leve" | "Moderada" | "Severa" | undefined
          };
          break;
        case TipoCondicaoPatologica.RECESSAO_GENGIVAL:
          novaCondicao.detalheRecessaoGengival = {
            id: uuidv4(),
            faces: selectedFaces,
            profundidadeMm: profundidadeRecessao,
            causa: causaRecessao as "Inflamatória" | "Idiopática" | "Outra" | "Traumática" | undefined
          };
          break;
        case TipoCondicaoPatologica.MOBILIDADE_DENTARIA:
          novaCondicao.detalheMobilidadeDentaria = {
            id: uuidv4(),
            grau: grauMobilidade as "Grau I" | "Grau II" | "Grau III" | undefined,
            causa: causaMobilidade
          };
          break;
        case TipoCondicaoPatologica.ANQUILOSE:
          novaCondicao.detalheAnquilose = {
            id: uuidv4(),
            grau: grauAnquilose as "Parcial" | "Total" | undefined,
            observacoes: observacoesAnquilose
          };
          break;
        case TipoCondicaoPatologica.ERUPCAO_ECTOPICA:
          novaCondicao.detalheErupcaoEctopica = {
            id: uuidv4(),
            posicao: posicaoErupcao,
            interferencia: interferenciaErupcao
          };
          break;
        case TipoCondicaoPatologica.IMPACTACAO:
          novaCondicao.detalheImpactacao = {
            id: uuidv4(),
            posicao: posicaoImpactacao,
            profundidade: profundidadeImpactacao
          };
          break;
        case TipoCondicaoPatologica.RETENCAO_RAIZ:
          novaCondicao.detalheRetencaoRaiz = {
            id: uuidv4(),
            tamanho: tamanhoRetencao,
            posicao: posicaoRetencao
          };
          break;
        case TipoCondicaoPatologica.FISTULA:
          novaCondicao.detalheFistula = {
            id: uuidv4(),
            localizacao: localizacaoFistula,
            drenagem: drenagemFistula
          };
          break;
        case TipoCondicaoPatologica.ABSCESSO:
          novaCondicao.detalheAbscesso = {
            id: uuidv4(),
            localizacao: localizacaoAbscesso,
            tamanho: tamanhoAbscesso,
            drenagem: drenagemAbscesso
          };
          break;
        case TipoCondicaoPatologica.GRANULOMA:
          novaCondicao.detalheGranuloma = {
            id: uuidv4(),
            tamanho: tamanhoGranuloma,
            aspectoRadiografico: aspectoGranuloma
          };
          break;
        case TipoCondicaoPatologica.CISTO:
          novaCondicao.detalheCisto = {
            id: uuidv4(),
            tipo: tipoCisto as "Outro" | "Radicular" | "Dentígero" | "Primordial" | undefined,
            tamanho: tamanhoCisto,
            aspectoRadiografico: aspectoCisto
          };
          break;
        case TipoCondicaoPatologica.HIPERMOBILIDADE_ATM:
          novaCondicao.detalheHipermobilidadeATM = {
            id: uuidv4(),
            lado: ladoHipermobilidade as "Direito" | "Esquerdo" | "Bilateral" | undefined,
            sintomas: sintomasHipermobilidade
          };
          break;
        case TipoCondicaoPatologica.DISFUNCAO_ATM:
          novaCondicao.detalheDisfuncaoATM = {
            id: uuidv4(),
            tipo: tipoDisfuncao,
            lado: ladoDisfuncao,
            sintomas: sintomasDisfuncao
          };
          break;
        case TipoCondicaoPatologica.OUTRA_CONDICAO:
          novaCondicao.detalheOutraCondicao = {
            id: uuidv4(),
            descricao: descricaoOutraCondicao,
            classificacao: classificacaoOutraCondicao,
            observacoes: observacoesOutraCondicao
          };
          break;
      }

      handleSaveCondicaoPatologica(novaCondicao);
      handleCancel();
    };

    // ... existing code for form fields ...

    return (
      <div className="space-y-4">
        {/* Campos comuns */}
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Faces Afetadas"
            value={selectedFaces}
            onChange={(e) => setSelectedFaces(Array.from(e.target.selectedOptions, option => option.value as FaceDentaria))}
            multiple
          >
            {Object.values(FaceDentaria).map((face) => (
              <option key={face} value={face}>{face}</option>
            ))}
          </SelectField>
          <TextAreaField
            label="Observações Gerais"
            value={observacoesCondicao}
            onChange={(e) => setObservacoesCondicao(e.target.value)}
            rows={2}
          />
        </div>

        {/* Campos específicos por tipo */}
        {tipo === TipoCondicaoPatologica.MANCHA_DENTARIA && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Tipo de Mancha"
              value={tipoMancha}
              onChange={(e) => handleSelectChange(e.target.value, setTipoMancha)}
            >
              <option value="">Selecione...</option>
              <option value="Extrínseca">Extrínseca</option>
              <option value="Intrínseca">Intrínseca</option>
              <option value="Mista">Mista</option>
            </SelectField>
            <InputField
              label="Cor"
              value={corMancha}
              onChange={(e) => setCorMancha(e.target.value)}
            />
            <TextAreaField
              label="Causa"
              value={causaMancha}
              onChange={(e) => setCausaMancha(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoCondicaoPatologica.HIPERPLASIA_GENGIVAL && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Causa"
              value={causaHiperplasia}
              onChange={(e) => handleSelectChange(e.target.value, setCausaHiperplasia)}
            >
              <option value="">Selecione...</option>
              <option value="Medicamentosa">Medicamentosa</option>
              <option value="Inflamatória">Inflamatória</option>
              <option value="Idiopática">Idiopática</option>
              <option value="Outra">Outra</option>
            </SelectField>
            <SelectField
              label="Severidade"
              value={severidadeHiperplasia}
              onChange={(e) => setSeveridadeHiperplasia(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="Leve">Leve</option>
              <option value="Moderada">Moderada</option>
              <option value="Severa">Severa</option>
            </SelectField>
          </div>
        )}

        {tipo === TipoCondicaoPatologica.RECESSAO_GENGIVAL && (
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Profundidade (mm)"
              type="number"
              value={profundidadeRecessao}
              onChange={(e) => setProfundidadeRecessao(e.target.value)}
            />
            <SelectField
              label="Causa"
              value={causaRecessao}
              onChange={(e) => setCausaRecessao(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="Traumática">Traumática</option>
              <option value="Inflamatória">Inflamatória</option>
              <option value="Idiopática">Idiopática</option>
              <option value="Outra">Outra</option>
            </SelectField>
          </div>
        )}

        {tipo === TipoCondicaoPatologica.MOBILIDADE_DENTARIA && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Grau"
              value={grauMobilidade}
              onChange={(e) => setGrauMobilidade(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="Grau I">Grau I</option>
              <option value="Grau II">Grau II</option>
              <option value="Grau III">Grau III</option>
            </SelectField>
            <TextAreaField
              label="Causa"
              value={causaMobilidade}
              onChange={(e) => setCausaMobilidade(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoCondicaoPatologica.ANQUILOSE && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Grau"
              value={grauAnquilose}
              onChange={(e) => setGrauAnquilose(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="Parcial">Parcial</option>
              <option value="Total">Total</option>
            </SelectField>
            <TextAreaField
              label="Observações"
              value={observacoesAnquilose}
              onChange={(e) => setObservacoesAnquilose(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoCondicaoPatologica.ERUPCAO_ECTOPICA && (
          <div className="grid grid-cols-2 gap-4">
            <TextAreaField
              label="Posição"
              value={posicaoErupcao}
              onChange={(e) => setPosicaoErupcao(e.target.value)}
              rows={2}
            />
            <TextAreaField
              label="Interferência"
              value={interferenciaErupcao}
              onChange={(e) => setInterferenciaErupcao(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoCondicaoPatologica.IMPACTACAO && (
          <div className="grid grid-cols-2 gap-4">
            <TextAreaField
              label="Posição"
              value={posicaoImpactacao}
              onChange={(e) => setPosicaoImpactacao(e.target.value)}
              rows={2}
            />
            <TextAreaField
              label="Profundidade"
              value={profundidadeImpactacao}
              onChange={(e) => setProfundidadeImpactacao(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoCondicaoPatologica.RETENCAO_RAIZ && (
          <div className="grid grid-cols-2 gap-4">
            <TextAreaField
              label="Tamanho"
              value={tamanhoRetencao}
              onChange={(e) => setTamanhoRetencao(e.target.value)}
              rows={2}
            />
            <TextAreaField
              label="Posição"
              value={posicaoRetencao}
              onChange={(e) => setPosicaoRetencao(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoCondicaoPatologica.FISTULA && (
          <div className="grid grid-cols-2 gap-4">
            <TextAreaField
              label="Localização"
              value={localizacaoFistula}
              onChange={(e) => setLocalizacaoFistula(e.target.value)}
              rows={2}
            />
            <SelectField
              label="Drenagem"
              value={drenagemFistula}
              onChange={(e) => setDrenagemFistula(e.target.value as "Ativa" | "Inativa")}
            >
              <option value="Ativa">Ativa</option>
              <option value="Inativa">Inativa</option>
            </SelectField>
          </div>
        )}

        {tipo === TipoCondicaoPatologica.ABSCESSO && (
          <div className="grid grid-cols-2 gap-4">
            <TextAreaField
              label="Localização"
              value={localizacaoAbscesso}
              onChange={(e) => setLocalizacaoAbscesso(e.target.value)}
              rows={2}
            />
            <TextAreaField
              label="Tamanho"
              value={tamanhoAbscesso}
              onChange={(e) => setTamanhoAbscesso(e.target.value)}
              rows={2}
            />
            <SelectField
              label="Drenagem"
              value={drenagemAbscesso}
              onChange={(e) => setDrenagemAbscesso(e.target.value as "Espontânea" | "Induzida" | "Não Drenado")}
            >
              <option value="Espontânea">Espontânea</option>
              <option value="Induzida">Induzida</option>
              <option value="Não Drenado">Não Drenado</option>
            </SelectField>
          </div>
        )}

        {tipo === TipoCondicaoPatologica.GRANULOMA && (
          <div className="grid grid-cols-2 gap-4">
            <TextAreaField
              label="Tamanho"
              value={tamanhoGranuloma}
              onChange={(e) => setTamanhoGranuloma(e.target.value)}
              rows={2}
            />
            <TextAreaField
              label="Aspecto Radiográfico"
              value={aspectoGranuloma}
              onChange={(e) => setAspectoGranuloma(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoCondicaoPatologica.CISTO && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Tipo"
              value={tipoCisto}
              onChange={(e) => setTipoCisto(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="Radicular">Radicular</option>
              <option value="Dentígero">Dentígero</option>
              <option value="Primordial">Primordial</option>
              <option value="Outro">Outro</option>
            </SelectField>
            <TextAreaField
              label="Tamanho"
              value={tamanhoCisto}
              onChange={(e) => setTamanhoCisto(e.target.value)}
              rows={2}
            />
            <TextAreaField
              label="Aspecto Radiográfico"
              value={aspectoCisto}
              onChange={(e) => setAspectoCisto(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoCondicaoPatologica.HIPERMOBILIDADE_ATM && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Lado"
              value={ladoHipermobilidade}
              onChange={(e) => setLadoHipermobilidade(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="Direito">Direito</option>
              <option value="Esquerdo">Esquerdo</option>
              <option value="Bilateral">Bilateral</option>
            </SelectField>
            <TextAreaField
              label="Sintomas"
              value={sintomasHipermobilidade}
              onChange={(e) => setSintomasHipermobilidade(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoCondicaoPatologica.DISFUNCAO_ATM && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Lado"
              value={ladoDisfuncao}
              onChange={(e) => setLadoDisfuncao(e.target.value as "Direito" | "Esquerdo" | "Bilateral")}
            >
              <option value="Direito">Direito</option>
              <option value="Esquerdo">Esquerdo</option>
              <option value="Bilateral">Bilateral</option>
            </SelectField>
            <SelectField
              label="Sintomas"
              value={sintomasDisfuncao}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions, option => 
                  option.value as "Dor" | "Estalido" | "Crepitação" | "Limitação" | "Misto"
                );
                setSintomasDisfuncao(options);
              }}
              multiple
            >
              <option value="Dor">Dor</option>
              <option value="Estalido">Estalido</option>
              <option value="Crepitação">Crepitação</option>
              <option value="Limitação">Limitação</option>
              <option value="Misto">Misto</option>
            </SelectField>
          </div>
        )}

        {tipo === TipoCondicaoPatologica.OUTRA_CONDICAO && (
          <div className="grid grid-cols-2 gap-4">
            <TextAreaField
              label="Descrição"
              value={descricaoOutraCondicao}
              onChange={(e) => setDescricaoOutraCondicao(e.target.value)}
              rows={2}
            />
            <TextAreaField
              label="Classificação"
              value={classificacaoOutraCondicao}
              onChange={(e) => setClassificacaoOutraCondicao(e.target.value)}
              rows={2}
            />
            <TextAreaField
              label="Observações"
              value={observacoesOutraCondicao}
              onChange={(e) => setObservacoesOutraCondicao(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveCondicao}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </div>
    );
  };

  const renderRestauracaoExistenteForm = (tipo: TipoTratamentoExistente) => {
    const handleSaveRestauracao = () => {
      if (!selectedTooth) return;

      const novaRestauracao: RestauracaoProteseExistente = {
        id: editingRestauracao?.id || uuidv4(),
        tipo,
        observacoesGerais: observacoesRestauracao || ''
      };

      // Adiciona os detalhes específicos baseado no tipo
      switch (tipo) {
        case TipoTratamentoExistente.RESTAURACAO:
          novaRestauracao.detalheRestauracao = {
            id: uuidv4(),
            faces: selectedFaces,
            material: materialRestauracao,
            condicao: condicaoRestauracao
          };
          break;
        case TipoTratamentoExistente.COROA:
          novaRestauracao.detalheCoroa = {
            id: uuidv4(),
            material: materialCoroa,
            condicao: condicaoCoroa
          };
          break;
        case TipoTratamentoExistente.TRATAMENTO_ENDODONTICO:
          novaRestauracao.detalheTratamentoEndodontico = {
            id: uuidv4(),
            condicao: condicaoEndodontico,
            materialObturacao: materialObturacao,
            extensaoObturacao: extensaoObturacao
          };
          break;
        case TipoTratamentoExistente.IMPLANTE:
          novaRestauracao.detalheImplante = {
            id: uuidv4(),
            tipo: tipoImplante,
            condicao: condicaoImplante,
            dataInstalacao: dataInstalacaoImplante
          };
          break;
        case TipoTratamentoExistente.SELANTE:
          novaRestauracao.detalheSelante = {
            id: uuidv4(),
            faces: selectedFaces,
            material: materialSelante,
            condicao: condicaoSelante
          };
          break;
        case TipoTratamentoExistente.FACETA:
          novaRestauracao.detalheFaceta = {
            id: uuidv4(),
            material: materialFaceta,
            faces: selectedFaces,
            condicao: condicaoFaceta
          };
          break;
        case TipoTratamentoExistente.ONLAY_INLAY:
          novaRestauracao.detalheOnlayInlay = {
            id: uuidv4(),
            tipo: tipoOnlayInlay,
            material: materialOnlayInlay,
            faces: selectedFaces,
            condicao: condicaoOnlayInlay
          };
          break;
        case TipoTratamentoExistente.PIVO:
          novaRestauracao.detalhePivo = {
            id: uuidv4(),
            material: materialPivo,
            tipo: tipoPivo,
            condicao: condicaoPivo
          };
          break;
        case TipoTratamentoExistente.PROTESE_PARCIAL_REMOVIVEL:
          novaRestauracao.detalheProteseParcialRemovivel = {
            id: uuidv4(),
            tipo: tipoProteseParcial,
            elementos: elementosProteseParcial,
            condicao: condicaoProteseParcial
          };
          break;
        case TipoTratamentoExistente.PROTESE_TOTAL:
          novaRestauracao.detalheProteseTotal = {
            id: uuidv4(),
            material: materialProteseTotal,
            condicao: condicaoProteseTotal
          };
          break;
        case TipoTratamentoExistente.PROTESE_FIXA:
          novaRestauracao.detalheProteseFixa = {
            id: uuidv4(),
            tipo: tipoProteseFixa,
            elementos: elementosProteseFixa,
            material: materialProteseFixa,
            condicao: condicaoProteseFixa
          };
          break;
        case TipoTratamentoExistente.APARELHO_ORTODONTICO:
          novaRestauracao.detalheAparelhoOrtodontico = {
            id: uuidv4(),
            tipo: tipoAparelhoOrtodontico,
            elementos: elementosAparelhoOrtodontico,
            fase: faseAparelhoOrtodontico
          };
          break;
        case TipoTratamentoExistente.MANTENEDOR_ESPACO:
          novaRestauracao.detalheMantenedorEspaco = {
            id: uuidv4(),
            tipo: tipoMantenedorEspaco,
            elementos: elementosMantenedorEspaco,
            condicao: condicaoMantenedorEspaco
          };
          break;
        case TipoTratamentoExistente.CONTENCAO_ORTODONTICA:
          novaRestauracao.detalheContencaoOrtodontica = {
            id: uuidv4(),
            tipo: tipoContencaoOrtodontica,
            elementos: elementosContencaoOrtodontica,
            condicao: condicaoContencaoOrtodontica
          };
          break;
        case TipoTratamentoExistente.OUTRO_TRATAMENTO:
          novaRestauracao.detalheOutroTratamento = {
            id: uuidv4(),
            descricao: descricaoOutroTratamento,
            tipo: tipoOutroTratamento,
            observacoes: observacoesOutroTratamento
          };
          break;
      }

      try {
        handleSaveRestauracaoExistente(novaRestauracao);
        handleCancel();
      } catch (error) {
        console.error('Erro ao salvar restauração:', error);
        alert('Ocorreu um erro ao salvar a restauração. Por favor, tente novamente.');
      }
    };

    return (
      <div className="space-y-4 p-4 bg-white rounded-lg border border-slate-200">
        <h3 className="text-lg font-medium text-slate-900 mb-4">
          {editingRestauracao ? 'Editar' : 'Adicionar'} {tipo}
        </h3>

        {/* Campos comuns */}
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Faces Afetadas"
            value={selectedFaces}
            onChange={(e) => setSelectedFaces(Array.from(e.target.selectedOptions, option => option.value as FaceDentaria))}
            multiple
          >
            {Object.values(FaceDentaria).map((face) => (
              <option key={face} value={face}>{face}</option>
            ))}
          </SelectField>
          <TextAreaField
            label="Observações Gerais"
            value={observacoesRestauracao || ''}
            onChange={(e) => setObservacoesRestauracao(e.target.value)}
            rows={2}
          />
        </div>

        {/* Campos específicos por tipo */}
        {tipo === TipoTratamentoExistente.FACETA && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Material"
              value={materialFaceta}
              onChange={(e) => setMaterialFaceta(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="Cerâmica">Cerâmica</option>
              <option value="Resina">Resina</option>
              <option value="Híbrido">Híbrido</option>
            </SelectField>
            <TextAreaField
              label="Condição"
              value={condicaoFaceta}
              onChange={(e) => setCondicaoFaceta(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoTratamentoExistente.ONLAY_INLAY && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Tipo"
              value={tipoOnlayInlay}
              onChange={(e) => setTipoOnlayInlay(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="Onlay">Onlay</option>
              <option value="Inlay">Inlay</option>
              <option value="Overlay">Overlay</option>
            </SelectField>
            <SelectField
              label="Material"
              value={materialOnlayInlay}
              onChange={(e) => setMaterialOnlayInlay(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="Cerâmica">Cerâmica</option>
              <option value="Resina">Resina</option>
              <option value="Ouro">Ouro</option>
              <option value="Outro">Outro</option>
            </SelectField>
            <TextAreaField
              label="Condição"
              value={condicaoOnlayInlay}
              onChange={(e) => setCondicaoOnlayInlay(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoTratamentoExistente.PIVO && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Material"
              value={materialPivo}
              onChange={(e) => setMaterialPivo(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="Fibra de Vidro">Fibra de Vidro</option>
              <option value="Metal">Metal</option>
              <option value="Zircônia">Zircônia</option>
              <option value="Outro">Outro</option>
            </SelectField>
            <SelectField
              label="Tipo"
              value={tipoPivo}
              onChange={(e) => setTipoPivo(e.target.value as 'Pino' | 'Pilar' | 'Núcleo')}
            >
              <option value="">Selecione...</option>
              <option value="Pino">Pino</option>
              <option value="Pilar">Pilar</option>
              <option value="Núcleo">Núcleo</option>
            </SelectField>
            <TextAreaField
              label="Condição"
              value={condicaoPivo}
              onChange={(e) => setCondicaoPivo(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoTratamentoExistente.PROTESE_PARCIAL_REMOVIVEL && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Tipo"
              value={tipoProteseParcial}
              onChange={(e) => setTipoProteseParcial(e.target.value as 'Esquelética' | 'Flexível' | 'Acrílica')}
            >
              <option value="">Selecione...</option>
              <option value="Esquelética">Esquelética</option>
              <option value="Flexível">Flexível</option>
              <option value="Acrílica">Acrílica</option>
            </SelectField>
            <TextAreaField
              label="Elementos"
              value={elementosProteseParcial.join('\n')}
              onChange={(e) => handleElementosChange(e.target.value, setElementosProteseParcial)}
              rows={2}
            />
            <TextAreaField
              label="Condição"
              value={condicaoProteseParcial}
              onChange={(e) => setCondicaoProteseParcial(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoTratamentoExistente.PROTESE_TOTAL && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Material"
              value={materialProteseTotal}
              onChange={(e) => setMaterialProteseTotal(e.target.value as 'Acrílica' | 'Flexível' | 'Híbrida')}
            >
              <option value="">Selecione...</option>
              <option value="Acrílica">Acrílica</option>
              <option value="Flexível">Flexível</option>
              <option value="Híbrida">Híbrida</option>
            </SelectField>
            <TextAreaField
              label="Condição"
              value={condicaoProteseTotal}
              onChange={(e) => setCondicaoProteseTotal(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoTratamentoExistente.PROTESE_FIXA && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Tipo"
              value={tipoProteseFixa}
              onChange={(e) => setTipoProteseFixa(e.target.value as 'Ponte' | 'Unitária' | 'Maryland')}
            >
              <option value="">Selecione...</option>
              <option value="Ponte">Ponte</option>
              <option value="Unitária">Unitária</option>
              <option value="Maryland">Maryland</option>
            </SelectField>
            <TextAreaField
              label="Elementos"
              value={elementosProteseFixa.join('\n')}
              onChange={(e) => handleElementosChange(e.target.value, setElementosProteseFixa)}
              rows={2}
            />
            <TextAreaField
              label="Material"
              value={materialProteseFixa}
              onChange={(e) => setMaterialProteseFixa(e.target.value)}
              rows={2}
            />
            <TextAreaField
              label="Condição"
              value={condicaoProteseFixa}
              onChange={(e) => setCondicaoProteseFixa(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoTratamentoExistente.APARELHO_ORTODONTICO && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Tipo"
              value={tipoAparelhoOrtodontico}
              onChange={(e) => setTipoAparelhoOrtodontico(e.target.value as 'Fixo' | 'Removível' | 'Alinhador')}
            >
              <option value="">Selecione...</option>
              <option value="Fixo">Fixo</option>
              <option value="Removível">Removível</option>
              <option value="Alinhador">Alinhador</option>
            </SelectField>
            <TextAreaField
              label="Elementos"
              value={elementosAparelhoOrtodontico.join('\n')}
              onChange={(e) => handleElementosChange(e.target.value, setElementosAparelhoOrtodontico)}
              rows={2}
            />
            <TextAreaField
              label="Fase"
              value={faseAparelhoOrtodontico}
              onChange={(e) => setFaseAparelhoOrtodontico(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoTratamentoExistente.MANTENEDOR_ESPACO && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Tipo"
              value={tipoMantenedorEspaco}
              onChange={(e) => setTipoMantenedorEspaco(e.target.value as 'Fixo' | 'Removível')}
            >
              <option value="">Selecione...</option>
              <option value="Fixo">Fixo</option>
              <option value="Removível">Removível</option>
            </SelectField>
            <TextAreaField
              label="Elementos"
              value={elementosMantenedorEspaco.join('\n')}
              onChange={(e) => handleElementosChange(e.target.value, setElementosMantenedorEspaco)}
              rows={2}
            />
            <TextAreaField
              label="Condição"
              value={condicaoMantenedorEspaco}
              onChange={(e) => setCondicaoMantenedorEspaco(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoTratamentoExistente.CONTENCAO_ORTODONTICA && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Tipo"
              value={tipoContencaoOrtodontica}
              onChange={(e) => setTipoContencaoOrtodontica(e.target.value as 'Fixa' | 'Removível')}
            >
              <option value="">Selecione...</option>
              <option value="Fixa">Fixa</option>
              <option value="Removível">Removível</option>
            </SelectField>
            <TextAreaField
              label="Elementos"
              value={elementosContencaoOrtodontica.join('\n')}
              onChange={(e) => handleElementosChange(e.target.value, setElementosContencaoOrtodontica)}
              rows={2}
            />
            <TextAreaField
              label="Condição"
              value={condicaoContencaoOrtodontica}
              onChange={(e) => setCondicaoContencaoOrtodontica(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoTratamentoExistente.OUTRO_TRATAMENTO && (
          <div className="grid grid-cols-2 gap-4">
            <TextAreaField
              label="Descrição"
              value={descricaoOutroTratamento}
              onChange={(e) => setDescricaoOutroTratamento(e.target.value)}
              rows={2}
            />
            <TextAreaField
              label="Tipo"
              value={tipoOutroTratamento}
              onChange={(e) => setTipoOutroTratamento(e.target.value)}
              rows={2}
            />
            <TextAreaField
              label="Observações"
              value={observacoesOutroTratamento}
              onChange={(e) => setObservacoesOutroTratamento(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {tipo === TipoTratamentoExistente.RESTAURACAO && (
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Material"
              value={materialRestauracao}
              onChange={(e) => setMaterialRestauracao(e.target.value as "Amálgama" | "Resina" | "Ionômero" | "Outro")}
            >
              <option value="Amálgama">Amálgama</option>
              <option value="Resina">Resina</option>
              <option value="Ionômero">Ionômero</option>
              <option value="Outro">Outro</option>
            </SelectField>
            <TextAreaField
              label="Condição"
              value={condicaoRestauracao}
              onChange={(e) => setCondicaoRestauracao(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSaveRestauracao}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Salvar
          </button>
        </div>
      </div>
    );
  };

  const handleElementosChange = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(value.split('\n').filter(line => line.trim() !== ''));
  };

  // Adicionar a função handleSelectChange
  const handleSelectChange = <T extends string>(value: string, setter: React.Dispatch<React.SetStateAction<T>>) => {
    setter(value as T);
  };

  if (!selectedTooth) {
    return (
      <div className="p-6 bg-white shadow-xl rounded-xl h-full flex flex-col justify-center items-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-sky-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-2.471rm-1.131-1.131l2.471-.569-2.225 2.511M3 11.952V8.548a2.25 2.25 0 012.25-2.25h2.998c.513 0 .983.208 1.32.549l6.356 6.356a2.25 2.25 0 010 3.182l-2.998 2.998a2.25 2.25 0 01-3.182 0l-6.356-6.356A2.25 2.25 0 013 11.952z" />
        </svg>
        <p className="text-xl font-semibold text-slate-700">Nenhum Dente Selecionado</p>
        <p className="text-sm text-slate-500 mt-1">Clique em um dente no odontograma para ver os detalhes.</p>
      </div>
    );
  }
  
  return (
    <div className="p-3 sm:p-4 bg-white shadow-xl rounded-xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-sky-700">Dente {selectedTooth.number}</h3>
        <button onClick={onClosePanel} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors" aria-label="Fechar painel">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="space-y-4 flex-grow overflow-y-auto pr-1 sm:pr-2 pb-4 -mr-1 sm:-mr-2"> {/* Negative margin for scrollbar */}
        <AccordionSection title="Status Geral" isOpenDefault={true}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status Atual</label>
              <select
                value={currentStatusGeral.tipo}
                onChange={(e) => {
                  const newStatus: StatusGeralDente = { tipo: e.target.value as StatusGeralDenteTipo };
                  setCurrentStatusGeral(newStatus);
                  onUpdateTooth({ ...selectedTooth, statusGeral: newStatus });
                }}
                className="select-base"
              >
                {Object.entries(STATUS_GERAL_DENTE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection title="Condições Patológicas">
          <div className="space-y-4">
            {selectedCondicaoTipoToAdd || editingCondicao ? (
              renderCondicaoPatologicaForm(selectedCondicaoTipoToAdd || editingCondicao?.tipo || TipoCondicaoPatologica.CARIE)
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-slate-700">Adicionar Condição</label>
                  <select
                    value={selectedCondicaoTipoToAdd}
                    onChange={(e) => setSelectedCondicaoTipoToAdd(e.target.value as TipoCondicaoPatologica)}
                    className="select-base max-w-xs"
                  >
                    <option value="">Selecione o tipo...</option>
                    <option value={TipoCondicaoPatologica.CARIE}>Cárie</option>
                    <option value={TipoCondicaoPatologica.LESAO_PERIAPICAL}>Lesão Periapical</option>
                    <option value={TipoCondicaoPatologica.PROBLEMA_PERIODONTAL}>Problema Periodontal</option>
                    <option value={TipoCondicaoPatologica.FRATURA_DENTARIA}>Fratura Dentária</option>
                    <option value={TipoCondicaoPatologica.DESGASTE_DENTARIO}>Desgaste Dentário</option>
                    <option value={TipoCondicaoPatologica.MANCHA_DENTARIA}>Mancha</option>
                    <option value={TipoCondicaoPatologica.HIPERPLASIA_GENGIVAL}>Hiperplasia</option>
                    <option value={TipoCondicaoPatologica.RECESSAO_GENGIVAL}>Recessão Gengival</option>
                    <option value={TipoCondicaoPatologica.MOBILIDADE_DENTARIA}>Mobilidade Dentária</option>
                    <option value={TipoCondicaoPatologica.ANQUILOSE}>Anquilose</option>
                    <option value={TipoCondicaoPatologica.ERUPCAO_ECTOPICA}>Problema de Erupção</option>
                    <option value={TipoCondicaoPatologica.IMPACTACAO}>Impactação</option>
                    <option value={TipoCondicaoPatologica.RETENCAO_RAIZ}>Retenção</option>
                    <option value={TipoCondicaoPatologica.FISTULA}>Fístula</option>
                    <option value={TipoCondicaoPatologica.ABSCESSO}>Abscesso</option>
                    <option value={TipoCondicaoPatologica.GRANULOMA}>Granuloma</option>
                    <option value={TipoCondicaoPatologica.CISTO}>Cisto</option>
                    <option value={TipoCondicaoPatologica.HIPERMOBILIDADE_ATM}>Hipermobilidade</option>
                    <option value={TipoCondicaoPatologica.DISFUNCAO_ATM}>Disfunção Temporomandibular</option>
                    <option value={TipoCondicaoPatologica.OUTRA_CONDICAO}>Outra Condição</option>
                  </select>
                </div>

                {localCondicoesPatologicas.length > 0 ? (
                  <div className="space-y-2">
                    {localCondicoesPatologicas.map((condicao) => (
                      <div key={condicao.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-700">{condicao.tipo}</p>
                          <p className="text-sm text-slate-500">
                            Registrado em: {new Date().toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingCondicao(condicao)}
                            className="text-sky-600 hover:text-sky-800"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setLocalCondicoesPatologicas(prev => 
                              prev.filter(c => c.id !== condicao.id)
                            )}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-2">
                    Nenhuma condição patológica registrada
                  </p>
                )}
              </>
            )}
          </div>
        </AccordionSection>

        <AccordionSection title="Restaurações/Próteses Existentes">
          <div className="space-y-4">
            {selectedRestauracaoTipoToAdd || editingRestauracao ? (
              renderRestauracaoExistenteForm((editingRestauracao?.tipo || selectedRestauracaoTipoToAdd) as TipoTratamentoExistente)
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-slate-700">Adicionar Restauração/Prótese</label>
                  <select
                    value={selectedRestauracaoTipoToAdd}
                    onChange={(e) => setSelectedRestauracaoTipoToAdd(e.target.value as TipoTratamentoExistente)}
                    className="select-base max-w-xs"
                  >
                    <option value="">Selecione o tipo...</option>
                    {Object.values(TipoTratamentoExistente).map((tipo) => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                {localRestauracoesExistentes.length > 0 ? (
                  <div className="space-y-2">
                    {localRestauracoesExistentes.map((restauracao) => (
                      <div key={restauracao.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100">
                        <div>
                          <p className="font-medium text-slate-700">{restauracao.tipo}</p>
                          <p className="text-sm text-slate-500">
                            {restauracao.observacoesGerais || 'Sem observações'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditRestauracaoExistente(restauracao)}
                            className="text-sky-600 hover:text-sky-800 focus:outline-none focus:underline"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleRemoveRestauracaoExistente(restauracao.id)}
                            className="text-red-600 hover:text-red-800 focus:outline-none focus:underline"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">
                    Nenhuma restauração/prótese registrada
                  </p>
                )}
              </>
            )}
          </div>
        </AccordionSection>
        
        <AccordionSection title="Plano de Tratamento / Procedimentos">
          {!showTratamentoForm && (
            <button onClick={() => { setEditingTratamento(null); setShowTratamentoForm(true); }}
              className="btn btn-primary w-full text-sm bg-blue-500 hover:bg-blue-600">
              + Adicionar Procedimento
            </button>
          )}
          {showTratamentoForm && (
            <TratamentoDenteForm initialData={editingTratamento} procedimentos={procedimentos}
              onSave={handleSaveTratamentoAssociado} onCancel={() => { setShowTratamentoForm(false); setEditingTratamento(null); }}
            />
          )}
          {localTratamentos.length > 0 && !showTratamentoForm && (
            <div className="space-y-2.5 mt-3 max-h-48 overflow-y-auto text-xs">
              {localTratamentos.map(trat => (
                <div key={trat.id} className="p-2.5 bg-slate-50 rounded-md shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-grow">
                        <p className="font-semibold text-slate-800 text-sm">{trat.procedimentoNome}</p>
                        <p className="text-slate-600">Status: <span className={`font-medium ${
                            trat.status === TratamentoStatus.PLANEJADO ? 'text-amber-600' :
                            trat.status === TratamentoStatus.EXECUTADO ? 'text-blue-600' :
                            trat.status === TratamentoStatus.CONCLUIDO ? 'text-green-600' : ''
                            }`}>{trat.status}</span>
                        </p>
                        {trat.isAcaoSocial ? <p className="text-purple-600 font-medium">Ação Social (Gratuito)</p> : <p className="text-slate-600">Valor: {formatCurrency(trat.valor)}</p>}
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1.5 flex-shrink-0">
                      <button onClick={() => handleEditTratamentoAssociado(trat)} className="text-blue-600 hover:text-blue-800 text-xs p-1 hover:bg-blue-100 rounded">Editar</button>
                      <button onClick={() => handleRemoveTratamentoAssociado(trat.id)} className="text-red-600 hover:text-red-800 text-xs p-1 hover:bg-red-100 rounded">Remover</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {localTratamentos.length === 0 && !showTratamentoForm && <p className="text-sm text-slate-500 text-center py-2">Nenhum procedimento no plano.</p>}
        </AccordionSection>
      </div>

      <div className="mt-auto pt-5 border-t border-slate-200">
        <button onClick={handleSaveChanges} className="btn btn-primary w-full">
          Salvar Alterações no Dente
        </button>
      </div>

      <ConfirmacaoPagamentoModal
        isOpen={isConfirmModalOpenOdontograma} onClose={handleCancelConfirmacaoPagamentoModalOdontograma}
        onConfirm={handleConfirmarPagamentoEConcluirTratamentoOdontograma}
        tratamentoNome={tratamentoParaConfirmarOdontograma?.procedimentoNome || ''}
        tratamentoValor={tratamentoParaConfirmarOdontograma?.isAcaoSocial ? 0 : tratamentoParaConfirmarOdontograma?.valor}
      />
    </div>
  );
};

export default ToothInfoPanel;


import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
    Paciente, AnamneseClinicaData, Tooth, PatientDetailView, 
    ExameExtraoralData, ExameIntraoralData, 
    StatusGeralDenteTipo, TratamentoDente, TratamentoStatus, TratamentoPacienteDisplay,
    AgendaEvent, AgendaEventType, AgendaEventStatus,
    TransacaoFinanceira, TipoTransacao
} from '../types';
import AnamneseFormComponent from '../components/pacientes/AnamneseFormComponent';
import ExameExtraoralFormComponent from '../components/pacientes/ExameExtraoralFormComponent';
import ExameIntraoralFormComponent from '../components/pacientes/ExameIntraoralFormComponent';
import OdontogramDisplay from '../components/odontogram/OdontogramDisplay';
import ToothInfoPanel from '../components/odontogram/ToothInfoPanel';
import Legend from '../components/odontogram/Legend';
import { INITIAL_TEETH_DATA, PROCEDIMENTOS_DENTARIOS } from '../constants';
import AgendamentoTratamentoModal from '../components/pacientes/AgendamentoTratamentoModal';
import ConfirmacaoPagamentoModal from '../components/pacientes/ConfirmacaoPagamentoModal';

interface PacienteDetailPageProps {
  paciente: Paciente;
  onGoBack: () => void;
  onSaveAnamnese: (pacienteId: string, data: AnamneseClinicaData) => void;
  onSaveExameExtraoral: (pacienteId: string, data: ExameExtraoralData) => void;
  onSaveExameIntraoral: (pacienteId: string, data: ExameIntraoralData) => void;
  onUpdateOdontograma: (pacienteId: string, teeth: Tooth[]) => void;
  onAddAgendaEvent: (eventData: Omit<AgendaEvent, 'id'>) => void;
  onAddTransacaoFinanceira: (transacaoData: Omit<TransacaoFinanceira, 'id'>) => void; 
}

const formatDate = (dateString?: string, includeTime = false) => {
  if (!dateString) return 'Não informado';
  try {
    let date;
    if (dateString.includes('T') || dateString.includes('Z')) {
        date = new Date(dateString);
    } else if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-').map(Number);
        date = new Date(Date.UTC(year, month - 1, day)); 
    } else {
        date = new Date(dateString);
    }

    if (isNaN(date.getTime())) {
        return dateString; 
    }
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'short', day: '2-digit',
    };
    if (dateString.includes('T') || includeTime) {
        options.hour = '2-digit'; options.minute = '2-digit'; options.timeZone = undefined;
    } else {
        options.timeZone = 'UTC';
    }
    return date.toLocaleDateString('pt-BR', options);
  } catch (e) {
    console.error("Erro ao formatar data:", dateString, e);
    return dateString; 
  }
};

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return 'N/A';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const DisplayField: React.FC<{label: string, value?: string | null | undefined | boolean, isPre?: boolean, className?: string}> = 
  ({ label, value, isPre = false, className = '' }) => (
  (value !== undefined && value !== null && value !== '') || typeof value === 'boolean' ? (
    <div className={`py-2 ${className}`}>
      <dt className="font-semibold text-slate-600 text-sm">{label}:</dt>
      {isPre ? <pre className="text-slate-800 whitespace-pre-wrap font-sans text-sm mt-0.5">{String(value)}</pre> 
             : <dd className="text-slate-800 whitespace-pre-wrap text-sm mt-0.5">{String(value)}</dd>}
    </div>
  ) : null
);


const PacienteDetailPage: React.FC<PacienteDetailPageProps> = ({
  paciente, onGoBack, onSaveAnamnese, onSaveExameExtraoral, onSaveExameIntraoral,
  onUpdateOdontograma, onAddAgendaEvent, onAddTransacaoFinanceira, 
}) => {
  const [currentDetailView, setCurrentDetailView] = useState<PatientDetailView>(PatientDetailView.INFO);
  const [showAnamneseForm, setShowAnamneseForm] = useState(false);
  const [showExameExtraoralForm, setShowExameExtraoralForm] = useState(false);
  const [showExameIntraoralForm, setShowExameIntraoralForm] = useState(false);

  const [isAgendamentoModalOpen, setIsAgendamentoModalOpen] = useState(false);
  const [tratamentoParaAgendar, setTratamentoParaAgendar] = useState<TratamentoPacienteDisplay | null>(null);

  const [isConfirmacaoPagamentoModalOpen, setIsConfirmacaoPagamentoModalOpen] = useState(false);
  const [tratamentoParaConcluir, setTratamentoParaConcluir] = useState<TratamentoPacienteDisplay | null>(null);

  const initializeSingleTooth = (tooth: Partial<Tooth> | undefined, templateTooth: Tooth): Tooth => ({
    id: tooth?.id || templateTooth.id,
    number: tooth?.number || templateTooth.number,
    quadrant: tooth?.quadrant || templateTooth.quadrant,
    statusGeral: tooth?.statusGeral || { ...(templateTooth.statusGeral || { tipo: StatusGeralDenteTipo.PRESENTE }) },
    notes: tooth?.notes !== undefined ? tooth.notes : templateTooth.notes,
    tratamentos: tooth?.tratamentos ? JSON.parse(JSON.stringify(tooth.tratamentos)) : [],
    condicoesPatologicas: tooth?.condicoesPatologicas ? JSON.parse(JSON.stringify(tooth.condicoesPatologicas)) : [],
    restauracoesProtesesExistentes: tooth?.restauracoesProtesesExistentes ? JSON.parse(JSON.stringify(tooth.restauracoesProtesesExistentes)) : [],
    anomalias: tooth?.anomalias ? JSON.parse(JSON.stringify(tooth.anomalias)) : [],
  });
  
  const initializeTeeth = useCallback((odontogramaSource?: Tooth[]): Tooth[] => {
    const baseTemplate = INITIAL_TEETH_DATA; 
    if (odontogramaSource && odontogramaSource.length === baseTemplate.length) {
      return odontogramaSource.map((sourceTooth, index) => 
        initializeSingleTooth(sourceTooth, baseTemplate[index])
      );
    }
    return JSON.parse(JSON.stringify(baseTemplate));
  }, []);
  
  const [patientTeeth, setPatientTeeth] = useState<Tooth[]>(() => initializeTeeth(paciente.odontograma));
  const [selectedTooth, setSelectedTooth] = useState<Tooth | null>(null);

  useEffect(() => {
    const newInitializedTeeth = initializeTeeth(paciente.odontograma);
    setPatientTeeth(newInitializedTeeth);
    if (selectedTooth) {
      setSelectedTooth(prevSelected => newInitializedTeeth.find(t => t.id === prevSelected?.id) || null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paciente.odontograma, initializeTeeth]); // Added initializeTeeth to deps

  const handleFormSave = (saveFn: () => void, formSetFn: (show: boolean) => void) => { saveFn(); formSetFn(false); };
  const handleAnamneseSave = (data: AnamneseClinicaData) => handleFormSave(() => onSaveAnamnese(paciente.id, data), setShowAnamneseForm);
  const handleExameExtraoralSave = (data: ExameExtraoralData) => handleFormSave(() => onSaveExameExtraoral(paciente.id, data), setShowExameExtraoralForm);
  const handleExameIntraoralSave = (data: ExameIntraoralData) => handleFormSave(() => onSaveExameIntraoral(paciente.id, data), setShowExameIntraoralForm);

  const handleUpdateTooth = useCallback((updatedToothFull: Tooth) => {
    const newTeeth = patientTeeth.map(t => t.id === updatedToothFull.id ? updatedToothFull : t);
    setPatientTeeth(newTeeth);
    setSelectedTooth(updatedToothFull); 
    onUpdateOdontograma(paciente.id, newTeeth);
  }, [patientTeeth, paciente.id, onUpdateOdontograma]);

  const handleSelectTooth = useCallback((tooth: Tooth) => {
    const currentVersionOfTooth = patientTeeth.find(t => t.id === tooth.id);
    setSelectedTooth(currentVersionOfTooth || tooth);
  }, [patientTeeth]);
  
  const handleCloseToothInfoPanel = useCallback(() => setSelectedTooth(null), []);

  const todosOsTratamentos = useMemo((): TratamentoPacienteDisplay[] => 
    (patientTeeth || []).flatMap(tooth => 
      (tooth.tratamentos || []).map(trat => ({
        ...trat, toothId: tooth.id, toothNumber: tooth.number,
      }))
    ), [patientTeeth]);

  const tratamentosAtivos = useMemo(() => todosOsTratamentos
    .filter(t => t.status === TratamentoStatus.PLANEJADO || t.status === TratamentoStatus.EXECUTADO)
    .sort((a,b) => (new Date(a.dataPlanejamento || 0).getTime()) - (new Date(b.dataPlanejamento || 0).getTime() || a.id.localeCompare(b.id))), 
  [todosOsTratamentos]);

  const tratamentosConcluidos = useMemo(() => todosOsTratamentos
    .filter(t => t.status === TratamentoStatus.CONCLUIDO)
    .sort((a,b) => (new Date(b.dataConclusao || 0).getTime()) - (new Date(a.dataConclusao || 0).getTime() || a.id.localeCompare(b.id))),
  [todosOsTratamentos]);

  const handleOpenAgendamentoModal = (tratamento: TratamentoPacienteDisplay) => { setTratamentoParaAgendar(tratamento); setIsAgendamentoModalOpen(true); };
  const handleCloseAgendamentoModal = () => { setIsAgendamentoModalOpen(false); setTratamentoParaAgendar(null); };

  const handleConfirmAgendamento = (dia: string, hora: string) => {
    if (!tratamentoParaAgendar) return;
    const dataExecucaoISO = `${dia}T${hora}:00`; 
    const updatedOdontograma = patientTeeth.map(tooth => tooth.id === tratamentoParaAgendar.toothId ? {
      ...tooth, tratamentos: (tooth.tratamentos || []).map(trat => trat.id === tratamentoParaAgendar.id ? {
        ...trat, status: TratamentoStatus.EXECUTADO, dataExecucao: dataExecucaoISO,
      } : trat),
    } : tooth);
    onUpdateOdontograma(paciente.id, updatedOdontograma);

    const startDateTime = new Date(dataExecucaoISO);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); 
    onAddAgendaEvent({
      tipo: AgendaEventType.AGENDAMENTO_TRATAMENTO,
      titulo: `Trat: ${tratamentoParaAgendar.procedimentoNome} (D${tratamentoParaAgendar.toothNumber}) - ${paciente.nome}`,
      startDateTime: startDateTime.toISOString(), endDateTime: endDateTime.toISOString(),
      pacienteId: paciente.id, pacienteNome: paciente.nome,
      tratamentoId: tratamentoParaAgendar.id, status: AgendaEventStatus.AGENDADO,
      descricao: `Agendamento para ${tratamentoParaAgendar.procedimentoNome} no dente ${tratamentoParaAgendar.toothNumber}.`,
    });
    handleCloseAgendamentoModal();
  };

  const handleOpenConfirmacaoPagamento = (tratamento: TratamentoPacienteDisplay) => { setTratamentoParaConcluir(tratamento); setIsConfirmacaoPagamentoModalOpen(true); };
  const handleCloseConfirmacaoPagamento = () => { setIsConfirmacaoPagamentoModalOpen(false); setTratamentoParaConcluir(null); };

  const handleConfirmarPagamentoEConcluirTratamento = (metodoDePagamento: string) => {
    if (!tratamentoParaConcluir) return;
    const dataConclusao = new Date().toISOString().split('T')[0]; 
    const updatedOdontograma = patientTeeth.map(tooth => tooth.id === tratamentoParaConcluir.toothId ? {
      ...tooth, tratamentos: (tooth.tratamentos || []).map(trat => trat.id === tratamentoParaConcluir.id ? {
        ...trat, status: TratamentoStatus.CONCLUIDO, dataConclusao: dataConclusao,
      } : trat),
    } : tooth);
    onUpdateOdontograma(paciente.id, updatedOdontograma);

    if (tratamentoParaConcluir.valor && tratamentoParaConcluir.valor > 0 && !tratamentoParaConcluir.isAcaoSocial) {
        onAddTransacaoFinanceira({
            tipo: TipoTransacao.ENTRADA, data: dataConclusao,
            descricao: `Procedimento: ${tratamentoParaConcluir.procedimentoNome} (Dente ${tratamentoParaConcluir.toothNumber}) - Paciente: ${paciente.nome}`,
            valor: tratamentoParaConcluir.valor, categoria: 'Procedimento Odontológico',
            pacienteId: paciente.id, pacienteNome: paciente.nome,
            tratamentoId: tratamentoParaConcluir.id,
            metodoPagamento: metodoDePagamento as TransacaoFinanceira['metodoPagamento'],
        });
    }
    handleCloseConfirmacaoPagamento();
  };

  const renderViewContent = () => {
    const commonCardClass = "bg-white p-4 sm:p-6 rounded-xl shadow-lg";
    const formCardClass = "bg-white p-5 sm:p-8 rounded-xl shadow-xl";
    
    switch (currentDetailView) {
      case PatientDetailView.INFO:
        return (
          <div className="space-y-6">
            <div className={commonCardClass}>
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Informações do Paciente</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                <DisplayField label="Nome" value={paciente.nome} />
                <DisplayField label="CPF" value={paciente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')} />
                <DisplayField label="Data de Nascimento" value={formatDate(paciente.dataNascimento)} />
                <DisplayField label="Telefone" value={paciente.telefone} />
                <DisplayField label="Email" value={paciente.email} />
                <DisplayField label="Endereço" value={paciente.endereco} className="sm:col-span-2"/>
              </dl>
            </div>

            <div className={commonCardClass}>
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Tratamentos Planejados / Em Andamento</h3>
              {tratamentosAtivos.length > 0 ? (
                <ul className="space-y-4">
                  {tratamentosAtivos.map(trat => (
                    <li key={trat.id} className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="flex-grow">
                          <p className="font-semibold text-slate-800">{trat.procedimentoNome} (Dente: {trat.toothNumber})</p>
                          <p className="text-sm text-slate-600">Status: 
                            <span className={`font-semibold ml-1 ${
                              trat.status === TratamentoStatus.PLANEJADO ? 'text-amber-600' : 'text-blue-600'
                            }`}>{trat.status}</span>
                          </p>
                          <p className="text-sm text-slate-600">Valor: {trat.isAcaoSocial ? <span className="text-purple-600 font-medium">Ação Social (Gratuito)</span> : formatCurrency(trat.valor)}</p>
                          {trat.dataPlanejamento && trat.status === TratamentoStatus.PLANEJADO && 
                            <p className="text-xs text-slate-500">Planejado para: {formatDate(trat.dataPlanejamento)}</p>}
                          {trat.dataExecucao && trat.status === TratamentoStatus.EXECUTADO && 
                            <p className="text-xs text-slate-500">Agendado para: {formatDate(trat.dataExecucao, true)}</p>}
                        </div>
                        <div className="flex space-x-2 mt-2 sm:mt-0 flex-shrink-0">
                          {trat.status === TratamentoStatus.PLANEJADO && (
                            <button onClick={() => handleOpenAgendamentoModal(trat)}
                              className="btn btn-primary text-xs px-3 py-1.5 bg-green-500 hover:bg-green-600">Agendar</button>
                          )}
                          {trat.status === TratamentoStatus.EXECUTADO && (
                            <button onClick={() => handleOpenConfirmacaoPagamento(trat)}
                              className="btn btn-primary text-xs px-3 py-1.5 bg-teal-500 hover:bg-teal-600">Marcar Concluído</button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-slate-500">Nenhum tratamento ativo no momento.</p>}
            </div>

            <div className={commonCardClass}>
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Histórico de Tratamentos Concluídos</h3>
              {tratamentosConcluidos.length > 0 ? (
                <ul className="space-y-3">
                  {tratamentosConcluidos.map(trat => (
                    <li key={trat.id} className="p-3 bg-green-50 rounded-md border border-green-200">
                      <p className="font-medium text-slate-800">{trat.procedimentoNome} (Dente: {trat.toothNumber})</p>
                      <p className="text-sm text-slate-600">Concluído em: {formatDate(trat.dataConclusao)}</p>
                      <p className="text-sm text-slate-600">Valor: {trat.isAcaoSocial ? <span className="text-purple-600 font-medium">Ação Social (Gratuito)</span> : formatCurrency(trat.valor)}</p>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-slate-500">Nenhum tratamento concluído registrado.</p>}
            </div>
          </div>
        );
      case PatientDetailView.ANAMNESE:
        if (showAnamneseForm || !paciente.anamnese?.dataPreenchimento) {
          return <div className={formCardClass}><AnamneseFormComponent initialData={paciente.anamnese} onSave={handleAnamneseSave} onCancel={() => setShowAnamneseForm(false)}/></div>;
        }
        return (
          <div className={commonCardClass}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-slate-700">Anamnese Clínica</h3>
              <button onClick={() => setShowAnamneseForm(true)} className="btn btn-secondary text-sm px-3 py-1.5">Editar</button>
            </div>
            {/* Conteúdo da Anamnese aqui... */}
            <dl className="space-y-1 text-sm">
              <DisplayField label="Queixa Principal" value={paciente.anamnese.queixaPrincipal} isPre />
              <DisplayField label="História da Doença Atual" value={paciente.anamnese.historiaDoencaAtual} isPre />
              {/* ... outros campos da Anamnese ... */}
              <p className="text-xs text-slate-500 mt-4 pt-2 border-t">
                Preenchida em: {formatDate(paciente.anamnese.dataPreenchimento)}
                {paciente.anamnese.ultimaAtualizacao && paciente.anamnese.ultimaAtualizacao !== paciente.anamnese.dataPreenchimento && ` | Atualizada em: ${formatDate(paciente.anamnese.ultimaAtualizacao)}`}
              </p>
            </dl>
          </div>
        );
      // Casos para EXAME_EXTRAORAL, EXAME_INTRAORAL (similar à Anamnese)
      case PatientDetailView.EXAME_EXTRAORAL:
        if (showExameExtraoralForm || !paciente.exameExtraoral?.dataPreenchimento) {
          return <div className={formCardClass}><ExameExtraoralFormComponent initialData={paciente.exameExtraoral} onSave={handleExameExtraoralSave} onCancel={() => setShowExameExtraoralForm(false)}/></div>;
        }
        return (
          <div className={commonCardClass}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-slate-700">Exame Extraoral</h3>
              <button onClick={() => setShowExameExtraoralForm(true)} className="btn btn-secondary text-sm px-3 py-1.5">Editar</button>
            </div>
             {/* Conteúdo do Exame Extraoral */}
            <dl className="space-y-1 text-sm">
                <DisplayField label="Simetria Facial" value={paciente.exameExtraoral.simetriaFacialObs} isPre />
                {/* ... outros campos ... */}
                <p className="text-xs text-slate-500 mt-4 pt-2 border-t">
                    Preenchido em: {formatDate(paciente.exameExtraoral.dataPreenchimento)}
                    {paciente.exameExtraoral.ultimaAtualizacao && paciente.exameExtraoral.ultimaAtualizacao !== paciente.exameExtraoral.dataPreenchimento && ` | Atualizado em: ${formatDate(paciente.exameExtraoral.ultimaAtualizacao)}`}
                </p>
            </dl>
          </div>
        );
      case PatientDetailView.EXAME_INTRAORAL:
        if (showExameIntraoralForm || !paciente.exameIntraoral?.dataPreenchimento) {
          return <div className={formCardClass}><ExameIntraoralFormComponent initialData={paciente.exameIntraoral} onSave={handleExameIntraoralSave} onCancel={() => setShowExameIntraoralForm(false)}/></div>;
        }
        return (
          <div className={commonCardClass}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-slate-700">Exame Intraoral</h3>
              <button onClick={() => setShowExameIntraoralForm(true)} className="btn btn-secondary text-sm px-3 py-1.5">Editar</button>
            </div>
            {/* Conteúdo do Exame Intraoral */}
            <dl className="space-y-1 text-sm">
                <DisplayField label="Lábios (mucosa interna) e Fórnix Vestibular" value={paciente.exameIntraoral.labiosMucosaInternaFornixObs} isPre />
                {/* ... outros campos ... */}
                <p className="text-xs text-slate-500 mt-4 pt-2 border-t">
                    Preenchido em: {formatDate(paciente.exameIntraoral.dataPreenchimento)}
                    {paciente.exameIntraoral.ultimaAtualizacao && paciente.exameIntraoral.ultimaAtualizacao !== paciente.exameIntraoral.dataPreenchimento && ` | Atualizado em: ${formatDate(paciente.exameIntraoral.ultimaAtualizacao)}`}
                </p>
            </dl>
          </div>
        );
      case PatientDetailView.ODONTOGRAMA:
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <OdontogramDisplay teeth={patientTeeth} selectedTooth={selectedTooth} onSelectTooth={handleSelectTooth} />
            </div>
            <div className="xl:col-span-1 space-y-6">
              <ToothInfoPanel
                selectedTooth={selectedTooth} onUpdateTooth={handleUpdateTooth}
                onClosePanel={handleCloseToothInfoPanel} procedimentos={PROCEDIMENTOS_DENTARIOS}
                onAddTransacaoFinanceira={onAddTransacaoFinanceira} 
                pacienteId={paciente.id} pacienteNome={paciente.nome} 
              />
              <Legend />
            </div>
          </div>
        );
      default: return null;
    }
  };

  const TabButton: React.FC<{ view: PatientDetailView; label: string; current: PatientDetailView; onClick: (view: PatientDetailView) => void }> =
    ({ view, label, current, onClick }) => (
      <button
        onClick={() => {
            onClick(view);
            if (view !== PatientDetailView.ANAMNESE && showAnamneseForm) setShowAnamneseForm(false);
            if (view !== PatientDetailView.EXAME_EXTRAORAL && showExameExtraoralForm) setShowExameExtraoralForm(false);
            if (view !== PatientDetailView.EXAME_INTRAORAL && showExameIntraoralForm) setShowExameIntraoralForm(false);
        }}
        className={`px-3 py-2.5 sm:px-4 font-medium text-xs sm:text-sm rounded-lg transition-all duration-150 ease-in-out whitespace-nowrap
                    ${current === view 
                        ? 'bg-sky-600 text-white shadow-md' 
                        : 'text-slate-600 hover:bg-sky-100 hover:text-sky-700 focus-visible:bg-sky-100 focus-visible:text-sky-700'
                    }`}
        aria-current={current === view ? 'page' : undefined}
      >
        {label}
      </button>
    );

  return (
    <div className="p-2 sm:p-4">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800">
          Detalhes de: <span className="text-sky-700">{paciente.nome}</span>
        </h2>
        <button onClick={onGoBack} className="btn btn-secondary text-sm px-4 py-2">
          &larr; Voltar para Lista
        </button>
      </div>

      <div className="mb-6 flex space-x-1 sm:space-x-2 border-b border-slate-300 pb-2 overflow-x-auto">
        <TabButton view={PatientDetailView.INFO} label="Info. Gerais" current={currentDetailView} onClick={setCurrentDetailView} />
        <TabButton view={PatientDetailView.ANAMNESE} label="Anamnese" current={currentDetailView} onClick={setCurrentDetailView} />
        <TabButton view={PatientDetailView.EXAME_EXTRAORAL} label="Ex. Extraoral" current={currentDetailView} onClick={setCurrentDetailView} />
        <TabButton view={PatientDetailView.EXAME_INTRAORAL} label="Ex. Intraoral" current={currentDetailView} onClick={setCurrentDetailView} />
        <TabButton view={PatientDetailView.ODONTOGRAMA} label="Odontograma" current={currentDetailView} onClick={setCurrentDetailView} />
      </div>
      
      <div className="mt-4">
        {renderViewContent()}
      </div>

      <AgendamentoTratamentoModal
        isOpen={isAgendamentoModalOpen} onClose={handleCloseAgendamentoModal} onConfirm={handleConfirmAgendamento}
        tratamentoInfo={tratamentoParaAgendar ? { nomeProcedimento: tratamentoParaAgendar.procedimentoNome, denteNumero: tratamentoParaAgendar.toothNumber } : null}
      />
      <ConfirmacaoPagamentoModal
        isOpen={isConfirmacaoPagamentoModalOpen} onClose={handleCloseConfirmacaoPagamento} onConfirm={handleConfirmarPagamentoEConcluirTratamento} 
        tratamentoNome={tratamentoParaConcluir?.procedimentoNome || ''}
        tratamentoValor={tratamentoParaConcluir?.isAcaoSocial ? 0 : tratamentoParaConcluir?.valor}
      />
    </div>
  );
};

export default PacienteDetailPage;

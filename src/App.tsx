import React, { useState, useCallback, useEffect } from 'react';
import {
  AppView, AgendaEvent, Paciente, Tooth, AnamneseClinicaData,
  ExameExtraoralData, ExameIntraoralData, TransacaoFinanceira
} from './types';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';
import DashboardPage from './pages/DashboardPage';
import PacientesPage from './pages/PacientesPage';
import AgendaPage from './pages/AgendaPage';
import FinanceiroPage from './pages/FinanceiroPage';
import DentalAssistant from './components/assistant/DentalAssistant';

// Firebase imports apenas para autenticação inicial
import { auth, appId_global, initialAuthToken_global } from './firebase';
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from "firebase/auth";

// Importando serviços da API
import { pacientesService, agendaService, financeiroService } from './services/api';

// Componente de Modal de Confirmação Genérico
const ConfirmationModal: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="btn btn-secondary px-3 py-1.5 text-sm">Cancelar</button>
          <button onClick={onConfirm} className="btn btn-primary bg-red-600 hover:bg-red-700 px-3 py-1.5 text-sm">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // Estado da Aplicação
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>([]);
  const [transacoesFinanceiras, setTransacoesFinanceiras] = useState<TransacaoFinanceira[]>([]);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Estado do Firebase (apenas para autenticação)
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [appId, setAppId] = useState<string>(appId_global);

  // Estado para o modal de confirmação de exclusão
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [pacienteToDeleteId, setPacienteToDeleteId] = useState<string | null>(null);

  // Inicialização e Autenticação do Firebase
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('appId', appId_global);
      } else {
        if (initialAuthToken_global) {
          try {
            await signInWithCustomToken(auth, initialAuthToken_global);
          } catch (error) {
            console.error("Erro ao fazer login com token customizado, tentando anônimo:", error);
            try {
              await signInAnonymously(auth);
            } catch (anonError) {
              console.error("Erro ao fazer login anônimo após falha do token:", anonError);
            }
          }
        } else {
          try {
            await signInAnonymously(auth);
          } catch (anonError) {
            console.error("Erro ao fazer login anônimo:", anonError);
          }
        }
      }
      setIsAuthReady(true);
    });

    return () => unsubscribeAuth();
  }, []);

  // Carregar dados da API
  useEffect(() => {
    if (!isAuthReady || !userId) return;

    const loadData = async () => {
      try {
        const [pacientesData, agendaData, financeiroData] = await Promise.all([
          pacientesService.getAll(),
          agendaService.getAll(),
          financeiroService.getAll()
        ]);

        setPacientes(pacientesData);
        setAgendaEvents(agendaData);
        setTransacoesFinanceiras(financeiroData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadData();
  }, [isAuthReady, userId]);

  // Navegação e UI
  const navigateTo = useCallback((view: AppView) => {
    setCurrentView(view);
    if (window.innerWidth < 768) setIsSidebarOpenMobile(false);
  }, []);

  const toggleSidebarMobile = useCallback(() => setIsSidebarOpenMobile(prev => !prev), []);
  const toggleAssistant = useCallback(() => setIsAssistantOpen(prev => !prev), []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsSidebarOpenMobile(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Funções CRUD para Pacientes usando a API
  const handleSavePaciente = useCallback(async (pacienteData: Omit<Paciente, 'id'> | Paciente) => {
    try {
      if ('id' in pacienteData && pacienteData.id) {
        await pacientesService.update(pacienteData.id, pacienteData);
        setPacientes(prev => prev.map(p => p.id === pacienteData.id ? pacienteData : p));
      } else {
        const novoPaciente = await pacientesService.create(pacienteData);
        setPacientes(prev => [...prev, novoPaciente]);
      }
    } catch (error) {
      console.error("Erro ao salvar paciente:", error);
      throw error;
    }
  }, []);

  const handleDeletePaciente = useCallback(async (pacienteId: string) => {
    try {
      await pacientesService.delete(pacienteId);
      setPacientes(prev => prev.filter(p => p.id !== pacienteId));
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);
      throw error;
    }
    setIsDeleteConfirmModalOpen(false);
    setPacienteToDeleteId(null);
  }, []);

  const requestDeletePaciente = (pacienteId: string) => {
    setPacienteToDeleteId(pacienteId);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleSaveAnamnese = useCallback(async (pacienteId: string, anamneseData: AnamneseClinicaData) => {
    try {
      await pacientesService.updateProntuario(pacienteId, 'anamnese', anamneseData);
      setPacientes(prev => prev.map(p => 
        p.id === pacienteId ? { ...p, anamnese: anamneseData } : p
      ));
    } catch (error) {
      console.error("Erro ao salvar anamnese:", error);
      throw error;
    }
  }, []);

  const handleSaveExameExtraoral = useCallback(async (pacienteId: string, exameData: ExameExtraoralData) => {
    try {
      await pacientesService.updateProntuario(pacienteId, 'exameExtraoral', exameData);
      setPacientes(prev => prev.map(p => 
        p.id === pacienteId ? { ...p, exameExtraoral: exameData } : p
      ));
    } catch (error) {
      console.error("Erro ao salvar exame extraoral:", error);
      throw error;
    }
  }, []);

  const handleSaveExameIntraoral = useCallback(async (pacienteId: string, exameData: ExameIntraoralData) => {
    try {
      await pacientesService.updateProntuario(pacienteId, 'exameIntraoral', exameData);
      setPacientes(prev => prev.map(p => 
        p.id === pacienteId ? { ...p, exameIntraoral: exameData } : p
      ));
    } catch (error) {
      console.error("Erro ao salvar exame intraoral:", error);
      throw error;
    }
  }, []);

  const handleUpdatePacienteOdontograma = useCallback(async (pacienteId: string, updatedTeeth: Tooth[]) => {
    try {
      await pacientesService.updateProntuario(pacienteId, 'odontograma', updatedTeeth);
      setPacientes(prev => prev.map(p => 
        p.id === pacienteId ? { ...p, odontograma: updatedTeeth } : p
      ));
    } catch (error) {
      console.error("Erro ao atualizar odontograma:", error);
      throw error;
    }
  }, []);

  // Funções CRUD para Eventos da Agenda usando a API
  const handleAddAgendaEvent = useCallback(async (eventData: Omit<AgendaEvent, 'id'>) => {
    try {
      const novoEvento = await agendaService.create(eventData);
      setAgendaEvents(prev => [...prev, novoEvento]);
    } catch (error) {
      console.error("Erro ao adicionar evento na agenda:", error);
      throw error;
    }
  }, []);

  const handleUpdateAgendaEvent = useCallback(async (updatedEvent: AgendaEvent) => {
    try {
      await agendaService.update(updatedEvent.id, updatedEvent);
      setAgendaEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    } catch (error) {
      console.error("Erro ao atualizar evento na agenda:", error);
      throw error;
    }
  }, []);

  // Funções CRUD para Transações Financeiras usando a API
  const handleAddTransacaoFinanceira = useCallback(async (transacaoData: Omit<TransacaoFinanceira, 'id'>) => {
    try {
      const novaTransacao = await financeiroService.create(transacaoData);
      setTransacoesFinanceiras(prev => [...prev, novaTransacao]);
    } catch (error) {
      console.error("Erro ao adicionar transação financeira:", error);
      throw error;
    }
  }, []);

  // Renderização do Conteúdo da Página
  let pageContent;
  if (!isAuthReady) {
    pageContent = <div className="flex justify-center items-center h-full"><p className="text-xl">Carregando autenticação...</p></div>;
  } else if (!userId) {
    pageContent = <div className="flex justify-center items-center h-full"><p className="text-xl text-red-500">Falha na autenticação. Por favor, recarregue.</p></div>;
  } else {
    switch (currentView) {
      case AppView.DASHBOARD:
        pageContent = <DashboardPage
          agendaEvents={agendaEvents}
          pacientes={pacientes}
          transacoes={transacoesFinanceiras}
        />;
        break;
      case AppView.PACIENTES:
        pageContent = <PacientesPage
          pacientes={pacientes}
          onSavePaciente={handleSavePaciente}
          onDeletePaciente={requestDeletePaciente}
          onSaveAnamnese={handleSaveAnamnese}
          onSaveExameExtraoral={handleSaveExameExtraoral}
          onSaveExameIntraoral={handleSaveExameIntraoral}
          onUpdateOdontograma={handleUpdatePacienteOdontograma}
          onAddAgendaEvent={handleAddAgendaEvent}
          onAddTransacaoFinanceira={handleAddTransacaoFinanceira}
        />;
        break;
      case AppView.AGENDA:
        pageContent = <AgendaPage
          agendaEvents={agendaEvents}
          onAddAgendaEvent={handleAddAgendaEvent}
          onUpdateAgendaEvent={handleUpdateAgendaEvent}
          pacientes={pacientes}
        />;
        break;
      case AppView.FINANCEIRO:
        pageContent = <FinanceiroPage
          transacoes={transacoesFinanceiras}
          onAddTransacao={handleAddTransacaoFinanceira}
        />;
        break;
      default:
        pageContent = <DashboardPage 
          agendaEvents={agendaEvents}
          pacientes={pacientes}
          transacoes={transacoesFinanceiras}
        />;
    }
  }

  return (
    <div className="flex flex-col h-screen antialiased">
      <Header 
        appName="BM Odonto CRM" 
        onToggleSidebar={toggleSidebarMobile}
        onToggleAssistant={toggleAssistant}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentView={currentView}
          navigateTo={navigateTo}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobileSidebar={() => setIsSidebarOpenMobile(false)}
        />
        <MainContent isSidebarOpenMobile={isSidebarOpenMobile}>
          {pageContent}
          {userId && (
            <div className="fixed bottom-2 right-2 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-xl z-[90]">
              <p>App ID: {appId}</p>
              <p>User ID: {userId.substring(0,10)}...</p>
            </div>
          )}
        </MainContent>
      </div>

      {/* Assistente IA */}
      {isAssistantOpen && (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] z-[100]">
          <DentalAssistant />
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteConfirmModalOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita."
        onConfirm={() => {
          if (pacienteToDeleteId) {
            handleDeletePaciente(pacienteToDeleteId);
          }
        }}
        onCancel={() => {
          setIsDeleteConfirmModalOpen(false);
          setPacienteToDeleteId(null);
        }}
      />
    </div>
  );
};

export default App; 
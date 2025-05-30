// App.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  AppView, AgendaEvent, Paciente, Tooth, AnamneseClinicaData,
  ExameExtraoralData, ExameIntraoralData, TransacaoFinanceira,
  TipoTransacao, AgendaEventType, AgendaEventStatus
} from './types'; // Se types.ts estiver na raiz, senão ajuste o caminho
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';
import DashboardPage from './pages/DashboardPage';
import PacientesPage from './pages/PacientesPage';
import AgendaPage from './pages/AgendaPage';
import FinanceiroPage from './pages/FinanceiroPage';
import { INITIAL_TEETH_DATA } from './constants'; // Se constants.ts estiver na raiz, senão ajuste o caminho

// Firebase imports
import { db, auth, appId_global, initialAuthToken_global } from './firebase'; // Se firebase.ts estiver na raiz
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  Firestore,
  Auth
} from "firebase/firestore";
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken, User } from "firebase/auth";

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

  // Estado do Firebase
  const [firebaseDB, setFirebaseDB] = useState<Firestore | null>(null);
  const [firebaseAuth, setFirebaseAuth] = useState<Auth | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [appId, setAppId] = useState<string>(appId_global);

  // Estado para o modal de confirmação de exclusão
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [pacienteToDeleteId, setPacienteToDeleteId] = useState<string | null>(null);


  // Inicialização e Autenticação do Firebase
  useEffect(() => {
    setFirebaseDB(db);
    setFirebaseAuth(auth);

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
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

  // Caminhos das coleções no Firestore
  const getPacientesCollectionPath = useCallback(() => {
    if (!userId || !appId) return null;
    return `artifacts/${appId}/users/${userId}/pacientes`;
  }, [appId, userId]);

  const getAgendaEventsCollectionPath = useCallback(() => {
    if (!userId || !appId) return null;
    return `artifacts/${appId}/users/${userId}/agendaEvents`;
  }, [appId, userId]);

  const getTransacoesCollectionPath = useCallback(() => {
    if (!userId || !appId) return null;
    return `artifacts/${appId}/users/${userId}/transacoesFinanceiras`;
  }, [appId, userId]);


  // Carregar Pacientes do Firestore
  useEffect(() => {
    if (!isAuthReady || !firebaseDB || !userId || !appId) return;
    const collectionPath = getPacientesCollectionPath();
    if (!collectionPath) return;

    const q = query(collection(firebaseDB, collectionPath));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pacientesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Paciente));
      setPacientes(pacientesData);
    }, (error) => {
      console.error("Erro ao buscar pacientes: ", error);
    });
    return () => unsubscribe();
  }, [isAuthReady, firebaseDB, userId, appId, getPacientesCollectionPath]);

  // Carregar Eventos da Agenda do Firestore
  useEffect(() => {
    if (!isAuthReady || !firebaseDB || !userId || !appId) return;
    const collectionPath = getAgendaEventsCollectionPath();
    if (!collectionPath) return;

    const q = query(collection(firebaseDB, collectionPath));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as AgendaEvent));
      setAgendaEvents(eventsData);
    }, (error) => {
      console.error("Erro ao buscar eventos da agenda: ", error);
    });
    return () => unsubscribe();
  }, [isAuthReady, firebaseDB, userId, appId, getAgendaEventsCollectionPath]);

  // Carregar Transações Financeiras do Firestore
  useEffect(() => {
    if (!isAuthReady || !firebaseDB || !userId || !appId) return;
    const collectionPath = getTransacoesCollectionPath();
    if (!collectionPath) return;

    const q = query(collection(firebaseDB, collectionPath));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transacoesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as TransacaoFinanceira));
      setTransacoesFinanceiras(transacoesData);
    }, (error) => {
      console.error("Erro ao buscar transações financeiras: ", error);
    });
    return () => unsubscribe();
  }, [isAuthReady, firebaseDB, userId, appId, getTransacoesCollectionPath]);


  // Navegação e UI
  const navigateTo = useCallback((view: AppView) => {
    setCurrentView(view);
    if (window.innerWidth < 768) setIsSidebarOpenMobile(false);
  }, []);

  const toggleSidebarMobile = useCallback(() => setIsSidebarOpenMobile(prev => !prev), []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsSidebarOpenMobile(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Funções CRUD para Pacientes
  const createDefaultOdontogram = (): Tooth[] => JSON.parse(JSON.stringify(INITIAL_TEETH_DATA));

  const handleSavePaciente = useCallback(async (pacienteData: Omit<Paciente, 'id' | 'odontograma' | 'anamnese' | 'exameExtraoral' | 'exameIntraoral'> | Paciente) => {
    if (!firebaseDB) { console.error("Firestore não inicializado."); return; }
    const collectionPath = getPacientesCollectionPath();
    if (!collectionPath) { console.error("Caminho da coleção de pacientes inválido (userId ou appId faltando)."); return; }

    try {
      if ('id' in pacienteData && pacienteData.id) { // Editar
        const pacienteRef = doc(firebaseDB, collectionPath, pacienteData.id);
        // Clonar para não modificar o estado original diretamente e garantir que não há undefined
        const dataToUpdate = { ...pacienteData };
        delete (dataToUpdate as any).id; // Firestore não quer o id dentro do objeto de dados para updateDoc

        // Garantir que campos opcionais sejam null se forem undefined
        if (dataToUpdate.email === undefined) dataToUpdate.email = null;
        if (dataToUpdate.anamnese === undefined) dataToUpdate.anamnese = null;
        if (dataToUpdate.exameExtraoral === undefined) dataToUpdate.exameExtraoral = null;
        if (dataToUpdate.exameIntraoral === undefined) dataToUpdate.exameIntraoral = null;
        
        // Remover explicitamente chaves com valor undefined antes de enviar
        Object.keys(dataToUpdate).forEach(key => {
            if ((dataToUpdate as any)[key] === undefined) {
                (dataToUpdate as any)[key] = null; // Ou delete (dataToUpdate as any)[key]; se preferir não enviar o campo
            }
        });

        await updateDoc(pacienteRef, dataToUpdate);
        console.log("Paciente atualizado com ID: ", pacienteData.id);
      } else { // Novo
        // Construção explícita do objeto para garantir que não há undefined
        const dadosFormulario = pacienteData as Omit<Paciente, 'id' | 'odontograma' | 'anamnese' | 'exameExtraoral' | 'exameIntraoral'>;
        
        const novoPacienteParaFirestore: Omit<Paciente, 'id'> = {
          nome: dadosFormulario.nome,
          endereco: dadosFormulario.endereco,
          telefone: dadosFormulario.telefone,
          cpf: dadosFormulario.cpf,
          dataNascimento: dadosFormulario.dataNascimento,
          odontograma: createDefaultOdontogram(),
          // Campos opcionais explicitamente como null
          email: dadosFormulario.email || null, // Se email for "" ou undefined, será null
          anamnese: null,
          exameExtraoral: null,
          exameIntraoral: null,
        };

        const docRef = await addDoc(collection(firebaseDB, collectionPath), novoPacienteParaFirestore);
        console.log("Paciente adicionado com ID: ", docRef.id);
      }
    } catch (e) {
      console.error("Erro ao salvar paciente: ", e); // Linha 217 original do erro
    }
  }, [firebaseDB, getPacientesCollectionPath]);

  const handleDeletePaciente = useCallback(async (pacienteId: string) => {
    if (!firebaseDB) { console.error("Firestore não inicializado."); return; }
    const collectionPath = getPacientesCollectionPath();
    if (!collectionPath) { console.error("Caminho da coleção de pacientes inválido."); return; }

    try {
      await deleteDoc(doc(firebaseDB, collectionPath, pacienteId));
      console.log("Paciente excluído com ID: ", pacienteId);
    } catch (e) {
      console.error("Erro ao excluir paciente: ", e);
    }
    setIsDeleteConfirmModalOpen(false);
    setPacienteToDeleteId(null);
  }, [firebaseDB, getPacientesCollectionPath]);

  const requestDeletePaciente = (pacienteId: string) => {
    setPacienteToDeleteId(pacienteId);
    setIsDeleteConfirmModalOpen(true);
  };


  const handleSaveAnamnese = useCallback(async (pacienteId: string, anamneseData: AnamneseClinicaData) => {
    if (!firebaseDB) { console.error("Firestore não inicializado."); return; }
    const collectionPath = getPacientesCollectionPath();
    if (!collectionPath) { console.error("Caminho da coleção de pacientes inválido."); return; }
    
    const pacienteRef = doc(firebaseDB, collectionPath, pacienteId);
    try {
      // Garantir que nenhum campo dentro de anamneseData seja undefined
      const cleanAnamneseData = JSON.parse(JSON.stringify(anamneseData, (key, value) => 
        value === undefined ? null : value
      ));
      await updateDoc(pacienteRef, { anamnese: cleanAnamneseData });
      console.log("Anamnese salva para o paciente ID: ", pacienteId);
    } catch (e) {
      console.error("Erro ao salvar anamnese: ", e);
    }
  }, [firebaseDB, getPacientesCollectionPath]);

  const handleSaveExameExtraoral = useCallback(async (pacienteId: string, exameData: ExameExtraoralData) => {
    if (!firebaseDB) return;
    const collectionPath = getPacientesCollectionPath();
    if (!collectionPath) return;
    const pacienteRef = doc(firebaseDB, collectionPath, pacienteId);
    try {
      const cleanExameData = JSON.parse(JSON.stringify(exameData, (key, value) =>
        value === undefined ? null : value
      ));
      await updateDoc(pacienteRef, { exameExtraoral: cleanExameData });
    } catch (e) { console.error("Erro ao salvar exame extraoral: ", e); }
  }, [firebaseDB, getPacientesCollectionPath]);

  const handleSaveExameIntraoral = useCallback(async (pacienteId: string, exameData: ExameIntraoralData) => {
    if (!firebaseDB) return;
    const collectionPath = getPacientesCollectionPath();
    if (!collectionPath) return;
    const pacienteRef = doc(firebaseDB, collectionPath, pacienteId);
    try {
      const cleanExameData = JSON.parse(JSON.stringify(exameData, (key, value) =>
        value === undefined ? null : value
      ));
      await updateDoc(pacienteRef, { exameIntraoral: cleanExameData });
    } catch (e) { console.error("Erro ao salvar exame intraoral: ", e); }
  }, [firebaseDB, getPacientesCollectionPath]);

  const handleUpdatePacienteOdontograma = useCallback(async (pacienteId: string, updatedTeeth: Tooth[]) => {
    if (!firebaseDB) return;
    const collectionPath = getPacientesCollectionPath();
    if (!collectionPath) return;
    const pacienteRef = doc(firebaseDB, collectionPath, pacienteId);
    try {
      const serializableTeeth = JSON.parse(JSON.stringify(updatedTeeth, (key, value) =>
        value === undefined ? null : value
      ));
      await updateDoc(pacienteRef, { odontograma: serializableTeeth });
    } catch (e) { console.error("Erro ao atualizar odontograma: ", e); }
  }, [firebaseDB, getPacientesCollectionPath]);

  // Funções CRUD para Eventos da Agenda
  const handleAddAgendaEvent = useCallback(async (eventData: Omit<AgendaEvent, 'id'>) => {
    if (!firebaseDB) return;
    const collectionPath = getAgendaEventsCollectionPath();
    if (!collectionPath) return;
    try {
      const dataToSave = JSON.parse(JSON.stringify(eventData, (key, value) =>
        value === undefined ? null : value
      ));
      await addDoc(collection(firebaseDB, collectionPath), dataToSave);
    } catch (e) { console.error("Erro ao adicionar evento na agenda: ", e); }
  }, [firebaseDB, getAgendaEventsCollectionPath]);

  const handleUpdateAgendaEvent = useCallback(async (updatedEvent: AgendaEvent) => {
    if (!firebaseDB) return;
    const collectionPath = getAgendaEventsCollectionPath();
    if (!collectionPath) return;
    const eventRef = doc(firebaseDB, collectionPath, updatedEvent.id);
    const { id, ...data } = updatedEvent;
    const dataToUpdate = JSON.parse(JSON.stringify(data, (key, value) =>
        value === undefined ? null : value
    ));
    try {
      await updateDoc(eventRef, dataToUpdate);
    } catch (e) { console.error("Erro ao atualizar evento na agenda: ", e); }
  }, [firebaseDB, getAgendaEventsCollectionPath]);

  // Funções CRUD para Transações Financeiras
  const handleAddTransacaoFinanceira = useCallback(async (transacaoData: Omit<TransacaoFinanceira, 'id'>) => {
    if (!firebaseDB) return;
    const collectionPath = getTransacoesCollectionPath();
    if (!collectionPath) return;
    try {
      const dataToSave = JSON.parse(JSON.stringify(transacaoData, (key, value) =>
        value === undefined ? null : value
      ));
      await addDoc(collection(firebaseDB, collectionPath), dataToSave);
    } catch (e) { console.error("Erro ao adicionar transação financeira: ", e); }
  }, [firebaseDB, getTransacoesCollectionPath]);


  // Renderização do Conteúdo da Página
  let pageContent;
  if (!isAuthReady) {
    pageContent = <div className="flex justify-center items-center h-full"><p className="text-xl">Carregando autenticação...</p></div>;
  } else if (!userId) {
    pageContent = <div className="flex justify-center items-center h-full"><p className="text-xl text-red-500">Falha na autenticação. Por favor, recarregue.</p></div>;
  }
  else {
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
      <Header appName="BM Odonto CRM" onToggleSidebar={toggleSidebarMobile} />
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

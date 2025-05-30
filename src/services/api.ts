import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Interceptor para adicionar headers de autenticação
api.interceptors.request.use((config) => {
  const appId = localStorage.getItem('appId');
  const userId = localStorage.getItem('userId');
  
  if (appId && userId) {
    config.headers['app-id'] = appId;
    config.headers['user-id'] = userId;
  }
  
  return config;
});

// Serviço para o Assistente IA
export const assistantService = {
  async sendMessage(message: string) {
    const response = await api.post('/webhook/whatsapp', {
      from_number: 'system',
      message,
      timestamp: new Date().toISOString()
    });
    return response.data;
  }
};

// Serviço para Pacientes
export const pacientesService = {
  async getAll() {
    const response = await api.get('/pacientes');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/pacientes/${id}`);
    return response.data;
  },

  async create(paciente: any) {
    const response = await api.post('/pacientes', paciente);
    return response.data;
  },

  async update(id: string, paciente: any) {
    const response = await api.put(`/pacientes/${id}`, paciente);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/pacientes/${id}`);
    return response.data;
  },

  async updateProntuario(id: string, tipo: string, dados: any) {
    const response = await api.put(`/pacientes/${id}/prontuario/${tipo}`, dados);
    return response.data;
  }
};

// Serviço para Agenda
export const agendaService = {
  async getAll() {
    const response = await api.get('/agenda');
    return response.data;
  },

  async create(evento: any) {
    const response = await api.post('/agenda', evento);
    return response.data;
  },

  async update(id: string, evento: any) {
    const response = await api.put(`/agenda/${id}`, evento);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/agenda/${id}`);
    return response.data;
  }
};

// Serviço para Financeiro
export const financeiroService = {
  async getAll() {
    const response = await api.get('/financeiro');
    return response.data;
  },

  async create(transacao: any) {
    const response = await api.post('/financeiro', transacao);
    return response.data;
  },

  async getByPaciente(pacienteId: string) {
    const response = await api.get(`/financeiro/paciente/${pacienteId}`);
    return response.data;
  }
};

export default api; 
from typing import List
from .base_agent import BaseAgent
from .tools.firebase_tools import (
    GetPatientTool,
    ScheduleAppointmentTool,
    ProcessPaymentTool,
    UpdatePatientRecordTool
)

SYSTEM_MESSAGE = """Você é um assistente virtual especializado em odontologia, 
ajudando a gerenciar um consultório odontológico. Você pode:

1. Buscar informações de pacientes
2. Agendar consultas
3. Registrar pagamentos
4. Atualizar prontuários
5. Responder dúvidas sobre procedimentos odontológicos

Sempre mantenha um tom profissional e empático. Ao agendar consultas, verifique 
a disponibilidade do horário. Ao registrar pagamentos, confirme os detalhes 
com o paciente. Ao atualizar prontuários, certifique-se de que todas as 
informações necessárias foram coletadas.

Use as ferramentas disponíveis para realizar as tarefas solicitadas."""

class DentalAgent(BaseAgent):
    def __init__(self, app_id: str, user_id: str):
        # Inicializa as ferramentas com o contexto do usuário
        tools = [
            GetPatientTool(),
            ScheduleAppointmentTool(),
            ProcessPaymentTool(),
            UpdatePatientRecordTool()
        ]
        
        # Adiciona o contexto do usuário às ferramentas
        for tool in tools:
            if hasattr(tool, '_run'):
                original_run = tool._run
                def new_run(*args, **kwargs):
                    kwargs['app_id'] = app_id
                    kwargs['user_id'] = user_id
                    return original_run(*args, **kwargs)
                tool._run = new_run
        
        super().__init__(
            tools=tools,
            system_message=SYSTEM_MESSAGE,
            temperature=0.7
        )
    
    async def process_dental_query(self, message: str) -> str:
        """Processa uma consulta odontológica específica"""
        try:
            # Adiciona contexto odontológico à mensagem
            enhanced_message = f"""
            Contexto: Consulta odontológica
            Mensagem do usuário: {message}
            
            Por favor, analise a mensagem e:
            1. Identifique a intenção do usuário
            2. Use as ferramentas apropriadas para atender à solicitação
            3. Forneça uma resposta clara e profissional
            """
            
            return await self.process_message(enhanced_message)
        except Exception as e:
            print(f"Erro ao processar consulta odontológica: {str(e)}")
            return "Desculpe, ocorreu um erro ao processar sua consulta. Por favor, tente novamente." 
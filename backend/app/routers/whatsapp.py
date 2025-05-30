from fastapi import APIRouter, Request, HTTPException, Depends
from typing import Optional
import os
from ..services.ai_agent import AIAgent
from ..services.evolution_api import EvolutionAPI
from ..services.paciente_service import PacienteService
from ..models.whatsapp import WhatsAppMessage, WhatsAppResponse

router = APIRouter(prefix="/whatsapp", tags=["whatsapp"])

# Configurações
SUPERUSER_WHATSAPP_NUMBER = os.getenv("SUPERUSER_WHATSAPP_NUMBER")
EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY")
EVOLUTION_INSTANCE_NAME = os.getenv("EVOLUTION_INSTANCE_NAME")
EVOLUTION_API_URL = os.getenv("EVOLUTION_API_URL")
WEBHOOK_URL = os.getenv("WEBHOOK_URL", "http://192.168.2.52:8000/whatsapp/webhook")  # URL do webhook

# Inicialização dos serviços
evolution_api = EvolutionAPI(
    api_key=EVOLUTION_API_KEY,
    instance_name=EVOLUTION_INSTANCE_NAME,
    base_url=EVOLUTION_API_URL
)
ai_agent = AIAgent()
paciente_service = PacienteService()

async def get_paciente_by_phone(phone: str) -> Optional[dict]:
    """Busca paciente pelo número de telefone"""
    return await paciente_service.get_by_phone(phone)

@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    try:
        # Log para debug
        print(f"Webhook recebido em: {WEBHOOK_URL}")
        
        payload = await request.json()
        print(f"Payload recebido: {payload}")  # Log do payload
        
        # Extrai dados da mensagem
        message = WhatsAppMessage(
            from_number=payload.get("from"),
            message=payload.get("body", ""),
            timestamp=payload.get("timestamp")
        )

        if not message.from_number or not message.message:
            print("Erro: Dados da mensagem incompletos")  # Log de erro
            raise HTTPException(status_code=400, detail="Dados da mensagem incompletos")

        # Verifica se é superuser
        is_superuser = (message.from_number == SUPERUSER_WHATSAPP_NUMBER)
        print(f"É superuser? {is_superuser}")  # Log de superuser
        
        # Busca paciente pelo número (se não for superuser)
        paciente = None
        if not is_superuser:
            paciente = await get_paciente_by_phone(message.from_number)
            print(f"Paciente encontrado: {paciente is not None}")  # Log de paciente

        # Processa a mensagem com o agente de IA
        response = await ai_agent.process_message(
            message=message.message,
            user_phone=message.from_number,
            is_superuser=is_superuser,
            paciente=paciente
        )
        print(f"Resposta gerada: {response}")  # Log da resposta

        # Envia resposta via WhatsApp
        if response:
            await evolution_api.send_message(
                to_number=message.from_number,
                message=response
            )
            print("Resposta enviada com sucesso")  # Log de envio

        return {"status": "success", "message": "Mensagem processada"}

    except Exception as e:
        print(f"Erro no webhook do WhatsApp: {str(e)}")  # Log de erro detalhado
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/send")
async def send_message(message: WhatsAppResponse):
    """Endpoint para enviar mensagens via WhatsApp"""
    try:
        await evolution_api.send_message(
            to_number=message.to_number,
            message=message.message
        )
        return {"status": "success", "message": "Mensagem enviada"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
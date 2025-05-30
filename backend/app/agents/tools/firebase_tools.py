from typing import Optional, List, Dict, Any
from langchain.tools import BaseTool
from firebase_admin import firestore, initialize_app, credentials
from datetime import datetime, timedelta
import json

class FirebaseTool(BaseTool):
    """Classe base para ferramentas que interagem com o Firebase"""
    
    def __init__(self):
        # Inicializa o Firebase Admin SDK
        cred = credentials.Certificate("path/to/serviceAccountKey.json")
        initialize_app(cred)
        self.db = firestore.client()
    
    def _get_collection_path(self, app_id: str, user_id: str, collection: str) -> str:
        """Retorna o caminho da coleção no Firestore"""
        return f"artifacts/{app_id}/users/{user_id}/{collection}"

class GetPatientTool(FirebaseTool):
    name = "get_patient"
    description = "Busca informações de um paciente pelo nome ou ID"
    
    def _run(self, query: str, app_id: str, user_id: str) -> str:
        try:
            collection_path = self._get_collection_path(app_id, user_id, "pacientes")
            patients_ref = self.db.collection(collection_path)
            
            # Tenta buscar por ID primeiro
            doc = patients_ref.document(query).get()
            if doc.exists:
                return json.dumps(doc.to_dict(), ensure_ascii=False)
            
            # Se não encontrou por ID, busca por nome
            query = patients_ref.where("nome", ">=", query).where("nome", "<=", query + "\uf8ff")
            docs = query.limit(5).get()
            
            results = [doc.to_dict() for doc in docs]
            return json.dumps(results, ensure_ascii=False)
        except Exception as e:
            return f"Erro ao buscar paciente: {str(e)}"

class ScheduleAppointmentTool(FirebaseTool):
    name = "schedule_appointment"
    description = "Agenda uma consulta para um paciente"
    
    def _run(self, patient_id: str, date: str, time: str, procedure: str, app_id: str, user_id: str) -> str:
        try:
            collection_path = self._get_collection_path(app_id, user_id, "agendaEvents")
            events_ref = self.db.collection(collection_path)
            
            # Converte a data e hora para datetime
            datetime_str = f"{date} {time}"
            start_time = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M")
            end_time = start_time + timedelta(hours=1)  # Consulta padrão de 1 hora
            
            # Verifica se já existe consulta no horário
            query = events_ref.where("start", ">=", start_time).where("start", "<=", end_time)
            existing = query.get()
            
            if len(existing) > 0:
                return "Já existe uma consulta agendada neste horário"
            
            # Cria o evento
            event_data = {
                "patientId": patient_id,
                "start": start_time,
                "end": end_time,
                "title": f"Consulta: {procedure}",
                "type": "CONSULTA",
                "status": "AGENDADO"
            }
            
            doc_ref = events_ref.add(event_data)
            return f"Consulta agendada com sucesso. ID: {doc_ref[1].id}"
        except Exception as e:
            return f"Erro ao agendar consulta: {str(e)}"

class ProcessPaymentTool(FirebaseTool):
    name = "process_payment"
    description = "Registra um pagamento para um paciente"
    
    def _run(self, patient_id: str, amount: float, method: str, description: str, app_id: str, user_id: str) -> str:
        try:
            collection_path = self._get_collection_path(app_id, user_id, "transacoesFinanceiras")
            transactions_ref = self.db.collection(collection_path)
            
            transaction_data = {
                "patientId": patient_id,
                "valor": amount,
                "tipo": "RECEITA",
                "metodoPagamento": method,
                "descricao": description,
                "data": firestore.SERVER_TIMESTAMP
            }
            
            doc_ref = transactions_ref.add(transaction_data)
            return f"Pagamento registrado com sucesso. ID: {doc_ref[1].id}"
        except Exception as e:
            return f"Erro ao registrar pagamento: {str(e)}"

class UpdatePatientRecordTool(FirebaseTool):
    name = "update_patient_record"
    description = "Atualiza o prontuário de um paciente (anamnese, exames, etc)"
    
    def _run(self, patient_id: str, record_type: str, data: Dict[str, Any], app_id: str, user_id: str) -> str:
        try:
            collection_path = self._get_collection_path(app_id, user_id, "pacientes")
            patient_ref = self.db.collection(collection_path).document(patient_id)
            
            # Atualiza o campo específico do prontuário
            update_data = {record_type: data}
            patient_ref.update(update_data)
            
            return f"Prontuário atualizado com sucesso para o paciente {patient_id}"
        except Exception as e:
            return f"Erro ao atualizar prontuário: {str(e)}" 
# BM Odonto CRM

Sistema de CRM para clínicas odontológicas com integração de IA e WhatsApp.

## Funcionalidades

- Gerenciamento de pacientes
- Agenda de consultas
- Controle financeiro
- Assistente IA para atendimento
- Integração com WhatsApp
- Odontograma digital
- Prontuário eletrônico

## Tecnologias

### Frontend
- React
- TypeScript
- Tailwind CSS
- Firebase
- Vite

### Backend
- Python
- FastAPI
- OpenAI
- Evolution API (WhatsApp)

## Requisitos

- Node.js 18+
- Python 3.10+
- Firebase CLI
- Conta na Evolution API

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/bm-odonto-crm.git
cd bm-odonto-crm
```

2. Instale as dependências do frontend:
```bash
npm install
```

3. Instale as dependências do backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

4. Configure as variáveis de ambiente:
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=sua_chave_api
VITE_FIREBASE_AUTH_DOMAIN=seu_dominio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id
VITE_OPENAI_API_KEY=sua_chave_openai
VITE_EVOLUTION_API_KEY=sua_chave_evolution
VITE_EVOLUTION_INSTANCE_NAME=bm-odonto
VITE_EVOLUTION_API_URL=http://localhost:8080

# Backend (.env)
OPENAI_API_KEY=sua_chave_openai
EVOLUTION_API_KEY=sua_chave_evolution
EVOLUTION_INSTANCE_NAME=bm-odonto
EVOLUTION_API_URL=http://localhost:8080
```

5. Inicie o servidor de desenvolvimento:
```bash
# Frontend
npm run dev

# Backend
cd backend
uvicorn app.main:app --reload
```

## Uso

1. Acesse o frontend em `http://localhost:3000`
2. Faça login com suas credenciais do Firebase
3. Configure a instância do WhatsApp na Evolution API
4. Comece a usar o sistema!

## Estrutura do Projeto

```
bm-odonto-crm/
├── src/                    # Frontend
│   ├── components/        # Componentes React
│   │   ├── components/        # Componentes React
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── services/         # Serviços e APIs
│   │   ├── types/            # Tipos TypeScript
│   │   └── utils/            # Utilitários
│   ├── backend/               # Backend
│   │   ├── app/              # Aplicação FastAPI
│   │   │   ├── agents/       # Agentes de IA
│   │   │   ├── integrations/ # Integrações
│   │   │   └── models/       # Modelos de dados
│   │   └── tests/            # Testes
│   └── docs/                 # Documentação
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Suporte

Para suporte, envie um email para seu-email@exemplo.com ou abra uma issue no GitHub.

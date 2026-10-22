# Configuração do chatbot

1. Crie .env na raiz com OPENROUTER_API_KEY. Não publique a chave nem use prefixo VITE_ para ela.
2. Execute npm run dev:all. O site usa a porta 3000 e o Express usa 3001.
3. Na Vercel, configure OPENROUTER_API_KEY no projeto. A função api/chat.js usa o serviço compartilhado em server/services/chat.
4. Para backend externo ou domínio personalizado, defina VITE_CHAT_API_URL em .env.local com a URL completa do endpoint antes do build. Configure FRONTEND_URL no Express para permitir a origem pelo CORS.
5. SITE_URL é opcional e define a URL de referência enviada ao provedor. O modelo e prazo limite ficam em server/config/env.js.

Os fatos do prompt vêm de shared/portfolio/content.json e das traduções em src/locales. As instruções ficam em server/services/chat/prompt.js. O histórico visível não é enviado ao modelo: cada chamada contém a pergunta atual e o contexto estático do portfólio.

Teste sem consumir a API com npm run test:run e npm run test:server. O limitador em memória é por instância; veja [as limitações de produção](docs/architecture.md).

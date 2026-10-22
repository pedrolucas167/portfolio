# Publicação

## Vercel

O repositório contém vercel.json com npm ci, npm run build e saída dist. Configure OPENROUTER_API_KEY no ambiente do projeto para o chatbot. A função serverless chama o mesmo serviço usado pelo Express. A publicação em uma conta não foi executada nem validada nesta reorganização.

## GitHub Pages

O frontend é estático. Execute npm run deploy em um shell POSIX, ou use o equivalente PowerShell documentado no [README](README.md). O script exige origin/gh-pages existente e permissão para enviar commits. Não há workflow de publicação automática versionado neste repositório.

GitHub Pages não executa as APIs. Para o chatbot, configure VITE_CHAT_API_URL apontando para um backend externo antes do build. O formulário usa Formspree.

## Express em produção

Gere dist com npm run build. Defina NODE_ENV=production e execute node server/index.js. app.js configura o servidor sem abrir porta; index.js carrega .env e inicia a aplicação. A rota de fallback usa a sintaxe compatível com Express 5. SMTP é opcional e requer ENABLE_SMTP_CONTACT=true.

Consulte o [README](README.md) para comandos e [a arquitetura](docs/architecture.md) para configuração e limites do chat.

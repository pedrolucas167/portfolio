# Portfólio — Pedro Marques

Portfólio profissional desenvolvido com React, TypeScript e Vite. Reúne apresentação, trajetória, tecnologias, projetos, artigos do Medium, um jogo em Canvas 2D e canais de contato, com conteúdo em cinco idiomas.

## Funcionalidades

- Layout responsivo, animações de entrada e componentes visuais reutilizáveis.
- Português, inglês, espanhol, alemão e chinês, com detecção de idioma e preferência salva no navegador.
- Seções de apresentação, sobre, tecnologias, projetos, artigos e contato.
- Artigos do Medium via RSS2JSON, com conteúdo local como alternativa.
- Jogo de arcade em Canvas 2D, carregado sob demanda.
- Chatbot sobre o perfil profissional, integrado ao OpenRouter.
- Formulário de contato com validação e envio pelo Formspree.
- Metadados de SEO traduzidos com React Helmet Async.

## Tecnologias

| Área | Tecnologias |
| --- | --- |
| Interface | React 19, TypeScript, Tailwind CSS 4, React Icons |
| Desenvolvimento e build | Vite 6, PostCSS |
| Internacionalização | i18next, react-i18next |
| Jogo | Canvas 2D e requestAnimationFrame |
| Backend | Node.js, Express 5, Nodemailer |
| Integrações | OpenRouter, Formspree, Medium via RSS2JSON |
| Testes | Vitest, Testing Library, jsdom |
| Publicação | Vercel e GitHub Pages |

## Executar localmente

Use Node.js 24 e npm (ambiente usado na validação). Execute os comandos a partir da raiz do projeto.

```bash
npm ci
npm run dev
```

O frontend fica disponível em [localhost:3000](http://localhost:3000). Para executar também o backend do chatbot, configure as variáveis abaixo e use:

```bash
npm run dev:all
```

O Express usa a porta `3001` por padrão. Em desenvolvimento, o chatbot acessa diretamente `http://localhost:3001/api/chat`; se alterar a porta do backend, defina `VITE_CHAT_API_URL` em `.env.local` com a URL completa do endpoint.

### Variáveis de ambiente

Para o servidor local, crie um arquivo `.env` na raiz. Apenas a inicialização do servidor carrega esse arquivo; os módulos de integração não carregam arquivos de ambiente ao serem importados. Na Vercel, use as variáveis de ambiente do projeto.

```dotenv
OPENROUTER_API_KEY=sua_chave_openrouter
PORT=3001
FRONTEND_URL=http://localhost:3000

# Opcional: habilite a API de contato legada por SMTP
ENABLE_SMTP_CONTACT=false
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=seu_email
EMAIL_PASS=sua_senha_smtp
EMAIL_TO=email_destinatario
```

`OPENROUTER_API_KEY` habilita as respostas do chatbot. As variáveis `EMAIL_*` são usadas pela API de contato do Express. O formulário exibido no site envia diretamente ao Formspree e não depende dessa API. A API SMTP e sua verificação na inicialização só são ativadas com `ENABLE_SMTP_CONTACT=true`. O fluxo oficial da interface é o Formspree.

Para configurar o caminho público do frontend, defina `VITE_BASE_PATH` em `.env.local`: use `/` na raiz de um domínio ou `/portfolio/` no GitHub Pages deste repositório. Essa variável é aplicada durante o build. Mantenha chaves e senhas apenas no backend, sem o prefixo `VITE_`, e fora do controle de versão.

## Comandos

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o frontend com Vite na porta 3000 |
| `npm run dev:server` | Inicia o servidor Express |
| `npm run dev:all` | Executa frontend e backend em paralelo |
| `npm run type-check` | Verifica os tipos TypeScript |
| `npm run build` | Verifica os tipos e gera o frontend em `dist/` |
| `npm run preview` | Serve o build localmente na porta 4173 |
| `npm test` | Executa os testes em modo de acompanhamento |
| `npm run test:run` | Executa os testes uma vez |
| `npm run test:server` | Verifica validação, falhas e integração do chatbot com respostas simuladas |
| `npm run test:coverage` | Gera relatórios de cobertura em `coverage/` |
| `npm run deploy` | Gera o build para `/portfolio/` e publica em `origin/gh-pages` |

O script `deploy` usa sintaxe de variável de ambiente de shells POSIX. No PowerShell, o equivalente é:

```powershell
$env:VITE_BASE_PATH = '/portfolio/'
npm run build
if ($LASTEXITCODE -eq 0) { node scripts/deploy.mjs }
Remove-Item Env:VITE_BASE_PATH
```

A publicação requer acesso de escrita ao remoto e uma branch `origin/gh-pages` existente. O script cria um worktree temporário, copia o build, faz commit quando há alterações e envia a branch ao remoto.

## Estrutura

```text
portfolio/
├── api/chat.js              # Adaptador HTTP da Vercel
├── shared/portfolio/        # Dados usados pelo site e pelo prompt da IA
├── server/
│   ├── config/              # Configuração de ambiente e SMTP opcional
│   ├── integrations/        # Cliente do OpenRouter
│   ├── services/chat/       # Validação e construção do prompt
│   ├── controllers/         # Adaptação HTTP do Express
│   ├── routes/
│   ├── middleware/
│   ├── app.js               # Montagem do Express, sem abrir porta
│   └── index.js             # Ambiente e inicialização
├── src/
│   ├── app/                 # Composição da página e idiomas
│   ├── features/
│   │   ├── chat/            # Interface, conversa, voz e cliente HTTP
│   │   ├── contact/         # Formulário e integração Formspree
│   │   ├── articles/        # Interface e feed do Medium
│   │   └── game/            # Interface, estado, loop, desenho e timers
│   ├── components/          # UI, layout e seções de apresentação
│   ├── content/             # Adaptação visual dos dados e currículo
│   ├── data/                # Reexportação para compatibilidade
│   ├── hooks/               # Hooks compartilhados
│   ├── locales/
│   ├── styles/
│   ├── test/
│   └── main.tsx
├── docs/architecture.md
├── public/
└── scripts/deploy.mjs
```

Os arquivos de entrada antigos de chat, contato, artigos e jogo em `components/sections/` reexportam as implementações em `features/`. Os componentes `Reading` e `BugHunterGame` permanecem fora da página atual.

Veja [as decisões de arquitetura e os limites entre módulos](docs/architecture.md).

## Personalização

- **Perfil, projetos e artigos:** `shared/portfolio/content.json`; ícones e links visuais em `src/content/index.ts`.
- **Textos traduzidos:** `src/locales/<idioma>/translation.json`.
- **Aparência:** `src/styles/main.css` e componentes em `src/components/`.
- **Instruções do chatbot:** `server/services/chat/prompt.js`.
- **Destino do formulário:** endpoint do Formspree em `src/features/contact/api/contactClient.ts`.
- **Currículo:** arquivo em `public/resume/`, com URL compartilhada em `src/content/resume.ts`.

## Publicação

### Vercel

O arquivo `vercel.json` configura a instalação com `npm ci`, o build com `npm run build` e a saída em `dist/`, com caminho público `/`.

Configure `OPENROUTER_API_KEY` nas variáveis de ambiente do projeto na Vercel para habilitar `api/chat.js`. A variável opcional `SITE_URL` define a URL de referência enviada ao OpenRouter. A função usa o mesmo serviço de conversa do Express, em `server/services/chat/`.

### GitHub Pages

O script de publicação envia os arquivos estáticos de `dist/` para `gh-pages`. O GitHub Pages não executa o Express nem a função `api/chat.js`. Como o chatbot usa `/api/chat` em produção, defina `VITE_CHAT_API_URL` antes do build para usar um backend separado e habilitar o chatbot nessa hospedagem. O formulário depende do endpoint configurado no Formspree.

## Licença

O `package.json` declara a licença MIT.

# Portfólio — Pedro Marques

Portfólio profissional desenvolvido com React, TypeScript e Vite. Reúne apresentação, trajetória, tecnologias, projetos, artigos do Medium, uma experiência interativa em 3D e canais de contato, com conteúdo em cinco idiomas.

## Funcionalidades

- Layout responsivo, animações de entrada e componentes visuais reutilizáveis.
- Português, inglês, espanhol, alemão e chinês, com detecção de idioma e preferência salva no navegador.
- Seções de apresentação, sobre, tecnologias, projetos, artigos e contato.
- Artigos do Medium via RSS2JSON, com conteúdo local como alternativa.
- Experiência 3D com Three.js, carregada sob demanda.
- Chatbot sobre o perfil profissional, integrado ao OpenRouter.
- Formulário de contato com validação e envio pelo Formspree.
- Metadados de SEO traduzidos com React Helmet Async.

## Tecnologias

| Área | Tecnologias |
| --- | --- |
| Interface | React 19, TypeScript, Tailwind CSS 4, React Icons |
| Desenvolvimento e build | Vite 6, PostCSS |
| Internacionalização | i18next, react-i18next |
| Gráficos 3D | Three.js, React Three Fiber, Drei |
| Backend | Node.js, Express 5, Nodemailer |
| Integrações | OpenRouter, Formspree, Medium via RSS2JSON |
| Testes | Vitest, Testing Library, jsdom |
| Publicação | Vercel e GitHub Pages |

## Executar localmente

Use Node.js 22 ou superior e npm. Execute os comandos a partir da raiz do projeto.

```bash
npm ci
npm run dev
```

O frontend fica disponível em [localhost:3000](http://localhost:3000). Para executar também o backend do chatbot, configure as variáveis abaixo e use:

```bash
npm run dev:all
```

O Express usa a porta `3001` por padrão. Em desenvolvimento, o chatbot acessa diretamente `http://localhost:3001/api/chat`; se alterar a porta do backend, ajuste também o endereço em `src/components/sections/Chatbot.tsx`.

### Variáveis de ambiente

Para o servidor local, crie um arquivo `.env` na raiz. O módulo do chatbot também tenta carregar `server/.env`; manter as configurações na raiz centraliza o carregamento feito pelo servidor.

```dotenv
OPENROUTER_API_KEY=sua_chave_openrouter
PORT=3001
FRONTEND_URL=http://localhost:3000

# Configuração da API de contato por SMTP
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=seu_email
EMAIL_PASS=sua_senha_smtp
EMAIL_TO=email_destinatario
```

`OPENROUTER_API_KEY` habilita as respostas do chatbot. As variáveis `EMAIL_*` são usadas pela API de contato do Express. O formulário exibido no site envia diretamente ao Formspree e não depende dessa API. O servidor verifica a conexão SMTP ao iniciar e registra uma falha se as credenciais não estiverem configuradas.

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
├── api/
│   └── chat.js              # Função do chatbot para a Vercel
├── public/                  # Imagens, vídeos, currículo e arquivos estáticos
├── scripts/
│   └── deploy.mjs           # Publicação na branch gh-pages
├── server/
│   ├── config/              # Integrações SMTP e OpenRouter
│   ├── controllers/         # Lógica das APIs de chat e contato
│   ├── middleware/          # Limitação de requisições
│   ├── models/              # Modelo de contato
│   ├── routes/              # Rotas Express
│   └── index.js             # Entrada do servidor local
├── src/
│   ├── components/
│   │   ├── layout/          # Layout, cabeçalho e rodapé
│   │   ├── sections/        # Seções, chatbot e jogos
│   │   └── ui/              # Componentes reutilizáveis
│   ├── data/                # Dados de projetos, artigos e links
│   ├── hooks/               # Animações, rolagem e integração com Medium
│   ├── locales/             # Traduções por idioma
│   ├── styles/              # Estilos globais
│   ├── test/                # Configuração e utilitários de testes
│   ├── types/               # Declarações de tipos
│   ├── utils/               # Funções auxiliares
│   ├── App.tsx              # Composição da página
│   ├── i18n.ts              # Configuração dos idiomas
│   └── main.tsx             # Entrada do frontend
├── index.html
├── package.json
├── vercel.json
├── vite.config.ts
└── vitest.config.ts
```

Os arquivos `Reading.tsx` e `BugHunterGame.tsx` também existem em `sections/`, mas não são renderizados na composição atual de `App.tsx`.

## Personalização

- **Perfil, projetos e links:** `src/data/index.ts`.
- **Textos traduzidos:** `src/locales/<idioma>/translation.json`.
- **Aparência:** `src/styles/main.css` e componentes em `src/components/`.
- **Instruções do chatbot:** `server/controllers/ChatController.js`.
- **Destino do formulário:** endpoint do Formspree em `src/components/sections/Contact.tsx`.
- **Currículo:** arquivo em `public/resume/` e links em `Hero.tsx` e `Chatbot.tsx`. Confira se o nome do PDF corresponde ao caminho usado nesses componentes.

## Publicação

### Vercel

O arquivo `vercel.json` configura a instalação com `npm ci`, o build com `npm run build` e a saída em `dist/`, com caminho público `/`.

Configure `OPENROUTER_API_KEY` nas variáveis de ambiente do projeto na Vercel para habilitar `api/chat.js`. A variável opcional `SITE_URL` define a URL de referência enviada ao OpenRouter. A função compartilha a construção do prompt com `server/controllers/ChatController.js`.

### GitHub Pages

O script de publicação envia os arquivos estáticos de `dist/` para `gh-pages`. O GitHub Pages não executa o Express nem a função `api/chat.js`. Como o chatbot usa `/api/chat` em produção, ele precisa de um backend separado e de um ajuste no endereço da API para funcionar nessa hospedagem. O formulário depende do endpoint configurado no Formspree.

## Licença

O `package.json` declara a licença MIT.

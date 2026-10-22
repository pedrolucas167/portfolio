# Arquitetura

O portfólio mantém um frontend e dois adaptadores HTTP para a mesma lógica de conversa: Express e Vercel. A organização por funcionalidade permite alterar chat, contato, artigos e jogo de forma independente.

## Limites

- **app:** composição da página e configuração de idiomas. O detector i18next persiste a preferência; a aplicação sincroniza o idioma do HTML.
- **features:** cada funcionalidade contém sua interface, seus hooks e seus clientes HTTP. Componentes visuais não conhecem credenciais nem detalhes do provedor de IA.
- **components/ui e layout:** apresentação compartilhada. Hooks genéricos ficam em hooks; hooks específicos ficam com a funcionalidade.
- **shared/portfolio:** fatos e chaves de tradução sem imports de React, usados pelo site e pela IA. content adiciona ícones e detalhes de apresentação no frontend.
- **services/chat:** valida entrada, normaliza idioma, gera o prompt e coordena o provedor. Não recebe objetos de requisição ou resposta HTTP. O provedor pode ser injetado em testes.
- **integrations/openrouter:** chamada ao provedor, autenticação, prazo limite e validação da resposta. Configuração é lida na chamada, sem carregar dotenv durante importação.
- **controllers e api:** status HTTP, cabeçalhos e adaptação para o serviço. app monta o Express; index carrega o ambiente e abre a porta.

## Fluxo do chat

Interface → hook de conversa → cliente HTTP → Express ou Vercel → serviço de conversa → OpenRouter.

O hook de voz é independente da rede. Callbacks antigos são desconectados na limpeza. Pedidos de microfone pendentes não iniciam gravação depois de fechar o chat. A conversa permite uma requisição pendente e cancela-a ao desmontar.

## Dados e idiomas

O JSON compartilhado é a fonte para perfil, tecnologias, projetos e artigos estáticos. As descrições traduzidas continuam em locales e são lidas também pelo construtor do prompt. Atualizações dinâmicas do feed do Medium são exclusivas da interface; a IA conhece o catálogo estático compartilhado. Os dados compartilhados são públicos e entram no bundle do navegador.

## Jogo

Game contém a interface; useGameEngine controla estado e ações; model contém tipos e configurações; useGameLoop controla simulação e quadros; render desenha cenário e HUD. useGameTimers cancela efeitos na desmontagem e em uma nova partida, e renova a expiração de power-ups repetidos. O jogo usa Canvas 2D, sem dependências de Three.js.

## Contato

O fluxo oficial é Formspree, encapsulado no cliente da funcionalidade. A API SMTP anterior permanece disponível apenas com ENABLE_SMTP_CONTACT=true. Ela não é chamada pela interface. Isso preserva a opção existente sem exigir credenciais SMTP para iniciar o chatbot.

## Limites operacionais

O limitador usado nos adaptadores do chat é limitado em memória e expira entradas sem um intervalo global. Ele conta requisições por endereço visível ao processo e não confia em cabeçalhos arbitrários de proxy. Na Vercel ou com múltiplas instâncias, esse limite é por instância; atrás de proxy, usuários podem compartilhar o mesmo endereço. Um limite global por usuário exige armazenamento compartilhado e identificação de cliente validada pela hospedagem. Não há configuração de serviço externo implícita nesta mudança.

O serviço não mantém histórico de conversa no servidor. O navegador apresenta as mensagens, mas a IA recebe a pergunta atual e os fatos do portfólio. O prompt orienta respostas factuais, sem garantir que o modelo nunca erre.

## Compatibilidade e evolução

As entradas antigas de seções, dados e i18n reexportam as implementações novas para preservar imports existentes. Novas funcionalidades devem importar dos módulos próprios. Os arquivos de compatibilidade podem ser removidos em uma mudança dedicada quando não houver consumidores.

## Verificação

Execute npm run build, npm run test:run e npm run test:server. Os testes de IA usam respostas simuladas e não consomem a API externa. Os testes de backend incluem uma conexão HTTP em localhost e precisam de um build existente para conferir a rota de fallback de produção.

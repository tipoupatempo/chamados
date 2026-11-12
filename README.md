# Central de Chamados — Poupatempo da Saúde

Telas do sistema de chamados de **TI** e **Manutenção** do Poupatempo da Saúde, publicadas no GitHub Pages:

**https://tipoupatempo.github.io/chamados/**

O site é só a parte visual. Os dados ficam em duas planilhas Google (uma por equipe), acessadas por um Google Apps Script publicado como App da Web. O código desse script está no repositório privado [`chamados-apps-script`](https://github.com/tipoupatempo/chamados-apps-script).

## Telas

| Arquivo | Endereço | Quem usa | O que faz |
| --- | --- | --- | --- |
| `index.html` | `/chamados/` | Todos | Página inicial: escolher a equipe, acompanhar um chamado ou entrar no painel. |
| `abrir.html` | `abrir.html?equipe=ti` · `?equipe=manutencao` | Qualquer funcionário, sem login | Formulário para abrir chamado. Devolve um número de protocolo. |
| `consulta.html` | `consulta.html?equipe=ti&protocolo=TI-2026-0001` | Quem abriu o chamado | Acompanha o andamento pelo protocolo. |
| `painel.html` | `painel.html?equipe=ti` · `?equipe=manutencao` | Técnicos, com usuário e senha | Fila de chamados, atendimento e dashboard. |
| `config.js` | — | — | Endereço do App da Web de cada equipe. |

Sem `?equipe=` (ou com um valor que não existe), as telas voltam para `index.html`.

### Abrir chamado
- Categoria (o "problema"), setor/local com sugestões, nome, telefone/ramal, e-mail (opcional) e descrição.
- Painel travado e Totem travado (TI) pedem também o número/local do equipamento.
- Anexo opcional: foto ou PDF de até 5 MB. Fotos são reduzidas no navegador antes do envio.
- Nome, setor, telefone e e-mail ficam lembrados no navegador para o próximo chamado.
- O assunto é montado automaticamente (categoria + começo da descrição) e todo chamado entra com prioridade **Média**; a equipe ajusta no painel.
- Campo-armadilha escondido contra robôs.

### Acompanhar chamado
Mostra status, responsável, solução e as mensagens marcadas como visíveis ao solicitante. Não mostra nome, telefone nem e-mail de quem abriu, porque qualquer pessoa com o protocolo consegue abrir esta tela.

### Painel dos técnicos
- **Login** com usuário e senha cadastrados na planilha. Na primeira entrada (senha provisória) o técnico é obrigado a criar a própria senha. A sessão dura até 6 horas e fica só na aba do navegador (`sessionStorage`).
- **Aba Chamados:** indicadores clicáveis, filtros por status (padrão "Em aberto"), prioridade ("Alta e urgente"), responsável ("Meus chamados", "Sem responsável") e busca livre. Chamados concluídos ou cancelados aparecem por 30 dias.
- **Detalhe do chamado:** alterar status, prioridade e responsável, registrar solução, escrever nota interna ou mensagem ao solicitante, ver o histórico completo e o anexo. Para concluir é obrigatório descrever a solução.
- **Atualização automática** a cada 60 segundos e **notificações do navegador** para chamados novos (urgentes destacados).
- **Aba Dashboard:** período (7 dias, 30 dias, este mês, mês passado, este ano, tudo ou datas escolhidas) com indicadores (recebidos, concluídos, em aberto, tempo médio de solução) e gráficos de evolução, por tipo de problema, setor, equipamento, técnico, situação atual e prioridade.

### Recursos comuns
- Tema claro/escuro (botão no topo), lembrado no navegador e compartilhado com o sistema de requisições.
- Os dados de cada tela (categorias, setores) ficam guardados no navegador para abrir mais rápido e são conferidos com o servidor em segundo plano.
- Funciona no celular.

## Como as telas falam com o Google

Cada chamada é um `POST` para o endereço `/exec` da equipe, com corpo JSON em `text/plain` (evita o preflight de CORS) e sem cookies:

```json
{ "acao": "abrirChamado", "args": [ { "categoria": "Impressora", "...": "..." } ] }
```

Resposta: `{ "ok": true, "dados": ... }` ou `{ "ok": false, "erro": "mensagem" }`.

| Ação | Argumentos | Usada em |
| --- | --- | --- |
| `dadosTela` | `pagina` (`abrir`, `consulta`, `painel`) | todas |
| `abrirChamado` | dados do formulário | abrir |
| `consultarChamado` | `protocolo` | consulta |
| `entrar` / `sair` | `usuario, senha` / `token` | painel |
| `trocarSenha` | `token, atual, nova` | painel |
| `listarChamados` | `token` | painel |
| `detalharChamado` | `token, protocolo` | painel |
| `atualizarChamado` | `token, protocolo, { status, responsavel, prioridade, solucao, mensagem, publico }` | painel |
| `relatorioChamados` | `token` | dashboard |

Os erros `SESSAO_EXPIRADA` e `TROCAR_SENHA` levam o painel de volta ao login ou à troca de senha.

## Configuração (`config.js`)

```js
const CHAMADOS = {
  equipes: {
    ti:         { nome: 'TI',         descricao: '...', api: 'https://script.google.com/macros/s/.../exec' },
    manutencao: { nome: 'Manutenção', descricao: '...', api: 'https://script.google.com/macros/s/.../exec' }
  }
};
```

- A chave (`ti`, `manutencao`) é o valor de `?equipe=` nos links.
- `api` é a URL do App da Web da planilha da equipe. Ela não muda ao publicar uma nova versão por **Implantar → Gerenciar implantações**; só muda se for criada uma implantação nova.
- `descricao` aparece no cartão da página inicial.

## Como atualizar o site

As páginas `abrir.html`, `consulta.html` e `painel.html` são geradas a partir das telas do repositório `chamados-apps-script` pelo script `gerar-intranet.ps1` (que junta `Estilos.html` e o carregador de dados). Para alterar:

1. Edite as telas em `chamados-apps-script`.
2. Rode `powershell -ExecutionPolicy Bypass -File gerar-intranet.ps1` lá. O resultado sai na pasta `intranet/`.
3. Copie os arquivos gerados para este repositório e faça o commit na branch `main`. O GitHub Pages publica em cerca de 1 minuto.

Alterações só de texto ou estilo podem ser feitas direto aqui, mas precisam ser repetidas nas telas de origem para não se perderem na próxima geração.

## Testar localmente

Não há build. Basta servir a pasta:

```bash
python -m http.server 8000
```

e abrir `http://localhost:8000/`. As telas usam os scripts reais configurados em `config.js`, então chamados abertos em teste entram na planilha de verdade; apague-os depois.

## Links antigos

Os endereços antigos do Google (`.../exec`, `.../exec?p=consulta`, `.../exec?p=painel`) continuam funcionando: o script redireciona para a tela equivalente deste site. Por isso os e-mails já enviados, favoritos e QR Codes antigos não quebram.

## Repositórios relacionados

- [`chamados-apps-script`](https://github.com/tipoupatempo/chamados-apps-script) — código do Google (planilha, API, e-mails) e telas de origem.
- [`requisicoes`](https://github.com/tipoupatempo/requisicoes) — sistema de requisições, com o mesmo modelo de telas no GitHub Pages.

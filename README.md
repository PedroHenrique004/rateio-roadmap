# Do Swift ao KMP · roadmap do Rateio

Página web estática com o roadmap de estudos para construir o app **Rateio** em Kotlin Multiplatform, Jetpack Compose e SwiftUI. Cada módulo segue o **Challenge Based Learning (CBL)**:

1. **Engajar:** ideia central, pergunta essencial e desafio.
2. **Investigar:** perguntas-guia (com campo de resposta) e o que estudar, com links e, quando serve, uma ponte Swift → Kotlin.
3. **Agir:** desafio com passos, critérios de "pronto", extra e reflexão.

São 13 módulos em 4 fases, ligados às versões do app (v1.0, v1.1, v1.2, v2). Veja o documento `08-versoes.md` do repositório do Rateio.

Site publicado: <https://pedrohenrique004.github.io/rateio-roadmap/>

## Como abrir no seu computador

Não precisa instalar nada. Na pasta do projeto:

```bash
python3 -m http.server 4173
```

e abra <http://localhost:4173>.

## O que tem

- **Progresso:** objetivos, passos, critérios e desafio concluído, com um anel de progresso na home.
- **Perguntas e respostas** na fase Investigar: você responde cada pergunta-guia com as suas palavras e registra as suas próprias dúvidas.
- **Salvar na nuvem (opcional):** entre com e-mail e senha e o progresso, as respostas e as suas perguntas ficam num banco de dados (Supabase) e aparecem em qualquer computador. Sem login, tudo continua salvo só neste navegador.
- **Backup em arquivo:** exporte tudo em JSON e importe de volta, com ou sem conta.
- **Copiar módulo em Markdown:** copia o módulo com as suas respostas, pronto para colar em qualquer editor (Notion, Obsidian, bloco de notas).
- Tema claro e escuro, com cores suaves para leitura longa (texto principal acima de 10:1 de contraste, nada de branco puro sobre preto).

## Salvar na nuvem: como funciona

O navegador sempre salva localmente primeiro. Quando há login, ele também envia para a tabela `roadmap_progress` (uma linha por pessoa, com o progresso inteiro em JSON).

- **Conflito:** se este computador e a nuvem têm progresso diferente, o site pergunta o que fazer: **juntar** (mantém as marcações dos dois e guarda as duas respostas quando forem diferentes), **usar a nuvem** ou **usar este computador**.
- **Privacidade:** as regras de acesso do banco (RLS) deixam cada pessoa ler e alterar só a própria linha. Visitantes sem login não têm acesso nenhum.
- **A chave no `config.js` é a "anon"**, que é pública por desenho. **Nunca coloque a chave `service_role`** em nenhum arquivo do site.

### Configurar o seu próprio projeto Supabase

1. Crie um projeto em <https://supabase.com> (o plano gratuito basta).
2. Em **SQL Editor**, cole todo o conteúdo de `supabase/schema.sql` e rode uma vez.
3. Em **Authentication → URL Configuration**, ponha em **Site URL** o endereço onde o site fica publicado (para este projeto: `https://pedrohenrique004.github.io/rateio-roadmap/`). Para testar em casa, acrescente `http://localhost:4173` em **Redirect URLs**.
4. Em **Authentication → Providers → Email**, deixe "Confirm email" ligado (você confirma pelo link do e-mail) ou desligue para entrar direto. O envio de e-mails do plano gratuito tem um limite baixo por hora: se aparecer erro de limite, espere um pouco.
5. Em **Project Settings → API**, copie a **Project URL** e a chave **anon / publishable** para o `config.js`:

```js
window.ROADMAP_CONFIG = {
  url: 'https://SEU-PROJETO.supabase.co',
  anonKey: 'SUA-CHAVE-ANON',
};
```

Enquanto o `config.js` estiver com `url` e `anonKey` vazios, a nuvem fica desligada e o site funciona só com o salvamento local e o backup em arquivo.

## Arquivos

| Arquivo | Para que serve |
| --- | --- |
| `index.html`, `styles.css` | Página e visual |
| `data.js` | Todo o conteúdo: fases, módulos e links |
| `app.js` | Telas, progresso, perguntas e respostas, backup |
| `sync.js` | Login e sincronização, mais as regras de decisão e junção (testadas em Node) |
| `config.js` | Endereço e chave anon do Supabase |
| `supabase/schema.sql` | Tabela e regras de acesso do banco |
| `test/sync.test.js` | Testes das regras de sincronização |

## Testes

```bash
node test/sync.test.js
```

Os testes cobrem as regras puras (quando enviar, baixar ou resolver conflito, e como juntar dois estados). O login e a gravação no banco precisam ser testados no navegador, com um projeto Supabase de verdade.

## Editar o conteúdo

Tudo está em `data.js`. Cada módulo tem `engage`, `objectives`, `guiding`, `study`, `challenge` e, opcionalmente, `bridge` (tabela Swift → Kotlin). Os links ficam em `links` e são referenciados pela chave.

> Itens marcados com **[confirmar]** dependem de versão de ferramenta. Confira na documentação oficial antes de seguir.

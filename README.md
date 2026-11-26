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
- Botão **Backup**: exporta e importa o progresso em um arquivo JSON, para levar a outro computador.
- **Copiar módulo em Markdown:** copia o módulo com as suas respostas, pronto para colar em qualquer editor (Notion, Obsidian, bloco de notas).
- Tema claro e escuro, com cores suaves para leitura longa (texto principal acima de 10:1 de contraste, nada de branco puro sobre preto).

## Arquivos

| Arquivo | Para que serve |
| --- | --- |
| `index.html`, `styles.css` | Página e visual |
| `data.js` | Todo o conteúdo: fases, módulos e links |
| `app.js` | Telas, progresso, perguntas e respostas, backup |

## Editar o conteúdo

Tudo está em `data.js`. Cada módulo tem `engage`, `objectives`, `guiding`, `study`, `challenge` e, opcionalmente, `bridge` (tabela Swift → Kotlin). Os links ficam em `links` e são referenciados pela chave.

> Itens marcados com **[confirmar]** dependem de versão de ferramenta. Confira na documentação oficial antes de seguir.

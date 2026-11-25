# Do Swift ao KMP · roadmap do Rateio

Página web estática com o roadmap de estudos para construir o app **Rateio** em Kotlin Multiplatform, Jetpack Compose e SwiftUI. Cada módulo segue o **Challenge Based Learning (CBL)**:

1. **Engajar:** ideia central, pergunta essencial e desafio.
2. **Investigar:** perguntas-guia e o que estudar (com links e, quando serve, uma ponte Swift → Kotlin).
3. **Agir:** desafio com passos, critérios de "pronto", extra e reflexão.

São 13 módulos em 4 fases, ligados às versões do app (v1.0, v1.1, v1.2, v2). Veja o documento `08-versoes.md` do repositório do Rateio.

## Como abrir

Não precisa instalar nada. Na pasta do projeto:

```bash
python3 -m http.server 4173
```

e abra <http://localhost:4173>. (Abrir o `index.html` direto também funciona na maioria dos navegadores.)

## O que tem

- Progresso salvo no navegador (objetivos, passos, critérios e desafio concluído).
- Tema claro e escuro.
- Botão **Copiar para o Notion (Markdown)** em cada módulo: cola direto numa página do Notion, com as caixas de seleção e as perguntas.

## Editar o conteúdo

Todo o conteúdo está em `data.js`. Cada módulo tem `engage`, `objectives`, `guiding`, `study`, `challenge` e, opcionalmente, `bridge` (tabela Swift → Kotlin). Os links ficam em `links` e são referenciados pela chave.

> Itens marcados com **[confirmar]** dependem de versão de ferramenta. Confira na documentação oficial antes de seguir.

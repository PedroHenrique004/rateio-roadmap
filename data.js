/* Conteúdo do roadmap. Cada módulo segue o Challenge Based Learning:
   Engajar (ideia central, pergunta essencial, desafio) → Investigar (perguntas-guia, estudar) → Agir (desafio). */
window.ROADMAP = {
  phases: [
    { id: 'a', name: 'Fundamentos', blurb: 'Ambiente, Kotlin, domínio com testes e coroutines.', color: '#3341E8' },
    { id: 'b', name: 'Telas e módulo compartilhado', blurb: 'Compose, o módulo shared, persistência e as duas UIs nativas.', color: '#14B386' },
    { id: 'c', name: 'Evoluir o produto', blurb: 'Novas versões do app: contato e tipos editáveis.', color: '#FF5C93' },
    { id: 'd', name: 'Acabamento e além', blurb: 'Qualidade, portfólio e a versão com rede.', color: '#F59E0B' },
  ],

  links: {
    kotlin: { label: 'Documentação do Kotlin', url: 'https://kotlinlang.org/docs/home.html' },
    kmp: { label: 'Kotlin Multiplatform (oficial)', url: 'https://kotlinlang.org/docs/multiplatform.html' },
    wizard: { label: 'Assistente de projetos KMP', url: 'https://kmp.jetbrains.com' },
    koans: { label: 'Kotlin Koans', url: 'https://kotlinlang.org/docs/koans.html' },
    coroutines: { label: 'Guia de coroutines', url: 'https://kotlinlang.org/docs/coroutines-guide.html' },
    flow: { label: 'Flows assíncronos', url: 'https://kotlinlang.org/docs/flow.html' },
    compose: { label: 'Jetpack Compose (oficial)', url: 'https://developer.android.com/compose' },
    composeCourse: { label: 'Android Basics with Compose', url: 'https://developer.android.com/courses/android-basics-compose/course' },
    composeState: { label: 'Estado no Compose', url: 'https://developer.android.com/develop/ui/compose/state' },
    skie: { label: 'SKIE (Touchlab)', url: 'https://skie.touchlab.co' },
    sqldelight: { label: 'SQLDelight', url: 'https://github.com/sqldelight/sqldelight' },
    koin: { label: 'Koin', url: 'https://insert-koin.io' },
    ktor: { label: 'Ktor', url: 'https://ktor.io' },
    cbl: { label: 'Challenge Based Learning (guia)', url: 'https://www.challengebasedlearning.org/wp-content/uploads/2019/02/CBL_Guide2016.pdf' },
  },

  modules: [
    {
      id: 0, phase: 'a', emoji: '🧰', version: 'Pré', effort: 'leve',
      title: 'Ambiente: chão firme',
      subtitle: 'Instalar, rodar e entender a estrutura de um projeto KMP.',
      engage: {
        bigIdea: 'Antes de escrever lógica, o ambiente precisa rodar nos dois mundos.',
        question: 'O que eu preciso instalar e entender para ver um app KMP rodando no iPhone e no Android?',
        challenge: 'Criar um projeto pelo assistente oficial e trocar um texto que vem do módulo Kotlin.',
      },
      objectives: [
        'Instalar Android Studio com o plugin de Kotlin Multiplatform e checar o ambiente com o kdoctor',
        'Criar um projeto pelo assistente oficial e rodar no simulador de iPhone e no emulador Android',
        'Explicar para que serve cada pasta: shared, androidApp, iosApp, commonMain, androidMain, iosMain, commonTest',
        'Manter um diário de erros de configuração',
      ],
      guiding: [
        'O que o KMP compartilha por padrão e o que ele não compartilha?',
        'Qual a diferença entre rodar o app pelo Xcode e pelo Android Studio?',
        'O que cada "source set" guarda e quando o código vai para um ou outro?',
        'Qual erro de ambiente mais travou e como foi resolvido?',
      ],
      study: [
        {
          title: 'KMP em uma página',
          points: [
            'Código comum em Kotlin (commonMain) + partes de cada plataforma (androidMain, iosMain).',
            'Neste roadmap, as telas são nativas: SwiftUI no iOS e Compose no Android. Só a lógica é compartilhada.',
            'O módulo shared vira uma biblioteca (.aar no Android, framework no iOS).',
          ],
          links: ['kmp', 'wizard'],
        },
        {
          title: 'Ferramentas',
          points: [
            'Android Studio (ou IntelliJ) com o plugin Kotlin Multiplatform; Xcode já instalado.',
            'kdoctor: ferramenta de terminal que diagnostica o ambiente KMP no macOS [confirmar o comando atual].',
            'Versões mudam rápido: anote as versões que funcionaram (Kotlin, Gradle, AGP, Xcode).',
          ],
          links: ['kotlin'],
        },
      ],
      challenge: {
        title: 'Olá, shared',
        brief: 'Gere um projeto pelo assistente, rode nos dois lados e faça uma função do módulo compartilhado devolver o texto que aparece na tela.',
        steps: [
          'Rodar o kdoctor e corrigir o que ele apontar',
          'Gerar o projeto (Android + iOS, UI nativa) e rodar no emulador e no simulador',
          'Trocar o texto retornado por uma função em commonMain e ver nos dois apps',
          'Escrever no README o que cada pasta faz, com suas palavras',
        ],
        done: [
          'Os dois apps abrem e mostram o mesmo texto vindo do shared',
          'Você explica em voz alta o caminho: commonMain → framework → tela',
          'O diário de erros tem pelo menos uma entrada com causa e solução',
        ],
        stretch: 'Rodar em um aparelho de verdade.',
        reflect: ['O que foi mais estranho vindo do Xcode?', 'O que você faria diferente na próxima instalação?'],
      },
    },

    {
      id: 1, phase: 'a', emoji: '🔤', version: 'v1.0', effort: 'médio',
      title: 'Kotlin para quem fala Swift',
      subtitle: 'Sintaxe, nulos, coleções e o jeito Kotlin de modelar dados.',
      engage: {
        bigIdea: 'Você já sabe programar. O que muda é o vocabulário.',
        question: 'Como escrevo em Kotlin o que eu escreveria em Swift sem consultar tudo a toda hora?',
        challenge: 'Portar a formatação e a leitura de dinheiro do Rateio, com testes.',
      },
      objectives: [
        'Ler e escrever Kotlin básico: val/var, funções, classes, data class e copy',
        'Usar null safety: ?., ?:, let e entender o !! (e por que evitá-lo)',
        'Usar when, extension functions e as funções de coleção (map, filter, fold)',
        'Saber a diferença entre List e MutableList',
      ],
      guiding: [
        'O que no Kotlin é equivalente a struct, enum com valores associados e protocol?',
        'Como o Kotlin trata imutabilidade e cópia de objetos?',
        'Quando usar let, apply, run e also?',
        'Por que guardar dinheiro como inteiro em centavos?',
      ],
      bridge: [
        ['let x = 1', 'val x = 1', 'imutável'],
        ['struct Pessoa { }', 'data class Pessoa(...)', 'vem com equals, copy e toString'],
        ['x ?? "padrão"', 'x ?: "padrão"', 'operador "elvis"'],
        ['guard let v = x else { return }', 'val v = x ?: return', ''],
        ['enum com associated values', 'sealed interface', 'estados e resultados'],
        ['switch', 'when', 'também é expressão'],
        ['{ $0 + 1 }', '{ it + 1 }', 'lambda com it'],
        ['reduce(0) { }', 'fold(0) { acc, x -> }', ''],
        ['"Olá \\(nome)"', '"Olá $nome"', 'interpolação'],
      ],
      study: [
        {
          title: 'Fundamentos',
          points: [
            'Variáveis, funções, classes, data class, objetos e companion.',
            'Nulos: tipos com ? e smart cast. Em Kotlin o !! lança exceção.',
            'Coleções: List é somente leitura por padrão; MutableList altera.',
            'Funções de escopo: let, apply, run, also.',
          ],
          links: ['kotlin', 'koans'],
        },
        {
          title: 'Regras do dinheiro no Rateio (R1)',
          points: [
            'Todo valor é inteiro em centavos: R$ 12,50 vira 1250.',
            'Digitado aceita vírgula ou ponto; o ponto é milhar e a vírgula é o decimal.',
            'Valor vazio, zero ou inválido significa "sem valor".',
            'Exibição: R$ 1.234,50.',
          ],
        },
      ],
      challenge: {
        title: 'Dinheiro em Kotlin',
        brief: 'Escreva formatarDinheiro(centavos: Long): String e lerDinheiro(texto: String): Long?, com testes escritos antes.',
        steps: [
          'Escrever os testes primeiro (tabela abaixo)',
          'Implementar formatarDinheiro',
          'Implementar lerDinheiro (vazio, zero e inválido devolvem null)',
          'Rodar os testes e refatorar usando let e ?:',
        ],
        done: [
          '1234567 vira "R$ 12.345,67"',
          '"12,5" vira 1250 e "1.234,50" vira 123450',
          '"" e "0" devolvem null',
          'Todos os testes passam',
        ],
        stretch: 'Aceitar também "R$ 12,50" digitado com símbolo e espaços.',
        reflect: ['Que parte do Kotlin pareceu mais elegante que o Swift?', 'Qual caiu na armadilha de nulo?'],
      },
    },

    {
      id: 2, phase: 'a', emoji: '🧮', version: 'v1.0', effort: 'grande',
      title: 'Domínio com testes: o acerto',
      subtitle: 'Divisão em centavos e o algoritmo de quem paga a quem.',
      engage: {
        bigIdea: 'O valor do Rateio está no cálculo: o item comprado vira despesa.',
        question: 'Como dividir contas sem perder nem criar nenhum centavo e dizer quem paga quanto a quem?',
        challenge: 'Reproduzir os números do cenário "Viagem pra Floripa" em Kotlin.',
      },
      objectives: [
        'Dividir um total em n partes sem perder centavos (resto distribuído de 1 em 1)',
        'Calcular saldo por pessoa: pagou − parte',
        'Implementar o algoritmo guloso de transferências',
        'Escrever o teste antes do código e usar um teste de propriedade simples',
      ],
      guiding: [
        'Por que a soma dos saldos do grupo é sempre zero?',
        'O que acontece quando "quem divide" fica vazio ou tem alguém que saiu do grupo?',
        'Por que o resultado do guloso é correto mesmo sem ser o mínimo possível?',
        'Como garantir que ninguém entre na conta de uma compra antiga?',
      ],
      study: [
        {
          title: 'Regras (documento 02)',
          points: [
            'R2.1: cada pessoa recebe total ÷ n arredondado para baixo; o resto vai de 1 em 1 centavo para as primeiras da lista.',
            'R4.1 a R4.4: quem pagou recebe crédito do valor; cada pessoa que divide recebe débito da sua parte; saldo = pago − parte.',
            'R4.5: ordene credores e devedores do maior para o menor e transfira o menor dos dois valores até zerar.',
          ],
        },
        {
          title: 'Exemplo: a Bia não come carne',
          points: [
            'Picanha de R$ 200,00 paga pelo Pedro, dividida entre 4 das 5 pessoas (sem a Bia): 50,00 cada.',
            'Saldos: Pedro +150,00; Ana, Lucas e Marina −50,00; Bia quite.',
            'Acerto: Ana, Lucas e Marina pagam R$ 50,00 cada ao Pedro.',
          ],
        },
        { title: 'Coleções úteis', points: ['groupBy, sumOf, sortedByDescending, associate, fold.', 'kotlin.test para os testes em commonTest.'], links: ['kotlin'] },
      ],
      challenge: {
        title: 'Floripa em Kotlin',
        brief: 'Implemente dividirCentavos e calcularAcerto e faça o cenário "Viagem pra Floripa" dar exatamente os números do documento 02.',
        steps: [
          'Escrever os testes da divisão (tabela da seção 2)',
          'Implementar dividirCentavos',
          'Escrever o teste do cenário Floripa',
          'Implementar calcularAcerto com saldos e transferências',
          'Adicionar o teste de propriedade: a soma das partes é sempre o total',
        ],
        done: [
          'Total do grupo: R$ 2.236,50',
          'Pedro paga R$ 293,13 a Lara; Rafa paga R$ 229,12 a Lara; Camila paga R$ 88,62 a Lara',
          'A soma dos saldos é sempre zero',
          'Você explica o algoritmo em voz alta, sem olhar',
        ],
        stretch: 'Adicionar o cenário "sem a Bia" e conferir o resultado do exemplo.',
        reflect: ['Que bug o teste pegou antes de você ver?', 'Por que dinheiro não pode ser Double?'],
      },
    },

    {
      id: 3, phase: 'a', emoji: '🌊', version: 'v1.0', effort: 'médio',
      title: 'Coroutines e Flow',
      subtitle: 'Assíncrono em Kotlin e estado reativo com StateFlow.',
      engage: {
        bigIdea: 'A tela é uma função do estado. Alguém precisa guardar esse estado.',
        question: 'Como o estado de uma tela vive fora dela e avisa quando muda?',
        challenge: 'Criar um state holder com StateFlow e UiState em sealed interface.',
      },
      objectives: [
        'Usar suspend fun, CoroutineScope e Dispatchers',
        'Diferenciar Flow, StateFlow e SharedFlow',
        'Modelar Loading, Success e Error com sealed interface',
        'Testar emissões de estado',
      ],
      guiding: [
        'O que é concorrência estruturada e o que acontece quando o escopo é cancelado?',
        'Quando usar StateFlow e quando usar SharedFlow?',
        'O que corresponde a async/await, AsyncSequence e @Published no mundo Swift?',
        'Como tratar erro sem espalhar try/catch pela UI?',
      ],
      study: [
        {
          title: 'Coroutines',
          points: ['suspend, launch, async/await, withContext.', 'Dispatchers (Main, IO/Default) e cancelamento cooperativo.', 'Erros: try/catch, Result e supervisão.'],
          links: ['coroutines'],
        },
        {
          title: 'Flow',
          points: ['Flow frio versus StateFlow quente com valor atual.', 'stateIn, map, combine, collect.', 'Eventos únicos com SharedFlow ou Channel.'],
          links: ['flow'],
        },
      ],
      challenge: {
        title: 'Estado da lista de grupos',
        brief: 'Crie um GruposViewModel (ou state holder) que expõe StateFlow<GruposUiState> lendo de um repositório falso com delay.',
        steps: [
          'Modelar GruposUiState como sealed interface (Loading, Success, Error)',
          'Criar o repositório falso com suspend fun e delay',
          'Expor o estado como StateFlow e atualizar com o resultado',
          'Testar a sequência Loading → Success e Loading → Error',
        ],
        done: [
          'O estado inicial é Loading',
          'Em caso de falha o estado vira Error com mensagem',
          'Os testes passam em commonTest',
        ],
        stretch: 'Adicionar busca em tempo real com debounce.',
        reflect: ['Onde o StateFlow se parece com @Published?', 'O que você deixaria fora da camada de UI?'],
      },
    },

    {
      id: 4, phase: 'b', emoji: '🎨', version: 'v1.0', effort: 'grande',
      title: 'Jetpack Compose para quem fala SwiftUI',
      subtitle: 'Telas declarativas, estado e listas no Android.',
      engage: {
        bigIdea: 'SwiftUI e Compose são irmãos: tela = função do estado.',
        question: 'O que muda e o que se repete ao desenhar a mesma tela no Android?',
        challenge: 'Desenhar a tela de Acerto em Compose com repositório em memória.',
      },
      objectives: [
        'Escrever funções @Composable com Column, Row, Box e Modifier',
        'Aplicar state hoisting: o estado sobe, os eventos descem',
        'Criar listas com LazyColumn',
        'Ligar um ViewModel à tela com collectAsStateWithLifecycle',
      ],
      guiding: [
        'O que é recomposição e quando ela acontece?',
        'Onde fica o estado: na tela ou no ViewModel?',
        'Como a lista "Falta comprar / Já comprado" vira um LazyColumn?',
        'Que ideia do SwiftUI você reaproveita sem traduzir?',
      ],
      bridge: [
        ['struct MinhaView: View', '@Composable fun MinhaTela()', 'a tela é uma função'],
        ['@State', 'remember { mutableStateOf(...) }', 'estado local'],
        ['@Observable / ObservableObject', 'ViewModel + StateFlow', 'estado vindo de fora'],
        ['VStack / HStack / ZStack', 'Column / Row / Box', ''],
        ['List / ForEach', 'LazyColumn { items(...) }', 'listas preguiçosas'],
        ['.padding().background()', 'Modifier.padding().background()', 'cadeia de modificadores'],
        ['.sheet', 'ModalBottomSheet / Dialog', ''],
        ['NavigationStack', 'Navigation Compose', 'conferir a recomendada hoje'],
      ],
      study: [
        {
          title: 'Compose essencial',
          points: ['Composables, preview, Modifier e temas (Material 3).', 'State hoisting e remember.', 'LazyColumn, Scaffold e navegação.'],
          links: ['compose', 'composeCourse', 'composeState'],
        },
      ],
      challenge: {
        title: 'Acerto em Compose',
        brief: 'Reproduza o cupom do acerto no Android, com um repositório em memória, antes de ligar ao KMP.',
        steps: [
          'Montar a tela estática com dados de exemplo',
          'Extrair o estado para um ViewModel',
          'Mostrar a lista de transferências com LazyColumn',
          'Adicionar o resumo por pessoa e o total',
        ],
        done: [
          'A tela não contém regra de negócio, só estado e eventos',
          'Rotacionar o aparelho não perde o estado',
          'A preview mostra o cupom completo',
        ],
        stretch: 'Compartilhar o texto do acerto com a folha de compartilhamento do Android.',
        reflect: ['O que foi mais fácil que no SwiftUI?', 'Onde você sentiu falta de algo?'],
      },
    },

    {
      id: 5, phase: 'b', emoji: '🧱', version: 'v1.0', effort: 'grande',
      title: 'KMP de verdade: o módulo shared',
      subtitle: 'Gradle, source sets, version catalog e expect/actual.',
      engage: {
        bigIdea: 'Escrever uma vez o cérebro e deixar cada plataforma cuidar do que é dela.',
        question: 'Como mover o domínio para o shared e usá-lo nos dois apps?',
        challenge: 'Mudar o cérebro de casa: domínio e testes passam para o módulo compartilhado.',
      },
      objectives: [
        'Configurar o módulo shared com androidTarget e os alvos de iOS',
        'Organizar commonMain, commonTest, androidMain e iosMain',
        'Usar o catálogo de versões (libs.versions.toml)',
        'Explicar expect/actual com um exemplo',
      ],
      guiding: [
        'O que deve ficar em commonMain e o que não deve?',
        'Como o iOS enxerga o módulo (framework) e como o Xcode o carrega?',
        'O que é expect/actual e que problema ele resolve?',
        'Como rodar os mesmos testes em mais de uma plataforma?',
      ],
      study: [
        {
          title: 'Projeto',
          points: [
            'Gradle com Kotlin DSL e o catálogo de versões.',
            'Alvos: androidTarget, iosArm64 e iosSimulatorArm64 [confirmar a lista atual].',
            'Passo de embed do framework no Xcode [confirmar o nome da tarefa atual].',
          ],
          links: ['kmp'],
        },
        {
          title: 'expect/actual',
          points: ['O comum declara o que precisa (expect); cada plataforma implementa (actual).', 'Analogia: parece um protocol implementado por cada plataforma, resolvido em tempo de compilação.'],
        },
      ],
      challenge: {
        title: 'Mudando o cérebro de casa',
        brief: 'Leve dinheiro e acerto (módulos 1 e 2) para o shared e chame de dentro dos dois apps.',
        steps: [
          'Mover o domínio e os testes para commonMain e commonTest',
          'Compilar para Android e para o simulador de iPhone',
          'Chamar calcularAcerto de dentro do app Android',
          'Chamar a mesma função de dentro do app iOS',
        ],
        done: [
          'Os testes de commonTest passam no Android e no iOS',
          'Os dois apps mostram o total da Viagem pra Floripa: R$ 2.236,50',
          'Você explica expect/actual com um exemplo do Rateio',
        ],
        stretch: 'Criar um expect/actual de teste que devolve o nome da plataforma.',
        reflect: ['Que erro de build mais apareceu?', 'O que você colocaria no commonMain que não deveria estar lá?'],
      },
    },

    {
      id: 6, phase: 'b', emoji: '💾', version: 'v1.0', effort: 'grande',
      title: 'Salvar no aparelho: banco e injeção',
      subtitle: 'Repositório, SQLDelight (ou Room KMP) e Koin.',
      engage: {
        bigIdea: 'O app precisa lembrar. A forma de lembrar não pode vazar para o domínio.',
        question: 'Como persistir grupos de modo que o domínio não saiba onde eles ficam?',
        challenge: 'Fazer os grupos sobreviverem ao fechar o app, nos dois lados.',
      },
      objectives: [
        'Definir a interface GrupoRepositorio e duas implementações (memória e disco)',
        'Persistir com SQLDelight ou Room KMP e justificar a escolha',
        'Injetar dependências com Koin (módulo comum + módulo por plataforma)',
        'Rodar o mesmo conjunto de testes nas duas implementações',
      ],
      guiding: [
        'Qual a diferença entre guardar o grupo inteiro como JSON e usar um banco?',
        'Como o driver do banco muda por plataforma (expect/actual)?',
        'Como o Koin entrega o repositório certo em cada app?',
        'Como testar o repositório sem tocar no disco?',
      ],
      study: [
        {
          title: 'Persistência',
          points: ['Schema, queries e migrações.', 'Driver por plataforma (Android e iOS).', 'Alternativa mais simples: salvar JSON versionado com kotlinx.serialization.'],
          links: ['sqldelight'],
        },
        { title: 'Injeção de dependências', points: ['Módulos do Koin: commonModule e platformModule.', 'Inicialização no Android e no iOS (helper).'], links: ['koin'] },
      ],
      challenge: {
        title: 'O grupo sobrevive',
        brief: 'Implemente o repositório em disco e prove que o grupo continua lá depois de fechar o app, no iOS e no Android.',
        steps: [
          'Escrever o contrato de testes do repositório',
          'Passar o contrato com a versão em memória',
          'Implementar a versão em disco e passar o mesmo contrato',
          'Injetar com Koin e usar nos dois apps',
        ],
        done: [
          'Criar grupo, fechar o app, abrir de novo: o grupo está lá, nos dois apps',
          'O contrato passa nas duas implementações',
          'A escolha (banco ou JSON) está registrada na tabela de decisões do documento 03',
        ],
        stretch: 'Registrar uma migração de esquema simples.',
        reflect: ['Que decisão você tomaria diferente com mais dados?', 'O que o Koin tirou do seu código?'],
      },
    },

    {
      id: 7, phase: 'b', emoji: '🍎', version: 'v1.0', effort: 'grande',
      title: 'SwiftUI consome o Kotlin',
      subtitle: 'SKIE, tipos Kotlin no Swift e o shared dentro de uma View.',
      engage: {
        bigIdea: 'A ponte entre Kotlin e Swift define o quanto o código parece natural dos dois lados.',
        question: 'Como uma View SwiftUI usa um StateFlow e uma sealed interface do Kotlin?',
        challenge: 'Montar a tela de Acerto em SwiftUI com números vindos do shared.',
      },
      objectives: [
        'Configurar o SKIE e consumir sealed como enum exaustivo no switch',
        'Observar um Flow no Swift (for await) e atualizar a View',
        'Reconhecer como os tipos Kotlin aparecem no Swift (Long, List, nulos)',
        'Envolver o estado compartilhado em um ObservableObject / @Observable',
      ],
      guiding: [
        'Como um suspend fun e um Flow aparecem no Swift com e sem SKIE?',
        'Quando o objeto de apresentação é liberado?',
        'Que 2 diferenças de tipo mais deram trabalho?',
        'Existe alternativa ao SKIE? Quais os trade-offs?',
      ],
      study: [
        {
          title: 'Interoperabilidade',
          points: [
            'Sem plugin, suspend e Flow não viram async/await e AsyncSequence automaticamente.',
            'SKIE melhora isso, mas acompanha as versões do Kotlin: fixe as versões [confirmar a compatibilidade].',
            'Inicialização do Koin pelo lado do iOS.',
          ],
          links: ['skie'],
        },
      ],
      challenge: {
        title: 'Acerto em SwiftUI',
        brief: 'Mostre o cupom do acerto no SwiftUI com os valores calculados pelo módulo Kotlin.',
        steps: [
          'Expor o estado da tela como StateFlow no shared',
          'Observar o estado no Swift e publicá-lo para a View',
          'Montar o cupom com os mesmos números do Android',
          'Fazer "marcar como comprado" chamar o shared e atualizar a tela',
        ],
        done: [
          'O cenário Floripa mostra os mesmos números nos dois apps',
          'Mudar um item atualiza o acerto na hora',
          'Você consegue apontar 2 diferenças de tipo entre Kotlin e Swift',
        ],
        stretch: 'Substituir um callback por async/await via SKIE.',
        reflect: ['O que parece "estranho" ao ler Kotlin pelo Swift?', 'Onde a ponte ainda dói?'],
      },
    },

    {
      id: 8, phase: 'b', emoji: '🤝', version: 'v1.0', effort: 'grande',
      title: 'Compose + shared: mesma lógica, duas telas',
      subtitle: 'Fechar a v1.0 no Android e comparar lado a lado.',
      engage: {
        bigIdea: 'A prova do KMP é o mesmo cenário dando o mesmo resultado em duas telas diferentes.',
        question: 'Quanta lógica eu deixei de reescrever ao ligar o Compose ao shared?',
        challenge: 'Fechar a v1.0 completa: Home, Lista, Pessoas e Acerto nos dois apps.',
      },
      objectives: [
        'Usar o ViewModel compartilhado no Android (artefato KMP do lifecycle, sem o -compose) [confirmar]',
        'Obter o ViewModel com Koin e coletar o estado com collectAsStateWithLifecycle',
        'Navegar entre as telas e manter o estado',
        'Medir o reuso comparando as duas versões',
      ],
      guiding: [
        'Qual parte da tela de Lista ficou 100% igual nos dois apps?',
        'Que código ainda é específico de plataforma e por quê?',
        'Como validar que o comportamento é o mesmo?',
        'O que ficaria diferente se as telas também fossem compartilhadas?',
      ],
      study: [
        {
          title: 'Integração Android',
          points: ['ViewModel do módulo compartilhado e seu ciclo de vida.', 'Koin no Android (koin-android e koin-compose).', 'Navegação entre as 4 telas.'],
          links: ['compose', 'koin'],
        },
      ],
      challenge: {
        title: 'v1.0 pronta',
        brief: 'Termine as 4 telas nos dois apps usando o mesmo módulo e prove que os números batem.',
        steps: [
          'Home com a lista de grupos',
          'Lista com marcar comprado, valor e quem divide',
          'Pessoas com adicionar, renomear e remover',
          'Acerto com cupom e compartilhar texto',
          'Comparar o cenário Floripa lado a lado em duas capturas de tela',
        ],
        done: [
          'O fluxo "abrir exemplo → marcar com valor → ver o cupom" funciona nos dois apps',
          'Os totais batem: R$ 2.236,50',
          'Fechar e abrir mantém os dados',
        ],
        stretch: 'Contar quantas linhas de lógica você não precisou reescrever.',
        reflect: ['O que você apresentaria primeiro numa demo de 3 minutos?', 'O que você deixaria para a v1.1?'],
      },
    },

    {
      id: 9, phase: 'c', emoji: '📇', version: 'v1.1', effort: 'médio',
      title: 'Contato: expect/actual de verdade',
      subtitle: 'Pix, telefone, copiar e abrir o WhatsApp.',
      engage: {
        bigIdea: 'Copiar para a área de transferência e abrir uma URL são coisas de cada plataforma.',
        question: 'Como acrescentar dados de contato sem quebrar quem já tem dados salvos?',
        challenge: 'Tela Editar pessoa com Pix e telefone e contato no acerto.',
      },
      objectives: [
        'Declarar um expect/actual para copiar texto e abrir URL',
        'Acrescentar campos opcionais ao modelo mantendo compatibilidade',
        'Montar o link do WhatsApp com código do Brasil (55)',
        'Incluir o Pix de quem recebe no texto compartilhado (R7.3)',
      ],
      guiding: [
        'Como o modelo antigo (sem Pix) continua carregando?',
        'Qual a API de cada plataforma para copiar e para abrir URL?',
        'Onde deve ficar a regra "sem código de país vira 55"?',
        'Como testar um expect/actual?',
      ],
      study: [
        {
          title: 'Regras',
          points: [
            'R5.5: Editar pessoa tem nome, Pix e telefone (opcionais); remover fica na mesma tela.',
            'R5.6: tocar no nome no acerto abre o contato com Copiar Pix e Abrir no WhatsApp.',
            'R7.3: o texto compartilhado leva o Pix de quem recebe.',
          ],
        },
        { title: 'Plataforma', points: ['Android: ClipboardManager e Intent de visualização.', 'iOS: UIPasteboard e abertura de URL.', 'Valores padrão e campos opcionais na serialização.'], links: ['kmp'] },
      ],
      challenge: {
        title: 'Contato nos dois apps',
        brief: 'Entregue a v1.1 sem mexer em nenhuma regra de cálculo.',
        steps: [
          'Acrescentar pix e telefone ao modelo com valores padrão',
          'Criar o expect/actual de copiar e abrir URL',
          'Tela Editar pessoa e sheet de contato no acerto',
          'Atualizar o texto compartilhado com o Pix',
        ],
        done: [
          'Dados antigos (sem Pix) continuam abrindo',
          'O Pix copiado cola em outro app',
          'O link do WhatsApp usa 55 quando o telefone não tem código de país',
        ],
        stretch: 'Validar o formato básico de telefone.',
        reflect: ['Que parte do expect/actual foi mais simples do que esperava?', 'O que mudaria se o modelo fosse salvo em banco?'],
      },
    },

    {
      id: 10, phase: 'c', emoji: '🏷️', version: 'v1.2', effort: 'médio',
      title: 'Tipos e grupos editáveis',
      subtitle: 'CRUD de tipos, regra em cascata e migração de dados.',
      engage: {
        bigIdea: 'Quando o usuário cria as próprias categorias, apagar uma delas mexe em tudo que a usa.',
        question: 'O que deve acontecer com os grupos quando um tipo é apagado?',
        challenge: 'Editar grupo e criar, editar e apagar tipos (base ou criados).',
      },
      objectives: [
        'Implementar criar, editar e apagar tipos com validação de nome único',
        'Aplicar a regra em cascata: grupos do tipo apagado ficam sem tipo (R6.7)',
        'Migrar dados salvos da v1.0/v1.1 sem perder nada',
        'Implementar o gesto de toque longo em SwiftUI e Compose',
      ],
      guiding: [
        'Onde fica a lista de tipos e quem é dono dela?',
        'Como evitar nomes repetidos sem diferenciar maiúsculas?',
        'Como mostrar quantos grupos serão afetados antes de apagar?',
        'Como versionar o armazenamento para migrar?',
      ],
      study: [
        {
          title: 'Regras R6',
          points: [
            'R6.1: 3 tipos base (Churrasco, Viagem, Família), todos editáveis e apagáveis.',
            'R6.4: grupo editável (nome e tipo); R6.2: excluir grupo fica na tela Editar.',
            'R6.5 a R6.7: criar tipo com nome (até 20) e emoji; renomear para nome em uso é recusado; apagar tipo em uso deixa os grupos sem tipo.',
          ],
        },
        { title: 'Gestos', points: ['SwiftUI: onLongPressGesture ou contextMenu.', 'Compose: combinedClickable com onLongClick.'], links: ['compose'] },
      ],
      challenge: {
        title: 'Tipos sob controle',
        brief: 'Faça a v1.2 passar nos cenários de regra, escritos como testes no shared.',
        steps: [
          'Testes: criar, nome repetido, renomear para nome em uso, apagar em uso',
          'Implementar a lista de tipos no shared',
          'Tela Editar grupo e seletor de tipo com toque longo',
          'Migração dos dados antigos para a nova lista',
        ],
        done: [
          'Apagar um tipo em uso mantém todos os grupos, agora sem tipo',
          'Renomear para um nome existente é recusado',
          'Quem atualiza a partir da v1.1 não perde nenhum grupo',
        ],
        stretch: 'Permitir escolher a cor do tipo.',
        reflect: ['O que você faria para desfazer uma exclusão?', 'Onde a migração poderia falhar?'],
      },
    },

    {
      id: 11, phase: 'd', emoji: '🚀', version: 'Todas', effort: 'médio',
      title: 'Qualidade e portfólio',
      subtitle: 'Testes, CI, README e a história do projeto.',
      engage: {
        bigIdea: 'Código bom que ninguém consegue entender ou rodar vale pouco.',
        question: 'Como mostrar este projeto para outra pessoa em 3 minutos?',
        challenge: 'Publicar o repositório com README, decisões registradas e uma demo curta.',
      },
      objectives: [
        'Organizar os testes (unitários no shared) e rodá-los na integração contínua',
        'Escrever um README com como rodar e capturas de tela',
        'Registrar as decisões de arquitetura com motivo',
        'Contar o que faria diferente',
      ],
      guiding: [
        'Que decisões merecem estar registradas?',
        'O que alguém precisa para rodar o projeto do zero?',
        'Qual é a demo mais curta que mostra o valor?',
        'O que ficou como dívida técnica?',
      ],
      study: [
        {
          title: 'Entrega',
          points: ['README com visão, arquitetura e passos.', 'Tabela de decisões (documento 03).', 'Integração contínua simples com os testes do shared [confirmar o fluxo atual].'],
        },
      ],
      challenge: {
        title: 'Portfólio',
        brief: 'Deixe o repositório pronto para alguém clonar, rodar e entender.',
        steps: [
          'README com capturas e GIF',
          'Decisões preenchidas e "o que eu faria diferente"',
          'Pipeline rodando os testes do shared',
          'Gravar uma demo de 3 minutos dos dois apps lado a lado',
        ],
        done: [
          'Alguém clona e roda seguindo só o README',
          'As decisões do documento 03 estão preenchidas',
          'Você apresenta o projeto sem olhar as anotações',
        ],
        stretch: 'Escrever um post curto sobre o que aprendeu.',
        reflect: ['O que você mais gostaria que um colega perguntasse?', 'Qual o próximo passo natural?'],
      },
    },

    {
      id: 12, phase: 'd', emoji: '🌐', version: 'v2', effort: 'grande',
      title: 'Bônus: rede e sincronização',
      subtitle: 'Backup em arquivo e um primeiro passo com Ktor.',
      engage: {
        bigIdea: 'Cada um com o seu celular: dados que viajam exigem identidade, rede e conflitos.',
        question: 'Qual é o menor passo para tirar os dados de um único aparelho?',
        challenge: 'Exportar e importar o backup em JSON, e depois falar com um servidor falso.',
      },
      objectives: [
        'Serializar o app inteiro em JSON versionado e restaurar',
        'Compartilhar um arquivo pela plataforma (expect/actual)',
        'Fazer uma chamada com Ktor Client (Darwin no iOS, OkHttp no Android)',
        'Entender o problema de conflitos de sincronização',
      ],
      guiding: [
        'Que formato de arquivo é seguro para evoluir?',
        'Quem ganha quando dois aparelhos editam o mesmo grupo?',
        'O que muda no domínio quando existe mais de um usuário?',
        'Como testar rede sem depender de internet?',
      ],
      study: [
        {
          title: 'Rede e serialização',
          points: ['kotlinx.serialization e Ktor Client com um engine por plataforma.', 'Servidor falso ou mock para testes.', 'Estratégias simples de conflito (último vence, mesclar).'],
          links: ['ktor'],
        },
      ],
      challenge: {
        title: 'Backup e primeiro contato com a rede',
        brief: 'Comece pelo arquivo: exporte e importe tudo. Depois envie e receba o mesmo JSON de um servidor falso.',
        steps: [
          'Serializar grupos e tipos em JSON com número de versão',
          'Exportar pelo compartilhamento da plataforma e importar de volta',
          'Cliente Ktor com um servidor local de teste',
          'Descrever como você resolveria um conflito',
        ],
        done: [
          'Exportar, limpar os dados e importar devolve tudo igual',
          'A chamada de rede é testada sem internet',
          'Os conflitos estão descritos por escrito',
        ],
        stretch: 'Autenticação simples por token.',
        reflect: ['O que você não imaginava que seria tão difícil?', 'Vale transformar isso em produto?'],
      },
    },
  ],
};

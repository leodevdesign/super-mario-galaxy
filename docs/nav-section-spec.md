# Especificação · Nav flutuante

## 1) Objetivo

Definir a navegação flutuante fixa do projeto **Super Mario Galaxy**, seguindo os prints anexados e o `DESIGN.md` da pasta.

A navegação deve funcionar como um elemento discreto, centralizado e cinematográfico, aparecendo somente após o usuário avançar no scroll. Ela deve servir como acesso rápido às principais âncoras da página, sem competir visualmente com o hero.

Funções esperadas:

- permanecer fixa no topo da viewport quando visível;
- iniciar oculta no topo da página;
- revelar após threshold baseado na altura do `#hero`;
- navegar por âncoras internas;
- destacar visualmente o item principal/ativo quando aplicável;
- preservar acessibilidade por `aria-label`, foco visível e navegação por teclado.

Âncoras previstas a partir do print:

- `#hero` ou `#topo` para o item **SMG**;
- `#personagens` para **PERSONAGENS**;
- `#trailers` para **TRAILERS**;
- `#estreia` para **ESTREIA**.

Suposição documentada: o print mostra apenas quatro itens. A especificação não adiciona novos itens nem menu mobile alternativo fora do que aparece na referência.

---

## 2) Estrutura HTML

A estrutura deve ser semântica e enxuta, composta por um wrapper fixo, um elemento `nav`, uma lista de links e separadores visuais internos.

Árvore esperada:

- `header.nav-floating-shell`
  - função: conter e posicionar a navegação fixa;
  - estado inicial: sem classe `.visible`;
  - estado revelado: com classe `.visible`.
- `nav.nav-floating`
  - atributo obrigatório: `aria-label="Navegação principal"`;
  - função: superfície arredondada da navegação.
- `ul.nav-floating__list`
  - função: agrupar os links como lista de navegação.
- `li.nav-floating__item`
  - função: item individual da navegação.
- `a.nav-floating__link`
  - função: link de âncora;
  - `href` apontando para a seção correspondente;
  - texto em caixa alta, conforme print.
- `span.nav-floating__divider`
  - função: separador vertical entre grupos;
  - deve ser puramente decorativo;
  - atributo esperado: `aria-hidden="true"`.

IDs de destino esperados:

- `#hero` ou `#topo`;
- `#personagens`;
- `#trailers`;
- `#estreia`.

Classes de estado permitidas:

- `.visible` no wrapper da nav;
- `.is-active` no link atualmente ativo, quando houver lógica de seção ativa;
- `.is-current` também é aceitável se já existir convenção no projeto, mas não usar as duas ao mesmo tempo.

Suposição documentada: o primeiro item **SMG** aparenta ser o item de marca/âncora inicial e também o estado visual principal. Caso o projeto já possua uma logo textual ou ícone oficial, este item deve continuar textual como no print, sem substituir por imagem.

---

## 3) Estados visuais

### Estado oculto no topo

A nav deve existir no DOM desde o carregamento, mas iniciar visualmente oculta.

Comportamento visual:

- opacidade em zero;
- deslocamento sutil para cima;
- sem bloqueio visual sobre o hero;
- não deve causar deslocamento de layout;
- deve evitar interação acidental quando invisível.

A ocultação deve usar apenas propriedades performáticas, preferencialmente `opacity`, `transform` e controle de interação. Não animar altura, margem ou propriedades que causem reflow.

### Estado `.visible` após threshold

Quando o scroll ultrapassar o threshold definido, o wrapper recebe `.visible`.

Comportamento visual:

- opacidade em um;
- retorno para posição natural;
- transição suave com o easing oficial;
- sensação de reveal discreto, sem bounce exagerado;
- nav fixa no topo, centralizada horizontalmente.

### Estado ativo

O print mostra **SMG** em destaque amarelo. Esse comportamento deve ser tratado como referência do estado principal/ativo.

Regras:

- link ativo usa `--accent-star`;
- links não ativos usam `--text-muted`;
- hover e focus podem aproximar o item de `--text-primary` ou `--accent-star`, desde que não criem nova cor;
- não usar branco puro;
- não usar brilho externo agressivo.

---

## 4) Estilos por bloco mapeados a tokens

Todos os estilos devem usar os tokens declarados no `:root`. Não introduzir cores, fontes ou gradientes fora dos tokens oficiais.

### Wrapper `.nav-floating-shell`

Papel: posicionamento fixo e controle de reveal.

Mapeamento:

- posição: fixa no topo da viewport;
- alinhamento: centralizado horizontalmente;
- z-index: acima do conteúdo principal, sem interferir em modais caso existam;
- motion: transição em `opacity` e `transform` usando `--ease-out-expo`;
- fonte herdada de `--font-body`.

### Container `.nav-floating`

Papel: superfície visual da navegação.

Mapeamento:

- fundo: usar `--bg-mid` ou `--bg-surface` com transparência permitida apenas se já existir padrão no projeto;
- borda: usar variação derivada de `--bg-surface`, `--accent-star-dim` ou contraste sutil com tokens existentes;
- texto base: `--text-muted`;
- raio: formato pill/cápsula, compatível com o print;
- sombra/glow: somente brilho interno ou separação tonal controlada; evitar glow externo agressivo;
- densidade: compacta, com altura próxima ao print e boa área clicável.

### Lista `.nav-floating__list`

Papel: distribuição dos itens.

Mapeamento:

- layout horizontal;
- alinhamento central;
- espaçamento regular entre links;
- sem bullets;
- sem overflow horizontal em desktop.

### Link `.nav-floating__link`

Papel: item clicável.

Mapeamento:

- fonte: `--font-body`;
- transformação: caixa alta;
- peso: utility label entre 600 e 800;
- letter-spacing leve/moderado, conforme regra de utility labels;
- cor padrão: `--text-muted`;
- cor ativa: `--accent-star`;
- hover: pode usar `--text-primary`, `--accent-star` ou fundo suave `--accent-star-dim`;
- transição: `opacity`, `color`, `transform` ou background interno suave, usando `--ease-out-expo`;
- active/press: compressão vertical sutil, seguindo a regra de botões do design system.

### Separador `.nav-floating__divider`

Papel: divisor visual entre o item principal e os demais grupos.

Mapeamento:

- cor: derivada de `--text-muted` ou `--accent-star-dim`;
- opacidade baixa;
- altura menor que a altura total da nav;
- largura fina;
- não deve ser foco navegável;
- `aria-hidden="true"`.

---

## 5) Comportamento JS

A nav deve revelar com base no avanço do usuário após o hero.

Threshold principal:

- localizar o elemento `#hero`;
- calcular `threshold = altura do #hero * 0.6`;
- quando `window.scrollY` for maior que esse valor, adicionar `.visible` ao wrapper;
- quando `window.scrollY` for menor ou igual a esse valor, remover `.visible`.

Fallback se `#hero` não existir:

- usar threshold fixo equivalente a uma fração segura da primeira dobra;
- valor recomendado: aproximadamente 360px ou 40% da altura da viewport, escolhendo o menor valor útil para não atrasar demais o reveal;
- documentar no comentário da implementação que esse fallback existe apenas para páginas sem hero.

Regras de performance:

- usar listener de scroll com estratégia leve;
- evitar cálculos pesados a cada pixel de scroll;
- recalcular o threshold em resize/orientation change;
- preferir `requestAnimationFrame` ou controle equivalente para não sobrecarregar o scroll;
- não depender de bibliotecas externas apenas para esse comportamento.

Comportamento de âncoras:

- links devem navegar para os IDs internos;
- se já houver smooth scroll global no projeto, reaproveitar;
- se não houver, o spec não exige criar um sistema novo;
- respeitar preferências de redução de movimento quando houver implementação de scroll suave.

Estado ativo por seção:

- opcional, desde que não esteja fora do escopo visual do print;
- se implementado, deve aplicar `.is-active` ao link da seção mais próxima/visível;
- o estado ativo deve seguir o mesmo padrão visual do item **SMG** no print.

---

## 6) Responsividade e foco

### Desktop

A nav deve ficar centralizada, em formato pill horizontal, com todos os itens visíveis como no print.

Regras:

- não quebrar em duas linhas;
- preservar área clicável confortável;
- manter respiro lateral interno;
- manter separador após o primeiro item, conforme referência visual.

### Tablet

A nav pode reduzir espaçamentos, mantendo a mesma estrutura visual.

Regras:

- preservar todos os itens se houver largura suficiente;
- reduzir letter-spacing e gaps apenas se necessário;
- não alterar a ordem dos links;
- não introduzir ícones ou menu hamburguer sem novo print/referência.

### Mobile

Como o print anexado mostra a navegação flutuante horizontal, o comportamento mobile deve ser conservador.

Regras:

- manter a estrutura de links se couber;
- se não couber, permitir scroll horizontal interno discreto dentro da pill ou ocultar a nav flutuante em telas muito estreitas, conforme padrão já existente no projeto;
- não criar drawer, hamburger, overlay ou menu expandido sem referência visual;
- garantir que não exista overflow horizontal da página.

Suposição documentada: não há print mobile desta nav. Portanto, qualquer ajuste mobile deve ser mínimo e derivado da mesma estrutura, não um novo componente.

### Foco e acessibilidade

Regras de foco:

- todos os links precisam ser navegáveis por teclado;
- `:focus-visible` deve ser perceptível;
- foco pode usar contorno, fundo suave ou brilho interno baseado em `--accent-star` e/ou `--accent-star-dim`;
- não remover outline sem alternativa visível;
- contraste entre texto e superfície deve permanecer legível.

Regras ARIA:

- `nav` com `aria-label="Navegação principal"`;
- separadores com `aria-hidden="true"`;
- se houver link ativo por seção, usar `aria-current="page"` ou `aria-current="location"` de forma consistente.

---

## 7) Checklist de implementação

- [ ] Criar o arquivo/estrutura da nav sem adicionar itens além dos quatro vistos no print.
- [ ] Garantir wrapper fixo, centralizado e sem impacto no layout.
- [ ] Iniciar a nav oculta no topo da página.
- [ ] Adicionar `.visible` após `#hero.offsetHeight * 0.6`.
- [ ] Criar fallback de threshold caso `#hero` não exista.
- [ ] Usar apenas tokens do `:root` para cores, fonte e easing.
- [ ] Aplicar `--font-body` e estilo de utility label em caixa alta.
- [ ] Destacar **SMG** ou link ativo com `--accent-star`.
- [ ] Usar `--text-muted` nos links inativos.
- [ ] Implementar separador decorativo após **SMG**, conforme print.
- [ ] Evitar glows externos agressivos e sombras pesadas.
- [ ] Garantir hover/focus com tokens oficiais.
- [ ] Testar navegação por teclado.
- [ ] Testar scroll/reveal no carregamento, scroll para baixo e retorno ao topo.
- [ ] Testar resize para recalcular threshold.
- [ ] Validar ausência de overflow horizontal em tablet/mobile.
- [ ] Confirmar que os IDs das âncoras existem na página.

---

## 8) Critérios de aceitação visuais

A implementação será considerada correta quando:

- a nav aparecer como uma cápsula flutuante centralizada, compatível com o print anexado;
- no topo da página, a nav estiver oculta e não competir com o hero;
- após o threshold, a nav surgir com reveal suave e controlado;
- o item **SMG** estiver destacado com `--accent-star`;
- os demais itens estiverem em tom secundário usando `--text-muted`;
- a superfície da nav estiver dentro da atmosfera cósmica usando `--bg-mid` ou `--bg-surface`;
- o separador vertical entre **SMG** e os outros itens estiver presente, sutil e alinhado;
- a tipografia estiver em `Outfit`, com caixa alta e letter-spacing de utility label;
- o componente não usar branco puro, cinzas externos, novas fontes ou novas cores;
- hover, focus e active forem perceptíveis sem exagero visual;
- a animação usar apenas `opacity` e `transform`;
- a nav não gerar deslocamento de layout;
- links navegarem corretamente para as âncoras;
- o componente permanecer legível e sem overflow em larguras menores;
- nenhuma estrutura extra, como drawer, submenu ou ícone novo, for adicionada sem referência.

---

## Referências utilizadas

- Print anexado da navegação flutuante: cápsula centralizada com itens **SMG**, **PERSONAGENS**, **TRAILERS** e **ESTREIA**.
- `DESIGN.md`: tokens oficiais de cor, tipografia, movimento, componentes e anti-patterns.
- `design-system.html`: referência de estrutura semântica, navegação por âncoras e uso de `aria-label` no projeto.

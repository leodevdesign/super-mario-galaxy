# Hero Section Spec — Super Mario Galaxy

## 1) Objetivo

Criar a especificação da Hero Section com base exclusiva nos prints anexados do Figma, tratando a imagem como contrato visual.

A Hero deve funcionar como abertura cinematográfica do site, com composição centralizada, fundo cósmico escuro, mídias flutuantes e planeta em destaque na base. A seção deve preservar alta legibilidade do título, subtítulo e CTA sobre o fundo espacial, respeitando os tokens definidos no `DESIGN.md` e no `:root` existente.

A Hero deve ser:

- seção principal acima da dobra;
- visualmente centralizada;
- não poluída por elementos extras;
- preparada para pequenas animações/parallax no futuro;
- fiel ao número, posição relativa e tipos de elementos visíveis no print.

Nenhum elemento fora do inventário abaixo pode ser criado no HTML da Hero.

---

## 2) Inventário visual — elementos vistos no print

### Conteúdo textual

1. **1 badge/pill superior central**
   - Texto visível: `NOS CINEMAS AGORA`
   - Localização: acima do título principal, centralizado.
   - Aparência: pequeno, em caixa alta, com fundo escuro/amarelado sutil.

2. **1 título central em duas linhas**
   - Linha 1: `Super Mario`
   - Linha 2: `Galaxy: O Filme`
   - Localização: centro horizontal da Hero.
   - Aparência: texto grande, pesado, com alto contraste; a segunda linha usa destaque amarelo no trecho visível.

3. **1 subtítulo/linha de apoio abaixo do título**
   - Texto visível parcialmente: `[texto a confirmar]`
   - Observação: o texto é pequeno e não está totalmente legível no print.
   - Localização: logo abaixo do título central.

4. **1 botão/CTA central**
   - Texto visível: `Assistir Trailer`
   - Ícone: pequeno círculo/ícone à direita dentro do botão.
   - Localização: abaixo do subtítulo, centralizado.
   - Aparência: botão roxo arredondado.

5. **1 microtexto inferior próximo ao planeta**
   - Texto visível parcialmente: `[texto a confirmar]`
   - Observação: parece ser um pequeno label acima/de frente ao planeta, mas está ilegível no print.
   - Localização: centro inferior, sobre a área do planeta.

### Elementos visuais / mídias

6. **1 vídeo do Mario à esquerda, flutuando**
   - Localização: quadrante superior esquerdo da Hero.
   - Orientação: Mario inclinado/flutuando em direção ao centro.
   - Asset obrigatório: vídeo com alpha/fallback definido no item 6 deste spec.

7. **1 vídeo do Yoshi à direita, flutuando**
   - Localização: quadrante superior direito da Hero.
   - Orientação: personagem flutuando e espelhado horizontalmente via CSS.
   - Asset obrigatório: vídeo com alpha/fallback definido no item 6 deste spec.

8. **1 vídeo do planeta central/inferior**
   - Localização: parte central inferior da Hero, ocupando a base visual da seção.
   - Aparência: planeta grande, parcialmente cortado pela dobra inferior.
   - Asset obrigatório: vídeo com alpha/fallback definido no item 6 deste spec.

9. **3 lumas/estrelas decorativas**
   - Asset único reutilizado: `assets/images/estrela-min.webp`
   - Contagem exata: 3 unidades.
   - Posições observadas:
     - 1 luma no lado esquerdo inferior/médio, próximo à margem esquerda.
     - 1 luma pequena no lado direito inferior/médio, próxima à margem direita.
     - 1 luma pequena no centro inferior, sobre a área do planeta.

10. **Fundo cósmico escuro com pontos/estrelas sutis**
    - Localização: fundo de toda a Hero.
    - Observação: o starfield global pode existir atrás da Hero, mas a Hero não deve adicionar partículas extras próprias além do que já estiver definido para o background global.

---

## 3) Estrutura HTML — árvore + classes

A estrutura deve espelhar apenas o inventário visual do item 2.

Árvore conceitual recomendada:

- `section.hero-section`
  - `div.hero-section__media-layer`
    - `video.hero-section__character.hero-section__character--mario`
    - `video.hero-section__character.hero-section__character--yoshi`
    - `video.hero-section__planet`
    - `img.hero-section__luma.hero-section__luma--left`
    - `img.hero-section__luma.hero-section__luma--right`
    - `img.hero-section__luma.hero-section__luma--center`
  - `div.hero-section__content`
    - `p.hero-section__eyebrow`
    - `h1.hero-section__title`
      - linha visual `Super Mario`
      - linha visual `Galaxy: O Filme`
    - `p.hero-section__subtitle`
    - `a` ou `button.hero-section__cta`
      - texto `Assistir Trailer`
      - ícone circular interno visível no print
    - `p.hero-section__microcopy`

Notas:

- O CTA só deve existir porque aparece no print.
- Não adicionar outros CTAs, links secundários, contadores, badges extras ou logos.
- O microcopy inferior deve existir apenas se for confirmado no HTML atual ou no Figma. Como o texto está ilegível, manter marcado como `[texto a confirmar]` até validação.
- O fundo de estrelas deve vir do canvas global `#starfield` quando já implementado no projeto; a Hero não deve duplicar um segundo canvas próprio.

---

## 4) Camadas visuais

A composição deve respeitar uma hierarquia de camadas simples:

1. **Fundo global**
   - Fundo cósmico escuro do `body`/canvas global.
   - Usar tokens de fundo definidos no `:root` e no `DESIGN.md`.

2. **Camada de mídias decorativas**
   - Mario à esquerda.
   - Yoshi à direita.
   - Planeta central/inferior.
   - 3 lumas nas posições do print.
   - Essa camada deve ficar atrás do texto quando houver sobreposição.

3. **Camada de conteúdo textual**
   - Badge superior.
   - Título.
   - Subtítulo.
   - CTA.
   - Microcopy inferior.

4. **Camada de interação**
   - Apenas o CTA deve ser interativo.
   - Mario, Yoshi, planeta e lumas devem ser decorativos e não devem capturar cliques.

---

## 5) Tokens — cores, fontes, espaçamentos e easing

Usar somente tokens existentes no `DESIGN.md` e no `:root` atual.

### Fonte

- Fonte principal: `--font-body` no `DESIGN.md` ou `--font-primary` no CSS existente.
- Não trocar por outra família tipográfica.

### Cores

Mapeamento recomendado conforme tokens disponíveis:

- Fundo profundo: `--bg-deep` ou `--color-space-900`.
- Texto principal: `--text-primary` ou `--color-text-primary`.
- Texto secundário/subtítulo: `--text-muted` ou `--color-text-secondary`.
- Destaque amarelo do título: `--accent-star` ou `--color-star-500`.
- CTA roxo: `--cosmic-purple` ou `--color-nebula-500`.
- Badge/pill: `--accent-star-dim` ou composição equivalente com tokens de Star Power já existentes.

### Espaçamentos

- Usar `clamp(...)` para altura, respiro vertical e escala do título quando necessário.
- Preferir tokens `--space-*` existentes para paddings, gaps e offsets.

### Motion / easing

- Usar `--ease-out-expo` ou `--motion-ease-out-expo` para entrada e hover discreto.
- Usar `--ease-spring` ou `--motion-ease-bounce` apenas se o efeito já existir ou for necessário para microinteração sutil.
- Animações devem priorizar `transform` e `opacity`.

---

## 6) Assets mapeados — arquivo + uso + posição

Usar exatamente os arquivos abaixo. Não usar outros arquivos e não inventar paths.

### Mario — esquerda do hero, flutuando

- Uso: personagem flutuante no quadrante superior esquerdo.
- Elemento: `<video>` com dois sources.
- Sources obrigatórios:
  - `assets/videos/mario-clip-alpha.webm` com `type="video/webm"`
  - `assets/videos/mario-clip-min.mp4` com `type="video/mp4"`
- Flags obrigatórias:
  - `autoplay`
  - `loop`
  - `muted`
  - `playsinline`
  - sem `controls`
- Observação: o `.webm` vem primeiro por ter canal alpha.

### Yoshi — direita do hero, flutuando

- Uso: personagem flutuante no quadrante superior direito.
- Elemento: `<video>` com dois sources.
- Sources obrigatórios:
  - `assets/videos/yoshi-video-alpha.webm` com `type="video/webm"`
  - `assets/videos/yoshi-video-min.mp4` com `type="video/mp4"`
- Flags obrigatórias:
  - `autoplay`
  - `loop`
  - `muted`
  - `playsinline`
  - sem `controls`
- Orientação: espelhar horizontalmente via CSS.
- Observação: o `.webm` vem primeiro por ter canal alpha.

### Planeta — centro/baixo, girando

- Uso: planeta grande na base da Hero.
- Elemento: `<video>` com dois sources.
- Sources obrigatórios:
  - `assets/videos/planet-3d-alpha.webm` com `type="video/webm"`
  - `assets/videos/planet-3d-min.mp4` com `type="video/mp4"`
- Flags obrigatórias:
  - `autoplay`
  - `loop`
  - `muted`
  - `playsinline`
  - sem `controls`
- Observação: o `.webm` vem primeiro por ter canal alpha.

### Lumas / estrelas decorativas — 3 unidades

- Uso: estrelas decorativas posicionadas conforme o print.
- Elemento: `<img>`.
- Arquivo obrigatório:
  - `assets/images/estrela-min.webp`
- Reutilização:
  - 1 imagem para a luma esquerda.
  - 1 imagem para a luma direita.
  - 1 imagem para a luma central inferior.
- Contagem final obrigatória: 3 imagens renderizadas.

---

## 7) Suposições a confirmar

- O subtítulo abaixo do título está ilegível no print. Deve permanecer como `[texto a confirmar]` até validação no Figma ou em referência textual confiável.
- O microtexto inferior próximo ao planeta está ilegível. Deve permanecer como `[texto a confirmar]` até validação.
- O pequeno ícone circular dentro do CTA é visível, mas o símbolo interno não está claro no print. Confirmar se é play, seta ou outro ícone.
- A posição exata em pixels de Mario, Yoshi, planeta e lumas deve ser ajustada visualmente contra o print, pois o print fornece referência visual, não medidas exatas.
- O tamanho exato do planeta e o ponto de corte inferior devem ser confirmados comparando com a viewport real do layout.
- A cor exata do fundo do badge/pill deve ser aproximada somente com tokens existentes; não criar cor nova por amostragem do print.

---

## 8) Responsividade

### Desktop

- Manter composição próxima ao print:
  - título centralizado;
  - Mario no alto à esquerda;
  - Yoshi no alto à direita;
  - planeta grande na base central;
  - 3 lumas distribuídas conforme o print.
- O conteúdo textual deve permanecer acima das mídias e legível.

### Tablet

- Reduzir proporcionalmente Mario, Yoshi, planeta e lumas.
- Preservar a hierarquia visual: título e CTA continuam sendo foco principal.
- Evitar que os personagens cubram o título.

### Mobile

- Coluna central obrigatória para o conteúdo textual.
- Reduzir ou reposicionar personagens para evitar overflow horizontal.
- Manter exatamente os mesmos tipos de elementos do inventário; não adicionar nem remover elementos sem decisão explícita.
- Caso algum elemento precise ser ocultado por limitação extrema de espaço, documentar como ajuste responsivo e confirmar antes de implementar.

---

## 9) Comportamentos — estático + pronto para parallax

### Estado estático obrigatório

- Hero deve renderizar corretamente sem depender de scroll.
- Vídeos devem iniciar automaticamente, em loop, sem som e sem controles.
- Lumas são decorativas e não interativas.
- CTA é o único elemento clicável da Hero.

### Pronto para parallax

- Estrutura de classes deve permitir parallax futuro por camada:
  - personagens;
  - planeta;
  - lumas;
  - conteúdo textual.
- Não implementar parallax neste spec se não estiver solicitado no momento.
- Caso seja implementado depois, usar somente `transform` e `opacity`, respeitando as regras de performance do `DESIGN.md`.

---

## 10) Checklist de implementação

- [ ] Confirmar que `docs/hero-section-spec.md` foi lido antes de implementar.
- [ ] Confirmar os paths dos `<source>` antes de testar.
- [ ] Inserir somente os elementos listados no inventário visual.
- [ ] Usar os vídeos obrigatórios de Mario, Yoshi e planeta com `.webm` primeiro e `.mp4` como fallback.
- [ ] Garantir `autoplay`, `loop`, `muted`, `playsinline` e ausência de `controls` em todos os vídeos.
- [ ] Usar exatamente 3 imagens `assets/images/estrela-min.webp` para as lumas.
- [ ] Espelhar o Yoshi horizontalmente via CSS.
- [ ] Usar apenas tokens do `DESIGN.md` e do `:root` existente.
- [ ] Não adicionar elementos clássicos de Hero que não aparecem no print.
- [ ] Não adicionar contagem regressiva, logos extras, labels extras ou segundo CTA.
- [ ] Marcar textos ilegíveis como `[texto a confirmar]` até validação.
- [ ] Garantir que mídias decorativas não capturem clique.
- [ ] Garantir que o CTA continue clicável.
- [ ] Verificar responsividade sem overflow horizontal.
- [ ] Testar no navegador se os vídeos com alpha carregam corretamente.
- [ ] Verificar fallback `.mp4` em navegador sem suporte adequado a `.webm` com alpha.

---

## 11) Critérios de aceitação visuais

A implementação será aceita quando:

- A Hero reproduzir visualmente a composição do print anexado.
- O inventário final da seção contiver somente:
  - 1 badge superior;
  - 1 título central em duas linhas;
  - 1 subtítulo abaixo do título;
  - 1 CTA `Assistir Trailer`;
  - 1 microtexto inferior, se confirmado;
  - 1 vídeo do Mario à esquerda;
  - 1 vídeo do Yoshi à direita;
  - 1 vídeo do planeta na base central;
  - 3 lumas usando `assets/images/estrela-min.webp`.
- O título `Super Mario Galaxy: O Filme` estiver centralizado e legível.
- A linha `Galaxy: O Filme` usar o destaque amarelo baseado em token de Star Power.
- O CTA roxo estiver centralizado abaixo do subtítulo.
- Mario, Yoshi e planeta usarem os assets obrigatórios e não imagens alternativas.
- O Yoshi aparecer espelhado horizontalmente.
- As lumas aparecerem em exatamente 3 posições, sem duplicações extras.
- O planeta ficar na parte inferior central, com corte visual próximo ao print.
- O fundo permanecer cósmico escuro e compatível com o starfield global.
- Nenhum elemento fora do print for adicionado.
- Não houver erro de console relacionado aos vídeos, imagens ou paths.

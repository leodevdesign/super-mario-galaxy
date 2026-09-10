# Starfield Section Spec

## 1) Objetivo

Criar um background cósmico em `<canvas id="starfield">` para sustentar visualmente a atmosfera do projeto Super Mario Galaxy sem competir com o conteúdo principal da página.

O canvas deve ser:

- **Full-screen:** ocupar toda a viewport, independentemente da altura das seções.
- **Global:** funcionar como camada visual fixa por trás da interface e do conteúdo editorial.
- **Não interativo:** não deve capturar clique, hover, scroll, foco ou qualquer evento de ponteiro.
- **Decorativo:** deve ser invisível para leitores de tela com `aria-hidden="true"`.
- **Performático:** animações devem acontecer no canvas e evitar propriedades de layout.
- **Coerente com o DESIGN.md:** manter brilho controlado, alto contraste e atmosfera cósmica cinematográfica.

O starfield precisa reforçar a sensação de espaço profundo, com estrelas, meteoros e nebulosas suaves, respeitando densidade visual equilibrada e motion discreto.

---

## 2) HTML — posição do canvas

O elemento `<canvas id="starfield" aria-hidden="true"></canvas>` deve entrar no `index.html` logo após a abertura do `<body>`.

A posição recomendada é antes de qualquer conteúdo estrutural da página, incluindo header, navegação flutuante, hero e seções principais.

Motivo:

- Garante que o canvas seja carregado como camada base global.
- Evita que ele fique preso a uma seção específica.
- Facilita o controle por CSS com `position: fixed`.
- Mantém a navegação, hero e demais conteúdos acima do background.

O canvas não deve ser colocado dentro do hero, dentro de uma section ou dentro de containers de layout, porque ele não pertence ao fluxo editorial da página.

---

## 3) CSS — `#starfield`

O seletor `#starfield` deve definir o canvas como camada fixa de fundo.

Requisitos visuais e estruturais:

- `position: fixed` para permanecer preso à viewport.
- `inset: 0` para cobrir toda a tela.
- `width: 100%` e `height: 100%` para ocupar a viewport visual.
- `z-index` abaixo do conteúdo principal e abaixo da navegação flutuante.
- `pointer-events: none` para não bloquear interações.
- Camada decorativa, sem foco e sem comportamento interativo.
- O fundo base deve respeitar os tokens cósmicos existentes, sem introduzir novas cores fora do `:root` e do `DESIGN.md`.

Critério de empilhamento:

- O canvas deve ficar acima do background base do `body`, se existir.
- O canvas deve ficar abaixo de todo conteúdo interativo.
- A navegação flutuante deve continuar acima de tudo, preservando seu `z-index` atual.

---

## 4) JS — contrato de `initStarfield()`

A função `initStarfield()` deve inicializar, animar e limpar o canvas de forma previsível.

### Responsabilidades obrigatórias

- Encontrar o elemento `#starfield` no DOM.
- Encerrar sem erro caso o canvas não exista.
- Ler o contexto 2D do canvas.
- Ajustar o canvas ao tamanho da viewport.
- Considerar `devicePixelRatio` para manter nitidez em telas retina.
- Recalcular dimensões e distribuição visual no `resize`.
- Criar e manter arrays internos para estrelas, meteoros e nebulosas.
- Rodar um loop com `requestAnimationFrame`.
- Limpar/redesenhar o canvas a cada frame.
- Expor ou executar rotina de cleanup para remover listeners e cancelar o frame ativo quando necessário.

### Resize

No resize, o canvas deve:

- Atualizar largura e altura reais considerando `devicePixelRatio`.
- Manter o tamanho visual em CSS alinhado à viewport.
- Recalcular a quantidade de estrelas com base na nova área da tela.
- Preservar a proporção visual da densidade em desktop, tablet e mobile.

### Loop

O loop deve:

- Animar estrelas, meteoros e efeitos sutis sem travar o scroll.
- Usar tempo delta ou timestamps do `requestAnimationFrame` para manter consistência.
- Evitar animações que dependam de propriedades de layout.
- Manter motion fluido e discreto, alinhado ao nível de motion 6/10 do DESIGN.md.

### Cleanup

A rotina de limpeza deve:

- Cancelar o `requestAnimationFrame` ativo.
- Remover listener de `resize`.
- Evitar múltiplas instâncias simultâneas caso `initStarfield()` seja chamado novamente.

---

## 5) Parâmetros visuais

### Direção visual geral

O canvas starfield deve entregar uma camada espacial cinematográfica, com brilho controlado, contraste alto e densidade equilibrada.

A atmosfera deve seguir os princípios do projeto:

- Fundo profundo.
- Estrelas legíveis, mas não poluídas.
- Acentos cósmicos discretos.
- Motion contínuo e suave.
- Nebulosas presentes, porém menos saturadas.
- Meteoros mais frequentes, mantendo tamanho e velocidade atuais.

### Estrelas

A quantidade total de estrelas deve ser dobrada em relação à implementação atual.

A variação de tamanho deve aumentar levemente:

- Mais estrelas pequenas no fundo.
- Algumas estrelas maiores em primeiro plano.
- As estrelas grandes devem continuar sendo minoria.
- As maiores estrelas devem receber pulso sutil de brilho.

Critério para estrelas grandes:

- Considerar o top 10% por tamanho como estrelas grandes.
- Essas estrelas devem oscilar brilho em aproximadamente ±15%.
- Cada estrela grande deve ter período aleatório entre 2 e 5 segundos.
- O pulso deve ser sutil, sem criar efeito piscante agressivo.

O canvas starfield precisa fazer visualmente:

- Criar profundidade com estrelas pequenas e numerosas no fundo.
- Destacar algumas estrelas maiores em primeiro plano.
- Aplicar variação natural de posição, tamanho e opacidade.
- Manter brilho controlado para preservar legibilidade do conteúdo.
- Animar um pulso sutil somente nas estrelas grandes.
- Reagir ao resize mantendo densidade proporcional à viewport.
- Preservar o clima cósmico sem competir com hero, cards, botões ou navegação.

Fica fora do canvas starfield:

- Textos, títulos, labels ou qualquer UI.
- Interações de mouse, clique, hover ou foco.
- Partículas ligadas a botões, cards ou componentes específicos.
- Controle de navegação, scroll reveal ou estado ativo de seção.
- Gradientes novos fora dos tokens existentes.
- Nebulosas ou efeitos que cubram o conteúdo principal.
- Glows agressivos em elementos de interface.

### Meteoros

A incidência de meteoros deve aumentar.

Estado atual informado:

- Aproximadamente 1 meteoro a cada 8 segundos.

Novo comportamento desejado:

- Aproximadamente 1 meteoro a cada 2–3 segundos.
- Manter tamanho atual dos meteoros.
- Manter velocidade atual dos meteoros.
- Não transformar os meteoros em chuva intensa.
- O efeito deve continuar pontual, elegante e cinematográfico.

A frequência maior deve ser perceptível, mas sem quebrar a densidade visual equilibrada do projeto.

### Nebulosas

As nebulosas não devem ter o blur alterado.

Ajustes necessários:

- Reduzir a opacidade pela metade em relação à implementação atual.
- Deslocar o tom visual para `--cosmic-purple`, quando o projeto estiver usando os tokens canônicos do DESIGN.md.
- Quando a base estiver usando os tokens reais do `style.css`, alinhar a intenção visual aos tokens de nebula existentes, sem introduzir nova cor.
- Manter o blur atual.
- Evitar saturação excessiva.
- Não aumentar quantidade, escala ou presença das nebulosas além do necessário.

O resultado esperado é uma nebulosa mais sutil, fria e integrada ao fundo, sem parecer uma mancha saturada por cima da interface.

### Tokens e cores permitidas

Não devem ser criadas cores novas fora do `:root` e do DESIGN.md.

Preferências de alinhamento:

- Fundo profundo: tokens de deep space / cosmic deep existentes.
- Estrelas: tokens de starlight e star power existentes.
- Meteoros: tokens de star power, luma/cyan ou comet já existentes, conforme a implementação atual.
- Nebulosas: `--cosmic-purple` no modelo canônico do DESIGN.md ou os tokens `--color-nebula-*` já presentes no CSS real.

Não usar:

- Branco puro fora dos tokens definidos.
- Cinzas novos.
- Gradientes inventados fora da paleta cósmica.
- Glows agressivos que destoem do brilho controlado do design system.

---

## 6) Checklist e critérios de aceitação

### Checklist de implementação

- [ ] `canvas#starfield` inserido logo após a abertura do `<body>` no `index.html`.
- [ ] Canvas marcado com `aria-hidden="true"`.
- [ ] `#starfield` com posição fixa e cobrindo toda a viewport.
- [ ] `#starfield` com `pointer-events: none`.
- [ ] `#starfield` posicionado atrás do conteúdo e abaixo da navegação flutuante.
- [ ] `initStarfield()` encerra sem erro se o canvas não existir.
- [ ] `initStarfield()` considera `devicePixelRatio`.
- [ ] Canvas redimensiona corretamente no resize.
- [ ] Loop usa `requestAnimationFrame`.
- [ ] Cleanup remove listener de resize e cancela o frame ativo.
- [ ] Quantidade de estrelas dobrada em relação ao estado atual.
- [ ] Variação de tamanhos levemente ampliada.
- [ ] Mais estrelas pequenas no fundo.
- [ ] Algumas estrelas maiores em primeiro plano.
- [ ] Top 10% das estrelas por tamanho com pulso sutil.
- [ ] Pulso de estrelas grandes com brilho oscilando cerca de ±15%.
- [ ] Período aleatório de pulso entre 2 e 5 segundos por estrela grande.
- [ ] Meteoros aparecem em média a cada 2–3 segundos.
- [ ] Meteoros mantêm tamanho e velocidade atuais.
- [ ] Nebulosas com opacidade reduzida pela metade.
- [ ] Nebulosas deslocadas visualmente para roxo cósmico permitido pelos tokens.
- [ ] Blur atual das nebulosas preservado.
- [ ] Nenhuma cor nova introduzida fora do `:root` e do DESIGN.md.
- [ ] Nenhuma mudança estrutural em hero, nav, cards ou botões.

### Critérios de aceitação visual

- O fundo deve parecer mais estrelado do que a versão atual, sem ficar poluído.
- Os meteoros devem ser notados com mais frequência, mas ainda parecer ocasionais.
- As nebulosas devem parecer menos saturadas e menos dominantes.
- As estrelas grandes devem ter vida sutil, sem efeito de pisca-pisca.
- O conteúdo da página deve continuar com leitura confortável.
- A navegação flutuante deve continuar visível, clicável e acima do canvas.
- O canvas não deve interferir em scroll, cliques, foco, hover ou acessibilidade.
- Em mobile, não deve haver overflow horizontal causado pelo canvas.
- Em telas retina, as estrelas devem permanecer nítidas.
- O motion deve continuar discreto, fluido e performático.

### Critérios de aceitação técnica

- A página não deve lançar erro no console se `#starfield` não existir.
- Não deve haver múltiplos loops ativos após reinicialização.
- O resize não deve degradar performance perceptivelmente.
- A animação deve ser feita no canvas, sem manipular layout de elementos do DOM.
- A implementação deve continuar compatível com os tokens existentes do projeto.

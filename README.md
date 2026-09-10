# 🌌 Super Mario Galaxy: O Filme — Experiência Web Cinematográfica

[![Acessar Projeto Online](https://img.shields.io/badge/Acessar_Projeto_Online-GitHub_Pages-FBE04B?style=for-the-badge&logo=google-chrome&logoColor=black)](https://leodevdesign.github.io/super-mario-galaxy/)
[![Status](https://img.shields.io/badge/Status-Online_%26_Deploy_Ativo-22c55e?style=for-the-badge&logo=githubpages&logoColor=white)](https://leodevdesign.github.io/super-mario-galaxy/)

> 🚀 **Live Demo:** Experimente a aplicação ao vivo em:  
> 👉 **[https://leodevdesign.github.io/super-mario-galaxy/](https://leodevdesign.github.io/super-mario-galaxy/)**

Uma landing page imersiva, cinematográfica e de alta performance criada para celebrar o universo de **Super Mario Galaxy: O Filme**. O projeto une renderização 3D em tempo real com **Three.js**, animações orientadas a scroll com **GSAP ScrollTrigger**, ambientação espacial com múltiplos sistemas de partículas e design responsivo com estética cósmica inspirada nos clássicos da Nintendo.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP_3.12-88CE02?style=for-the-badge&logo=greensock&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

---

## 🎮 Visão Geral e Conceito

O objetivo deste projeto foi transformar a experiência de um site promocional de cinema em uma jornada interativa pelo cosmos. Cada dobra da página foi concebida como uma cena cinematográfica que reage organicamente ao scroll do usuário, combinando profundidade visual, texturas PBR, iluminação dramática e efeitos sonoros/visuais característicos de Super Mario Galaxy.

---

## ✨ Recursos e Detalhamento de Cada Seção

### 1. 🪐 Hero Section — Planeta 3D & Profundidade Galáctica
- **Planeta 3D em Tempo Real com Three.js**: Substituição de vídeos pré-renderizados por uma esfera procedural 3D com texturas esféricas (color map, bump map de relevo e roughness map para especularidade). O planeta orbita continuamente em seu próprio eixo Y (`rotation.y += 0.01`) com shader Fresnel para reflexo atmosférico ciano.
- **Efeito de Zoom no Scroll**: Conectado ao `GSAP ScrollTrigger`, a câmera e a escala do planeta aumentam suavemente conforme a página é rolada, simulando uma aproximação de órbita.
- **Camada de Personagens com Transparência**: Mario e Yoshi em vídeos com canal alfa transparente (.webm / .mp4), posicionados estrategicamente nas laterais com z-index sobreposto ao planeta e paralaxe sutil.
- **Lumas Flutuantes**: Estrelas Lumas animadas com keyframes orgânicos de gravidade zero e brilho estelar.
- **Botão CTA Cósmico**: Botão magnético com animação contínua de varredura de luz (*light sweep*), sombra volumétrica púrpura e ação direta de scroll até o trailer com reprodução com som.

### 2. 📜 Letreiro Cósmico Infinito (Marquee)
- **Faixa de Destaque Contínua**: Letreiro horizontal em roxo nebulosa (`#6B46C1`) com tipografia em caixa alta, listando os heróis, vilões e o lema da aventura.
- **Loop Infinito Sem Gaps**: Sequência duplicada com largura expandida que roda perfeitamente a 60 FPS com aceleração de hardware (`transform: translate3d`).

### 3. 👥 Seção de Personagens — Elenco do Cosmos
- **Fundo Cósmico de Nebulosa Profunda**: Pano de fundo com estrelas distantes e gradientes de vinheta superior e inferior, integrando perfeitamente a transição entre seções.
- **Paralaxe Diferencial no Scroll**: Cada um dos 6 personagens (Mario, Luigi, Peach, Rosalina, Yoshi e Bowser Jr.) possui curvas de velocidade e deslocamento distintas via `GSAP ScrollTrigger`, criando um efeito de diorama tridimensional.
- **Responsividade com Parallax Sutil no Mobile**: No smartphone, onde os personagens são dispostos verticalmente, cada card se move suavemente de forma independente ao entrar no campo de visão, sem prejudicar a leitura nem gerar overflow.

### 4. 🎬 Seção de Trailer Oficial — Cinema Galáctico
- **Player de Vídeo Customizado**: Moldura com gradiente luminoso cósmico de 4 cores (ciano, amarelo-estrela, roxo-nebulosa e vermelho-cometa).
- **Carregamento Assíncrono Inteligente (Lazy Load)**: O arquivo MP4 do trailer não sobrecarrega a página inicial; ele só é requisitado via `IntersectionObserver` quando o usuário se aproxima da seção (300px antes).
- **Autoplay em Looping Silencioso**: Inicia suavemente em loop sem som (obedecendo às políticas modernas dos navegadores) com botão central estelar para ativar o áudio e controles nativos completos.
- **Layout Adaptativo**: Otimizado tanto para telas ultra-wide quanto para celulares, evitando barras de rolagem horizontais e mantendo a proporção 16:9 perfeita.

### 5. ⏳ Seção de Estreia — Contagem Regressiva & Moldura Nebular
- **Moldura Cósmica com Nuvens Nebulares**: Quadro exclusivo com nebulosas coloridas nos 4 cantos (rosa, roxo, azul e laranja) e linhas de luz neon que emolduram a seção.
- **Fundo Mobile Dedicado (`fundo02-mobile.webp`)**: Versão portrait vertical exclusiva para smartphones que mantém as 4 nuvens perfeitamente enquadradas nos cantos da tela do celular sem cortes laterais.
- **Contador Regressivo em Tempo Real**: Cartões em estilo glassmorphism com desfoque de fundo (`backdrop-filter: blur(20px)`), relevo interno e animação de queda nos dígitos (`slide-down`) a cada segundo.
- **Layout Inteligente no Mobile**: Os 4 blocos (**DIAS**, **HORAS**, **MIN**, **SEG**) se alinham simetricamente em uma única linha no celular, com separadores dourados e leitura instantânea.

### 6. ⭐ Cursor Estelar & Rastro de Star Bits
- **Cursor Temático Super Mario Galaxy**: Ponteiro estelar celeste (*Star Pointer*) para navegação padrão e *Power Star* com olhinhos expressivos ao passar o mouse sobre botões, links e cards clicáveis.
- **Rastro de Poeira Estelar (Stardust Trail)**: Partículas e estrelas de 4 pontas douradas, cianos e brancas que flutuam e se dissipam suavemente ao mover o mouse (desativado automaticamente no mobile para preservar bateria e toques de tela).

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Finalidade |
|---|---|
| **HTML5 Semântico** | Estruturação acessível com tags semânticas, microdados e tags Open Graph / Twitter Card |
| **CSS3 Moderno** | Design tokens via `:root`, Flexbox, Grid, Glassmorphism, clamp() para tipografia fluida |
| **JavaScript (ES6+)** | Lógica de contagem regressiva, lazy load via IntersectionObserver, controle de áudio/vídeo |
| **Three.js (r128)** | Renderização WebGL do planeta 3D, mapeamento UV, iluminação ACESFilmic e rotação orbital |
| **GSAP & ScrollTrigger** | Animações orquestradas ao scroll, scrub de zoom e paralaxe diferencial de personagens |
| **Canvas 2D API** | Starfield interativo com estrelas cintilantes, meteoros dinâmicos e rastro de poeira estelar |
| **Node.js** | Servidor local HTTP leve com suporte a streaming de vídeo por chunks (`Range: bytes`) |

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado na máquina.

### Passo a passo

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/leodevdesign/super-mario-galaxy.git
   cd super-mario-galaxy
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   node server.js
   ```

3. **Acessar a aplicação:**
   Abra o seu navegador e acesse:
   ```
   http://localhost:3000
   ```

---

## 📱 Compartilhamento Social & Favicon

- **Favicon Dinâmico**: SVG da Luma Star com gradiente e núcleo luminoso.
- **Open Graph / WhatsApp / Twitter**: Banner oficial 16:9 em alta resolução (`assets/images/og-share.jpg`) para pré-visualizações ricas ao compartilhar o link em redes sociais e apps de mensagem.

---

## 👨‍💻 Créditos e Autoria

- **Desenvolvimento & Design:** [Next Automatik](https://nextautomatik.com)
- **Aviso Legal:** *Projeto conceitual desenvolvido para fins demonstrativos e de portfólio. Mario, Super Mario Galaxy e elementos correlatos são marcas registradas da Nintendo Co., Ltd.*

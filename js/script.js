/**
 * Preloader cinematográfico: Mario segue uma rota de Lumas e abre a Hero
 * com um clarão dourado. O encerramento espera o load real e uma duração
 * mínima para que a pequena narrativa nunca seja cortada pela metade.
 */
function initGalaxyPreloader() {
    const loader = document.getElementById('galaxy-loader');
    const mario = document.getElementById('galaxy-loader-mario');
    const grandLuma = document.getElementById('galaxy-loader-grand-luma');
    const trail = document.getElementById('galaxy-loader-trail');
    const percentage = document.getElementById('galaxy-loader-percentage');
    const progressLine = document.getElementById('galaxy-loader-progress-line');

    if (!loader) {
        document.body.classList.remove('preloader-active');
        document.documentElement.classList.remove('preloader-active');
        return;
    }

    if (typeof gsap === 'undefined') {
        percentage.textContent = '100';
        progressLine.style.transform = 'scaleX(1)';
        window.setTimeout(() => {
            loader.remove();
            document.body.classList.remove('preloader-active');
            document.documentElement.classList.remove('preloader-active');
        }, 500);
        return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lumas = Array.from(loader.querySelectorAll('.galaxy-loader__luma'));
    const litLumas = new Set();
    const progressState = { value: 0 };
    const flightState = { value: 0 };
    const startedAt = performance.now();
    const minimumDuration = reduceMotion ? 700 : 4300;
    let pageReady = document.readyState === 'complete';
    let flightComplete = reduceMotion;
    let finished = false;
    let lastParticleAt = 0;

    function setProgress(value) {
        const safeValue = Math.max(0, Math.min(100, Math.round(value)));
        percentage.textContent = String(safeValue).padStart(2, '0');
        gsap.set(progressLine, { scaleX: safeValue / 100 });

        lumas.forEach((luma, index) => {
            const threshold = ((index + 1) / lumas.length) * 90;
            if (safeValue >= threshold && !litLumas.has(index)) {
                litLumas.add(index);
                gsap.to(luma, {
                    autoAlpha: 1,
                    scale: 1,
                    filter: 'grayscale(0) brightness(1.15) drop-shadow(0 0 16px rgba(251,224,75,.95))',
                    duration: reduceMotion ? 0 : 0.42,
                    ease: 'back.out(2)'
                });
            }
        });
    }

    function spawnTrailParticle(x, y) {
        if (reduceMotion || !trail) return;
        const now = performance.now();
        if (now - lastParticleAt < 42) return;
        lastParticleAt = now;

        const particle = document.createElement('i');
        particle.className = 'galaxy-loader__trail-particle';
        const size = 2 + Math.random() * 5;
        const color = Math.random() > 0.45 ? '#FBE04B' : '#7AEAFF';
        particle.style.setProperty('--particle-size', `${size}px`);
        particle.style.setProperty('--particle-color', color);
        particle.style.left = `${x + (Math.random() - 0.5) * 42}px`;
        particle.style.top = `${y + (Math.random() - 0.5) * 32}px`;
        trail.appendChild(particle);

        gsap.fromTo(particle,
            { autoAlpha: 1, scale: 1 },
            {
                autoAlpha: 0,
                scale: 0.15,
                x: -45 - Math.random() * 55,
                y: (Math.random() - 0.5) * 45,
                duration: 0.7 + Math.random() * 0.55,
                ease: 'power2.out',
                onComplete: () => particle.remove()
            }
        );
    }

    function renderFlight() {
        const t = flightState.value;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const mobile = viewportWidth < 768;
        const p0 = { x: -0.14 * viewportWidth, y: mobile ? 0.72 * viewportHeight : 0.74 * viewportHeight };
        const p1 = { x: mobile ? 0.43 * viewportWidth : 0.43 * viewportWidth, y: mobile ? 0.13 * viewportHeight : 0.08 * viewportHeight };
        const p2 = { x: mobile ? 0.87 * viewportWidth : 0.88 * viewportWidth, y: mobile ? 0.42 * viewportHeight : 0.50 * viewportHeight };
        const inverse = 1 - t;
        const x = inverse * inverse * p0.x + 2 * inverse * t * p1.x + t * t * p2.x;
        const y = inverse * inverse * p0.y + 2 * inverse * t * p1.y + t * t * p2.y;
        const tangentX = 2 * inverse * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
        const tangentY = 2 * inverse * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
        const angle = Math.atan2(tangentY, tangentX) * 180 / Math.PI;
        const scale = t < 0.62 ? 0.62 + t * 0.72 : 1.07 - (t - 0.62) * 1.25;

        gsap.set(mario, {
            x: x - mario.offsetWidth * 0.5,
            y: y - mario.offsetHeight * 0.5,
            // Compensa a orientação vertical do recorte para o corpo navegar
            // para a direita enquanto ainda acompanha as mudanças da curva.
            rotation: angle * 0.55 + 55,
            scale: Math.max(0.48, scale)
        });
        spawnTrailParticle(x - mario.offsetWidth * 0.17, y + mario.offsetHeight * 0.08);
    }

    function finishPreloader() {
        if (finished || !pageReady || !flightComplete || performance.now() - startedAt < minimumDuration) return;
        finished = true;

        const flash = loader.querySelector('.galaxy-loader__flash');
        const orbits = loader.querySelectorAll('.galaxy-loader__orbit');
        gsap.killTweensOf([mario, grandLuma, ...orbits]);
        const finishTimeline = gsap.timeline({
            defaults: { ease: 'power3.inOut' },
            onComplete: () => {
                loader.remove();
                document.body.classList.remove('preloader-active');
                document.documentElement.classList.remove('preloader-active');
                window.dispatchEvent(new Event('resize'));
            }
        });

        finishTimeline
            .to(progressState, {
                value: 100,
                duration: reduceMotion ? 0 : 0.32,
                onUpdate: () => setProgress(progressState.value)
            })
            .to(mario, { scale: 0.12, autoAlpha: 0, duration: reduceMotion ? 0 : 0.42 }, '<')
            .to(grandLuma, {
                scale: 1.3,
                rotation: 8,
                filter: 'drop-shadow(0 0 30px #fff) drop-shadow(0 0 75px rgba(251,224,75,1))',
                duration: reduceMotion ? 0 : 0.5
            }, '<')
            .to(orbits, { scale: 1.45, autoAlpha: 0, duration: reduceMotion ? 0 : 0.45 }, '<')
            .to(flash, { autoAlpha: 1, scale: reduceMotion ? 20 : 190, duration: reduceMotion ? 0.12 : 0.72, ease: 'expo.in' }, '-=0.1')
            .to(loader, { autoAlpha: 0, duration: reduceMotion ? 0.18 : 0.55, ease: 'power2.out' }, '-=0.05');
    }

    function markPageReady() {
        pageReady = true;
        const remaining = Math.max(0, minimumDuration - (performance.now() - startedAt));
        window.setTimeout(finishPreloader, remaining);
    }

    gsap.set(mario, { autoAlpha: reduceMotion ? 0 : 1 });
    gsap.set('.galaxy-loader__copy > *', { autoAlpha: 0, y: 18 });
    gsap.set(grandLuma, { scale: 0.72, rotation: -6 });

    if (reduceMotion) {
        setProgress(100);
        markPageReady();
    } else {
        gsap.timeline()
            .to('.galaxy-loader__backdrop', { scale: 1, duration: 5.2, ease: 'sine.out' })
            .to('.galaxy-loader__copy > *', { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out' }, 0.18)
            .to(grandLuma, { scale: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.7)' }, 0.35)
            .to('.galaxy-loader__orbit--outer', { rotation: 338, duration: 8, repeat: -1, ease: 'none' }, 0)
            .to('.galaxy-loader__orbit--inner', { rotation: -329, duration: 6, repeat: -1, ease: 'none' }, 0);

        gsap.to(progressState, {
            value: 92,
            duration: 3.75,
            ease: 'power1.out',
            onUpdate: () => setProgress(progressState.value)
        });

        gsap.to(flightState, {
            value: 1,
            delay: 0.38,
            duration: 3.35,
            ease: 'power2.inOut',
            onUpdate: renderFlight,
            onComplete: () => {
                gsap.to(grandLuma, { scale: 1.07, duration: 0.55, repeat: -1, yoyo: true, ease: 'sine.inOut' });
                // Ao alcançar a Grand Luma, volta a encarar a câmera antes do clarão.
                gsap.to(mario, {
                    rotation: 0,
                    duration: 0.58,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        flightComplete = true;
                        gsap.to(mario, { y: '-=7', rotation: '+=2', duration: 0.7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
                        finishPreloader();
                    }
                });
            }
        });
    }

    window.addEventListener('load', markPageReady, { once: true });
    if (document.readyState === 'complete') markPageReady();
    window.setTimeout(() => {
        pageReady = true;
        finishPreloader();
    }, 12000);
}

/**
 * Inicializa a navegação flutuante com base no scroll
 * Threshold: 60% da altura do hero ou 360px como fallback
 */
function initFloatingNav() {
    const navShell = document.querySelector('.nav-floating-shell');
    const hero = document.getElementById('hero');
    const links = document.querySelectorAll('.nav-floating__link');
    const sectionIds = ['hero', 'personagens', 'trailers', 'estreia'];
    
    if (!navShell) return;

    const updateNav = () => {
        const threshold = hero ? hero.offsetHeight * 0.6 : 360;

        if (window.scrollY > threshold) {
            navShell.classList.add('visible');
        } else {
            navShell.classList.remove('visible');
        }

        // Atualiza link ativo
        const probeY = window.scrollY + window.innerHeight * 0.35;
        let currentSection = 'hero';

        for (const id of sectionIds) {
            const el = document.getElementById(id);
            if (el && el.offsetTop <= probeY) {
                currentSection = id;
            }
        }

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('is-active');
            } else {
                link.classList.remove('is-active');
            }
        });
    };

    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateNav);
    }, { passive: true });

    window.addEventListener('resize', updateNav);
    updateNav();
}

/**
 * Inicializa o fundo cósmico (Starfield) com canvas
 */
function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas || canvas.dataset.initialized) return;
    canvas.dataset.initialized = 'true';

    const ctx = canvas.getContext('2d');
    let width, height, dpr;
    let stars = [];
    let meteors = [];
    let rafId = null;

    // Configurações baseadas no spec
    const STAR_COUNT_FACTOR = 0.18;
    const METEOR_INTERVAL = 900; // Intervalo mais frequente para luzes dinâmicas
    let lastMeteorTime = 0;

    const METEOR_COLORS = [
        { main: 'rgba(75, 224, 251, ', head: '#A5F5FF' }, // Cosmic Cyan
        { main: 'rgba(251, 224, 75, ', head: '#FFF5A5' }, // Star Gold
        { main: 'rgba(244, 246, 250, ', head: '#FFFFFF' }, // Starlight White
        { main: 'rgba(183, 148, 244, ', head: '#E9D8FD' }, // Nebula Purple
    ];

    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.6 + 0.6;
            this.baseOpacity = Math.random() * 0.5 + 0.3;
            this.opacity = this.baseOpacity;
            
            // Movimento contínuo pelas estrelas (deriva cósmica suave)
            this.vx = (Math.random() - 0.5) * 0.28;
            this.vy = (Math.random() - 0.5) * 0.28;

            // Twinkle / cintilação
            this.twinkleSpeed = (Math.random() * 2.5 + 1.5) * 1000;
            this.twinkleOffset = Math.random() * Math.PI * 2;

            // Estrelas grandes / de destaque (Top 12%)
            this.isLarge = Math.random() > 0.88;
            if (this.isLarge) {
                this.size += Math.random() * 1.2;
                this.glowColor = Math.random() > 0.4 ? '#FBE04B' : '#5CE0D8';
            }
        }

        update(time) {
            // Movimentação suave contínua
            this.x += this.vx;
            this.y += this.vy;

            // Wrap-around contínuo nas bordas da tela
            if (this.x < -10) this.x = width + 10;
            if (this.x > width + 10) this.x = -10;
            if (this.y < -10) this.y = height + 10;
            if (this.y > height + 10) this.y = -10;

            // Cintilação suave
            const twinkle = Math.sin((time / this.twinkleSpeed) * Math.PI * 2 + this.twinkleOffset);
            this.opacity = this.baseOpacity * (0.65 + 0.35 * twinkle);
        }

        draw() {
            ctx.fillStyle = `rgba(244, 246, 250, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
            ctx.fill();

            if (this.isLarge) {
                ctx.shadowBlur = 6;
                ctx.shadowColor = this.glowColor;
            } else {
                ctx.shadowBlur = 0;
            }
        }
    }

    class Meteor {
        constructor() {
            this.reset();
        }

        reset() {
            this.active = false;
        }

        spawn() {
            // Pode surgir tanto do topo quanto da lateral esquerda/superior
            if (Math.random() > 0.3) {
                this.x = Math.random() * width;
                this.y = -30;
            } else {
                this.x = -30;
                this.y = Math.random() * (height * 0.5);
            }
            
            this.length = Math.random() * 100 + 70;
            this.speed = Math.random() * 10 + 16;
            this.angle = Math.PI / 4 + (Math.random() * 0.25 - 0.12);
            this.opacity = 1;
            this.active = true;

            const colorScheme = METEOR_COLORS[Math.floor(Math.random() * METEOR_COLORS.length)];
            this.colorMain = colorScheme.main;
            this.colorHead = colorScheme.head;
        }

        update() {
            if (!this.active) return;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.opacity -= 0.016;

            if (this.opacity <= 0 || this.x > width + 100 || this.y > height + 100) {
                this.active = false;
            }
        }

        draw() {
            if (!this.active) return;
            const grad = ctx.createLinearGradient(
                this.x, this.y, 
                this.x - Math.cos(this.angle) * this.length, 
                this.y - Math.sin(this.angle) * this.length
            );
            grad.addColorStop(0, `${this.colorMain}${this.opacity})`);
            grad.addColorStop(0.3, `${this.colorMain}${this.opacity * 0.6})`);
            grad.addColorStop(1, `${this.colorMain}0)`);

            // Rastro brilhante da estrela cadente
            ctx.save();
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2.2;
            ctx.lineCap = 'round';
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.colorHead;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x - Math.cos(this.angle) * this.length, 
                this.y - Math.sin(this.angle) * this.length
            );
            ctx.stroke();

            // Ponto de luz cintilante na cabeça do meteoro
            ctx.fillStyle = this.colorHead;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function resize() {
        dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // Gera estrelas baseado na área
        const count = Math.floor((width * height) / 1000 * STAR_COUNT_FACTOR);
        stars = Array.from({ length: count * 2 }, () => new Star());
        meteors = Array.from({ length: 8 }, () => new Meteor());
    }

    function drawNebulas() {
        // Nebulas sutis com pulso suave
        const centerX = width * 0.7;
        const centerY = height * 0.3;
        const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * 0.65);
        grad.addColorStop(0, 'rgba(107, 70, 193, 0.07)'); // Cosmic Purple
        grad.addColorStop(0.5, 'rgba(92, 224, 216, 0.03)'); // Cosmic Cyan hint
        grad.addColorStop(1, 'rgba(107, 70, 193, 0)');
        
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
    }

    function loop(time) {
        ctx.clearRect(0, 0, width, height);
        
        drawNebulas();

        stars.forEach(star => {
            star.update(time);
            star.draw();
        });

        // Spawn de meteoros dinâmico e contínuo (média a cada ~900ms)
        if (time - lastMeteorTime > METEOR_INTERVAL + (Math.random() * 600 - 300)) {
            const inactiveMeteor = meteors.find(m => !m.active);
            if (inactiveMeteor) {
                inactiveMeteor.spawn();
                lastMeteorTime = time;
                // Ocasionalmente lança um segundo meteoro duplo
                if (Math.random() > 0.7) {
                    const secondMeteor = meteors.find(m => !m.active);
                    if (secondMeteor) secondMeteor.spawn();
                }
            }
        }

        meteors.forEach(meteor => {
            meteor.update();
            meteor.draw();
        });

        rafId = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    resize();
    loop(0);

    // Rotina de cleanup
    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(rafId);
    };
}

/**
 * Inicializa o Planeta 3D procedural/texturizado com Three.js (img2threejs)
 * Substitui o vídeo anterior, girando continuamente no próprio eixo Y
 * e respondendo ao zoom de scroll com GSAP ScrollTrigger.
 */
function initPlanet3D() {
    const canvas = document.getElementById('planet-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0.35, 2.85);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputEncoding = THREE.sRGBEncoding;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.clientWidth || 1024;
        const h = canvas.clientHeight || 1024;
        const size = Math.min(w, h);
        renderer.setSize(size, size, false);
        renderer.setPixelRatio(dpr);
        camera.aspect = 1;
        camera.updateProjectionMatrix();
    }

    // Iluminação cósmica cinematográfica
    const ambientLight = new THREE.AmbientLight(0xdff7ff, 0.48);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff4dc, 1.32);
    sunLight.position.set(5, 6, 4);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x42cfff, 0.62);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Grupo do planeta (object)
    const object = new THREE.Group();
    scene.add(object);

    // Texturas PBR geradas a partir da imagem planeta-mario-galaxy.png
    const textureLoader = new THREE.TextureLoader();
    const colorMap = textureLoader.load('assets/images/planeta-texture-360-v2.png');
    colorMap.wrapS = THREE.RepeatWrapping;
    colorMap.wrapT = THREE.ClampToEdgeWrapping;
    colorMap.encoding = THREE.sRGBEncoding;
    colorMap.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    const bumpMap = textureLoader.load('assets/images/planeta-bump-360-v2.png');
    bumpMap.wrapS = THREE.RepeatWrapping;
    bumpMap.wrapT = THREE.ClampToEdgeWrapping;

    const roughMap = textureLoader.load('assets/images/planeta-roughness-360-v2.png');
    roughMap.wrapS = THREE.RepeatWrapping;
    roughMap.wrapT = THREE.ClampToEdgeWrapping;

    // 1. Esfera 3D do Planeta
    const planetGeo = new THREE.SphereGeometry(1, 96, 96);
    const planetMat = new THREE.MeshStandardMaterial({
        map: colorMap,
        bumpMap: bumpMap,
        bumpScale: 0.027,
        roughnessMap: roughMap,
        roughness: 0.62,
        metalness: 0.02,
    });
    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    object.add(planetMesh);

    // 2. Atmosfera em duas camadas: borda nítida + halo externo difuso.
    const atmosphereVertexShader = `
        varying vec3 vNormal;
        varying vec3 vViewDirection;
        void main() {
            vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vViewDirection = normalize(-viewPosition.xyz);
            gl_Position = projectionMatrix * viewPosition;
        }
    `;
    const atmosphereFragmentShader = `
        varying vec3 vNormal;
        varying vec3 vViewDirection;
        uniform vec3 glowColor;
        uniform float glowPower;
        uniform float glowIntensity;
        void main() {
            float fresnel = pow(1.0 - abs(dot(vNormal, vViewDirection)), glowPower);
            gl_FragColor = vec4(glowColor, fresnel * glowIntensity);
        }
    `;

    const rimGeo = new THREE.SphereGeometry(1.006, 96, 96);
    const rimMat = new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide,
        depthWrite: false,
        uniforms: {
            glowColor: { value: new THREE.Color(0x7aeaff) },
            glowPower: { value: 3.6 },
            glowIntensity: { value: 0.34 }
        },
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader
    });
    object.add(new THREE.Mesh(rimGeo, rimMat));

    const haloGeo = new THREE.SphereGeometry(1.026, 72, 72);
    const haloMat = rimMat.clone();
    haloMat.side = THREE.BackSide;
    haloMat.uniforms.glowColor.value = new THREE.Color(0x32c8ff);
    haloMat.uniforms.glowPower.value = 2.15;
    haloMat.uniforms.glowIntensity.value = 0.12;
    object.add(new THREE.Mesh(haloGeo, haloMat));

    // Leve inclinação axial para realismo cósmico
    object.rotation.z = 0.12;
    object.rotation.x = 0.08;

    window.addEventListener('resize', resize);
    resize();

    // Loop independente da taxa de quadros; uma volta leva cerca de 39 segundos.
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        object.rotation.y += Math.min(clock.getDelta(), 0.05) * 0.16;
        renderer.render(scene, camera);
    }

    animate();
}

/**
 * Animação de zoom do Planeta no scroll (GSAP ScrollTrigger)
 * Trazida do projeto original para permitir os testes de transição e escala.
 */
function initPlanetZoomAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const planet = document.querySelector('.hero-section__planet, .hero__planet');
    if (!planet) return;

    gsap.timeline({
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '+=100%',
            scrub: true,
        },
    }).fromTo(
        planet,
        {
            xPercent: -50,
            yPercent: 0,
            scale: 1,
            force3D: true,
            transformOrigin: '50% 100%',
        },
        {
            xPercent: -50,
            yPercent: 0,
            scale: 2.2,
            ease: 'none',
            duration: 1,
        },
        0
    );
}

/**
 * Animação de paralaxe suave e fade-out dos personagens do Hero (Mario e Yoshi).
 * Mario e Yoshi ficam com z-index: 10 na frente do planeta 3D (z-index: 1),
 * mantendo uma paralaxe sutil e perdendo opacidade gradativamente até 0
 * quando a rolagem atinge a seção seguinte (#marquee-personagens).
 */
function initHeroCharactersScrollAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const mario = document.querySelector('.hero-section__character--mario');
    const yoshi = document.querySelector('.hero-section__character--yoshi');
    const content = document.querySelector('.hero-section__content');

    if (!mario && !yoshi) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '+=100%',
            scrub: true,
        },
    });

    if (mario) {
        tl.to(
            mario,
            {
                y: '18vh',
                opacity: 0,
                ease: 'none',
                duration: 1,
            },
            0
        );
    }

    if (yoshi) {
        tl.to(
            yoshi,
            {
                y: '18vh',
                opacity: 0,
                ease: 'none',
                duration: 1,
            },
            0
        );
    }

    if (content) {
        tl.to(
            content,
            {
                opacity: 0,
                y: '-4vh',
                ease: 'none',
                duration: 0.65,
            },
            0
        );
    }
}

/**
 * Paralaxe suave dos 6 personagens na seção #personagens com GSAP ScrollTrigger
 */
function initPersonagensParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const section = document.getElementById('personagens');
    if (!section) return;

    if (
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
        return;
    }

    const parallaxConfigs = [
        { selector: '.personagem--mario', from: { x: -14, y: -42 }, to: { x: 22, y: 188 }, scrub: 0.8 },
        { selector: '.personagem--luigi', from: { x: 18, y: -28 }, to: { x: -32, y: 210 }, scrub: 3.3 },
        { selector: '.personagem--peach', from: { x: -8, y: -50 }, to: { x: 24, y: 164 }, scrub: 1.05 },
        { selector: '.personagem--rosalina', from: { x: -20, y: -24 }, to: { x: 36, y: 232 }, scrub: 1.45 },
        { selector: '.personagem--yoshi', from: { x: 14, y: -38 }, to: { x: -46, y: 176 }, scrub: 0.65 },
        { selector: '.personagem--bowser-jr', from: { x: -16, y: -18 }, to: { x: 30, y: 198 }, scrub: 1.15 },
    ];

    ScrollTrigger.matchMedia({
        '(min-width: 768px)': function () {
            parallaxConfigs.forEach((cfg) => {
                const el = document.querySelector(cfg.selector);
                if (!el) return;

                gsap.fromTo(
                    el,
                    {
                        x: cfg.from.x,
                        y: cfg.from.y,
                        force3D: true,
                    },
                    {
                        x: cfg.to.x,
                        y: cfg.to.y,
                        ease: 'none',
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: section,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: cfg.scrub,
                            invalidateOnRefresh: true,
                        },
                    }
                );
            });
        },
        '(max-width: 767.98px)': function () {
            const mobileConfigs = [
                { selector: '.personagem--mario', from: { x: -4, y: -10 }, to: { x: 5, y: 12 }, scrub: 0.8 },
                { selector: '.personagem--luigi', from: { x: 5, y: -8 }, to: { x: -5, y: 14 }, scrub: 1.0 },
                { selector: '.personagem--peach', from: { x: -4, y: -8 }, to: { x: 4, y: 10 }, scrub: 0.9 },
                { selector: '.personagem--rosalina', from: { x: 4, y: -10 }, to: { x: -5, y: 12 }, scrub: 1.1 },
                { selector: '.personagem--yoshi', from: { x: -5, y: -8 }, to: { x: 6, y: 12 }, scrub: 0.8 },
                { selector: '.personagem--bowser-jr', from: { x: 4, y: -6 }, to: { x: -4, y: 10 }, scrub: 1.0 },
            ];

            mobileConfigs.forEach((cfg) => {
                const el = document.querySelector(cfg.selector);
                if (!el) return;

                gsap.fromTo(
                    el,
                    {
                        x: cfg.from.x,
                        y: cfg.from.y,
                        force3D: true,
                    },
                    {
                        x: cfg.to.x,
                        y: cfg.to.y,
                        ease: 'none',
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 95%',
                            end: 'bottom 5%',
                            scrub: cfg.scrub,
                            invalidateOnRefresh: true,
                        },
                    }
                );
            });
        },
    });
}

/**
 * Interatividade da seção de trailers:
 * - Carregamento assíncrono do vídeo via IntersectionObserver (lazy load)
 * - Autoplay mutado em loop contínuo
 * - Botão de play overlay ativa/desativa o som
 * - CTA do Hero scrolla até o trailer e ativa o som
 */
function initTrailerInteraction() {
    const heroCta = document.querySelector('.hero-section__cta');
    const trailerSection = document.getElementById('trailers');
    const video = document.getElementById('trailer-video');
    const playOverlay = document.getElementById('trailer-play-btn');

    if (!video) return;

    let videoLoaded = false;

    // Lazy load: carrega o vídeo só quando a seção se aproxima do viewport
    function loadVideoSource() {
        if (videoLoaded) return;
        const src = video.dataset.src;
        if (!src) return;

        const source = document.createElement('source');
        source.src = src;
        source.type = 'video/mp4';
        video.appendChild(source);
        video.load();
        videoLoaded = true;

        // Tenta autoplay mutado após carregar
        video.addEventListener('canplay', () => {
            video.play().catch(() => {});
        }, { once: true });
    }

    // IntersectionObserver para carregar o vídeo quando a seção entra no viewport
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadVideoSource();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '300px 0px', // começa a carregar 300px antes de aparecer
            threshold: 0
        });

        observer.observe(trailerSection || video);
    } else {
        // Fallback: carrega direto
        loadVideoSource();
    }

    // Play overlay: clique ativa/desativa o som
    if (playOverlay) {
        playOverlay.addEventListener('click', () => {
            if (video.muted) {
                video.muted = false;
                video.controls = true;
                playOverlay.classList.add('is-hidden');
            } else {
                video.muted = true;
                video.controls = false;
                playOverlay.classList.remove('is-hidden');
            }
        });
    }

    // CTA do Hero scrolla até o trailer e ativa o som
    if (heroCta && trailerSection) {
        heroCta.addEventListener('click', (e) => {
            e.preventDefault();
            trailerSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                loadVideoSource();
                video.muted = false;
                video.controls = true;
                video.play().catch(() => {});
                if (playOverlay) playOverlay.classList.add('is-hidden');
            }, 800);
        });
    }
}

/**
 * Contador regressivo (#estreia) com animação suave de queda nos dígitos
 */
function initEstreiaCountdown() {
    if (!document.querySelector('#estreia .countdown-unit')) return;

    const ALVO_ESTREIA = new Date('2026-12-25T00:00:00').getTime();
    const UNIT_KEYS = ['dia', 'hor', 'min', 'seg'];
    const liveEl = document.getElementById('estreia-countdown-live');
    let intervalId = 0;

    const prefersReducedMotion = () => {
        return typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    function calcularRestante() {
        const agora = Date.now();
        const diff = Math.max(0, ALVO_ESTREIA - agora);
        return {
            dia: Math.floor(diff / 86400000),
            hor: Math.floor((diff % 86400000) / 3600000),
            min: Math.floor((diff % 3600000) / 60000),
            seg: Math.floor((diff % 60000) / 1000),
        };
    }

    function formatar(n, unit) {
        if (unit === 'dia') return String(n);
        return String(n).padStart(2, '0');
    }

    function elValorParaUnidade(unitKey) {
        const root = document.querySelector(`.countdown-unit[data-unit="${unitKey}"]`);
        if (!root) return null;
        return root.querySelector('.countdown-value');
    }

    function pintarValorEstatico(unitKey, formatted) {
        const el = elValorParaUnidade(unitKey);
        if (!el) return;
        el.classList.remove('countdown-value--drop');
        el.textContent = formatted;
    }

    function aplicarMudancaComDeslize(unitKey, formatted) {
        const el = elValorParaUnidade(unitKey);
        if (!el) return;

        el.classList.remove('countdown-value--drop');
        void el.offsetWidth; // trigger reflow
        el.textContent = formatted;
        el.classList.add('countdown-value--drop');

        const onEnd = (e) => {
            if (e.animationName !== 'countdown-slide-down') return;
            el.removeEventListener('animationend', onEnd);
            el.classList.remove('countdown-value--drop');
        };
        el.addEventListener('animationend', onEnd);
    }

    let valorAtual = calcularRestante();

    function atualizarAria(v) {
        if (!liveEl) return;
        liveEl.textContent = `Restam ${v.dia} dias, ${v.hor} horas, ${v.min} minutos e ${v.seg} segundos para a estreia de Super Mario Galaxy: O Filme.`;
    }

    function sincronizarTudo(v) {
        for (let i = 0; i < UNIT_KEYS.length; i++) {
            const key = UNIT_KEYS[i];
            pintarValorEstatico(key, formatar(v[key], key));
        }
        atualizarAria(v);
    }

    function tickContador() {
        if (Date.now() >= ALVO_ESTREIA) {
            sincronizarTudo({ dia: 0, hor: 0, min: 0, seg: 0 });
            if (intervalId) window.clearInterval(intervalId);
            return;
        }

        const novo = calcularRestante();
        for (let i = 0; i < UNIT_KEYS.length; i++) {
            const key = UNIT_KEYS[i];
            if (novo[key] !== valorAtual[key]) {
                const txt = formatar(novo[key], key);
                if (prefersReducedMotion()) {
                    pintarValorEstatico(key, txt);
                } else {
                    aplicarMudancaComDeslize(key, txt);
                }
                valorAtual[key] = novo[key];
            }
        }
    }

    sincronizarTudo(valorAtual);
    intervalId = window.setInterval(tickContador, 1000);

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            valorAtual = calcularRestante();
            sincronizarTudo(valorAtual);
        }
    });
}

/**
 * Parallax da Seção 4 (#estreia) emergindo de trás da Seção 3 (#trailers) com GSAP ScrollTrigger
 */
function initEstreiaParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const estreia = document.getElementById('estreia');
    const estreiaBg = document.querySelector('.estreia__bg');
    const estreiaContainer = document.querySelector('.estreia__container');
    const stars = document.querySelectorAll('.estreia__star');

    if (!estreia) return;

    if (
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
        return;
    }

    // Parallax de revelação: a Seção 4 (fundo 02 e conteúdo) emerge por trás da Seção 3
    if (estreiaBg) {
        gsap.fromTo(
            estreiaBg,
            {
                yPercent: -20,
                scale: 1.08,
            },
            {
                yPercent: 0,
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: estreia,
                    start: 'top bottom',
                    end: 'top 15%',
                    scrub: 1.2,
                },
            }
        );
    }

    if (estreiaContainer) {
        gsap.fromTo(
            estreiaContainer,
            {
                y: -90,
                opacity: 0.65,
            },
            {
                y: 0,
                opacity: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: estreia,
                    start: 'top bottom',
                    end: 'top 20%',
                    scrub: 0.9,
                },
            }
        );
    }

    // Movimentação suave diferencial nas estrelas decorativas
    stars.forEach((star, index) => {
        const offset = (index % 2 === 0 ? 1 : -1) * (35 + index * 12);
        gsap.fromTo(
            star,
            { y: -60 - offset },
            {
                y: offset,
                ease: 'none',
                scrollTrigger: {
                    trigger: estreia,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.4,
                },
            }
        );
    });
}

/**
 * Efeito de rastro cósmico de poeira estelar (Star Bits / Stardust) no cursor
 * Inspirado nos Star Bits cintilantes de Super Mario Galaxy.
 */
function initCursorStardust() {
    if (typeof window === 'undefined') return;

    // Cria o canvas overlay para as partículas do cursor
    let canvas = document.getElementById('cursor-trail-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'cursor-trail-canvas';
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:999999;';
        document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const particles = [];
    const MAX_PARTICLES = 60;
    const COLORS = [
        '#FFE600', // Star Gold
        '#FFF5A5', // Bright Starlight
        '#00F0FF', // Cosmic Cyan
        '#A5F5FF', // Bright Luma Cyan
        '#FF64B4', // Peach Pink
        '#C084FC', // Nebula Purple
        '#FFFFFF'  // Pure White
    ];

    let lastX = null;
    let lastY = null;
    let animId = null;

    class StardustParticle {
        constructor(x, y) {
            this.x = x + (Math.random() - 0.5) * 8;
            this.y = y + (Math.random() - 0.5) * 8;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            // Partículas nítidas e visíveis
            this.baseSize = Math.random() * 5 + 4; // 4px a 9px
            this.maxLife = Math.random() * 35 + 30; // ~65 frames (~1.1s)
            this.life = this.maxLife;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5 + 0.35; // flutuação suave para baixo
            this.isStar = Math.random() > 0.4;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.16;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotSpeed;
            this.life--;
            return this.life > 0;
        }

        draw(c, scale) {
            const progress = this.life / this.maxLife;
            const alpha = Math.sin(progress * Math.PI * 0.5);
            const size = this.baseSize * Math.max(0.2, progress) * scale;

            c.save();
            c.translate(this.x * scale, this.y * scale);
            c.rotate(this.rotation);
            c.fillStyle = this.color;
            c.globalAlpha = Math.min(1, alpha * 1.25);
            c.shadowColor = this.color;
            c.shadowBlur = 9 * scale;

            if (this.isStar) {
                // Estrela diamante de 4 pontas estilo Super Mario Galaxy
                c.beginPath();
                c.moveTo(0, -size * 1.8);
                c.lineTo(size * 0.45, 0);
                c.lineTo(0, size * 1.8);
                c.lineTo(-size * 0.45, 0);
                c.closePath();
                c.fill();

                // Núcleo central brilhante branco
                c.fillStyle = '#FFFFFF';
                c.shadowBlur = 0;
                c.beginPath();
                c.arc(0, 0, size * 0.35, 0, Math.PI * 2);
                c.fill();
            } else {
                // Gema cósmica / Star Bit esférica com brilho
                c.beginPath();
                c.arc(0, 0, size * 0.9, 0, Math.PI * 2);
                c.fill();

                // Brilho interno
                c.fillStyle = '#FFFFFF';
                c.shadowBlur = 0;
                c.beginPath();
                c.arc(-size * 0.25, -size * 0.25, size * 0.3, 0, Math.PI * 2);
                c.fill();
            }

            c.restore();
        }
    }

    function renderLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            if (!p.update()) {
                particles.splice(i, 1);
            } else {
                p.draw(ctx, dpr);
            }
        }

        if (particles.length > 0) {
            animId = requestAnimationFrame(renderLoop);
        } else {
            animId = null;
        }
    }

    function spawnParticles(x, y, count = 2) {
        for (let i = 0; i < count; i++) {
            if (particles.length < MAX_PARTICLES) {
                particles.push(new StardustParticle(x, y));
            }
        }

        if (!animId) {
            animId = requestAnimationFrame(renderLoop);
        }
    }

    // Escuta movimento do mouse
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        if (lastX === null || Math.hypot(x - lastX, y - lastY) > 2) {
            spawnParticles(x, y, 2);
            lastX = x;
            lastY = y;
        }
    }, { passive: true });

    // Explosão suave de estrelinhas ao clicar
    window.addEventListener('click', (e) => {
        spawnParticles(e.clientX, e.clientY, 8);
    }, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
    initGalaxyPreloader();
    initFloatingNav();
    initStarfield();
    initPlanet3D();
    initPlanetZoomAnimation();
    initHeroCharactersScrollAnimation();
    initPersonagensParallax();
    initTrailerInteraction();
    initEstreiaCountdown();
    initEstreiaParallax();
    initCursorStardust();
});

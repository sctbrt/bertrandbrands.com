/**
 * Dot Grid Background Animation — About Page
 * Canvas-based organic radial wave pattern
 * Ported from scottbertrand.com
 */
(function() {
    const canvas = document.getElementById('dotWaveCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mobile detection
    const isMobile = window.innerWidth <= 640;

    // Configuration - radial waves like ripples in water
    const config = {
        dotSpacing: isMobile ? 28 : 22,
        dotRadius: isMobile ? 1.8 : 2.0,
        waveSources: [
            { x: 0.25, y: 0.35, amplitude: 5, wavelength: 140, speed: 0.028, phase: 0 },
            { x: 0.75, y: 0.65, amplitude: 4.5, wavelength: 170, speed: 0.024, phase: Math.PI * 0.6 },
            { x: 0.5, y: 0.2, amplitude: 3.5, wavelength: 200, speed: 0.020, phase: Math.PI * 1.2 }
        ],
        breathingWave: {
            amplitude: 0.15,
            speed: 0.008
        },
        horizontalFactor: 0.3,
        sizeVariation: 0.5,
        opacityVariation: 0.35,
        opacity: {
            light: isMobile ? 0.27 : 0.32,
            dark: isMobile ? 0.18 : 0.22
        }
    };

    function softWave(t) {
        const sin = Math.sin(t * Math.PI * 2);
        return sin * (1 - 0.15 * sin * sin);
    }

    let animationId = null;
    let centerX, centerY;
    let lastFrameTime = 0;

    const TARGET_FPS = isMobile ? 30 : 60;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    function isDarkMode() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    function getDotColor(opacityMod = 1) {
        const dark = isDarkMode();
        const baseOpacity = dark ? config.opacity.dark : config.opacity.light;
        const opacity = baseOpacity * opacityMod;
        return dark
            ? `rgba(245, 158, 11, ${opacity})`
            : `rgba(217, 119, 6, ${opacity})`;
    }

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        centerX = window.innerWidth / 2;
        centerY = window.innerHeight / 2;
    }

    function draw(timestamp) {
        if (isMobile && lastFrameTime) {
            const elapsed = timestamp - lastFrameTime;
            if (elapsed < FRAME_INTERVAL) {
                animationId = requestAnimationFrame(draw);
                return;
            }
        }
        lastFrameTime = timestamp;

        const time = timestamp * 0.001;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const MAX_DOTS = 2500;
        const viewportArea = window.innerWidth * window.innerHeight;
        const baseSpacing = config.dotSpacing;
        const minSpacingForLimit = Math.sqrt(viewportArea / MAX_DOTS);
        const spacing = Math.max(baseSpacing, minSpacingForLimit);

        const cols = Math.ceil(window.innerWidth / spacing) + 2;
        const rows = Math.ceil(window.innerHeight / spacing) + 2;
        const offsetX = (window.innerWidth % spacing) / 2;
        const offsetY = (window.innerHeight % spacing) / 2;

        const dotsByOpacity = new Map();

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const baseX = col * spacing + offsetX;
                const baseY = row * spacing + offsetY;

                let x = baseX;
                let y = baseY;
                let radius = config.dotRadius;
                let opacityMod = 1;

                if (!reducedMotion) {
                    let totalWaveY = 0;
                    let totalWaveX = 0;
                    let maxIntensity = 0;

                    config.waveSources.forEach(source => {
                        const sourceX = source.x * window.innerWidth;
                        const sourceY = source.y * window.innerHeight;
                        const dx = baseX - sourceX;
                        const dy = baseY - sourceY;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        const wavePhase = (distance / source.wavelength) - (time * source.speed * 10) + source.phase;
                        const waveValue = softWave(wavePhase);
                        const falloff = Math.exp(-distance / 700);
                        const contribution = waveValue * source.amplitude * falloff;

                        totalWaveY += contribution;

                        if (distance > 1) {
                            const normalX = dx / distance;
                            totalWaveX += contribution * normalX * config.horizontalFactor;
                        }

                        const intensity = Math.abs(waveValue) * falloff;
                        if (intensity > maxIntensity) maxIntensity = intensity;
                    });

                    x += totalWaveX;
                    y += totalWaveY;

                    const breathPhase = time * config.breathingWave.speed * 10;
                    const breathValue = Math.sin(breathPhase * Math.PI * 2);
                    const breathScale = 1 + breathValue * config.breathingWave.amplitude;

                    const sizeBoost = 1 + maxIntensity * 2;
                    radius = config.dotRadius * breathScale * (1 + (totalWaveY / 10) * config.sizeVariation * sizeBoost);
                    radius = Math.max(radius, config.dotRadius * 0.5);

                    const displacement = Math.sqrt(totalWaveX * totalWaveX + totalWaveY * totalWaveY);
                    opacityMod = 1 - (displacement / 15) * config.opacityVariation;
                    opacityMod = Math.max(opacityMod, 0.5);
                }

                const opacityKey = Math.round(opacityMod * 20) / 20;
                if (!dotsByOpacity.has(opacityKey)) {
                    dotsByOpacity.set(opacityKey, []);
                }
                dotsByOpacity.get(opacityKey).push({ x, y, radius });
            }
        }

        dotsByOpacity.forEach((dots, opacityMod) => {
            ctx.fillStyle = getDotColor(opacityMod);
            ctx.beginPath();
            dots.forEach(dot => {
                ctx.moveTo(dot.x + dot.radius, dot.y);
                ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            });
            ctx.fill();
        });

        if (!reducedMotion) {
            animationId = requestAnimationFrame(draw);
        }
    }

    resize();

    if (reducedMotion) {
        draw(0);
    } else {
        animationId = requestAnimationFrame(draw);
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 150);
    }, { passive: true });

    const observer = new MutationObserver(() => {
        if (reducedMotion) draw(0);
    });
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        } else if (!document.hidden && !reducedMotion && !animationId) {
            animationId = requestAnimationFrame(draw);
        }
    });

    if (isMobile) {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {}, 150);
        }, { passive: true });
    }
})();

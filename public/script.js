window.onload = function() {
    // Toggle functionality
    const crt = document.querySelector('.crt');
    const vignette = document.querySelector('.vignette');
    const backgroundCanvas = document.querySelector(".background");

    const crtToggle = document.getElementById('crtToggle');
    const vignetteToggle = document.getElementById('vignetteToggle');
    const backgroundToggle = document.getElementById('backgroundToggle');

    // Load saved preferences
    const savedCRT = localStorage.getItem('crt-enabled') !== 'false';
    const savedVignette = localStorage.getItem('vignette-enabled') !== 'false';
    const savedBackground = localStorage.getItem('background-enabled') !== 'false';

    // Apply saved settings
    if (!savedCRT) {
        crt.classList.add('no-crt');
        crtToggle.classList.remove('active');
    }
    if (!savedVignette) {
        vignette.classList.add('no-vignette');
        vignetteToggle.classList.remove('active');
    }
    if (!savedBackground) {
        crt.classList.add('no-background');
        backgroundToggle.classList.remove('active');
    }

    crtToggle.addEventListener('click', () => {
        crt.classList.toggle('no-crt');
        crtToggle.classList.toggle('active');
        localStorage.setItem('crt-enabled', crtToggle.classList.contains('active'));
    });

    vignetteToggle.addEventListener('click', () => {
        vignette.classList.toggle('no-vignette');
        vignetteToggle.classList.toggle('active');
        localStorage.setItem('vignette-enabled', vignetteToggle.classList.contains('active'));
    });

    backgroundToggle.addEventListener('click', () => {
        const isActive = backgroundToggle.classList.toggle('active');
        crt.classList.toggle('no-background');
        localStorage.setItem('background-enabled', isActive);

        if (isActive) {
            drawBackground(); // Start animation
        } else {
            cancelAnimationFrame(animationFrameId); // Stop animation
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });

    // Simple animated background
    const canvas = backgroundCanvas;
    const ctx = canvas.getContext("2d");
    let time = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    let animationFrameId = null;

    function drawBackground() {
        if (crt.classList.contains('no-background')) return;

        const w = canvas.width;
        const h = canvas.height;
        let t = 0;

        const particles = Array.from({ length: 100 }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 2 + 1,
            speed: Math.random() * 2 + 0.5
        }));

        function frame() {
            if (crt.classList.contains('no-background')) return;

            t++;

            // Dirty background wipe
            ctx.fillStyle = "rgba(10, 10, 20, 0.3)";
            ctx.fillRect(0, 0, w, h);

            // Low poly nonsense
            for (let i = 0; i < 4; i++) {
                const x1 = Math.random() * w;
                const y1 = Math.random() * h;
                const x2 = x1 + (Math.random() - 0.5) * 120;
                const y2 = y1 + (Math.random() - 0.5) * 120;
                const x3 = x1 + (Math.random() - 0.5) * 120;
                const y3 = y1 + (Math.random() - 0.5) * 120;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x3, y3);
                ctx.closePath();
                ctx.fillStyle = `rgba(${Math.floor(100 + Math.random() * 155)}, ${Math.floor(100 + Math.random() * 155)}, ${Math.floor(255 * Math.random())}, 0.05)`;
                ctx.fill();
            }

            // Glitch tear bursts
            if (Math.random() < 0.05) {
                const y = Math.random() * h;
                const hGlitch = 4 + Math.random() * 8;
                ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
                ctx.fillRect(0, y, w, hGlitch);
            }

            // Choppy particles
            particles.forEach(p => {
                ctx.fillStyle = Math.random() > 0.5 ? "#b4befe" : "#585b70";
                ctx.fillRect(p.x, p.y, p.r, p.r);

                p.y += p.speed;
                if (p.y > h) {
                    p.y = 0;
                    p.x = Math.random() * w;
                    p.r = Math.random() * 2 + 1;
                    p.speed = Math.random() * 2 + 0.5;
                }
            });

            // Crunchy pixel noise
            if (Math.random() < 0.25) {
                const imageData = ctx.getImageData(0, 0, w, h);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4 * 80) {
                    const glitch = (Math.random() - 0.5) * 60;
                    data[i] += glitch;
                    data[i + 1] += glitch;
                    data[i + 2] += glitch;
                }
                ctx.putImageData(imageData, 0, 0);
            }

            animationFrameId = requestAnimationFrame(frame);
        }

        frame();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawBackground();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey) {
            switch (e.key) {
                case 'C':
                    e.preventDefault();
                    crtToggle.click();
                    break;
                case 'V':
                    e.preventDefault();
                    vignetteToggle.click();
                    break;
                case 'B':
                    e.preventDefault();
                    backgroundToggle.click();
                    break;
            }
        }
    });

    // Easter egg: Konami code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

    document.addEventListener('keydown', (e) => {
        console.log(e.code)
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }

        if (konamiCode.join(',') === konamiSequence.join(',')) {
            // Enable matrix mode
            crt.style.background = 'black';
            crt.style.color = '#00ff00';
            document.querySelectorAll('a').forEach(a => a.style.color = '#00ff00');
            setTimeout(() => location.reload(), 3000);
        }
    });
}

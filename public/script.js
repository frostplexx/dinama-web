window.onload = function() {
    // Toggle functionality
    const body = document.body;
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
        body.classList.add('no-crt');
        crtToggle.classList.remove('active');
    }
    if (!savedVignette) {
        vignette.classList.add('no-vignette');
        vignetteToggle.classList.remove('active');
    }
    if (!savedBackground) {
        body.classList.add('no-background');
        backgroundToggle.classList.remove('active');
    }

    crtToggle.addEventListener('click', () => {
        body.classList.toggle('no-crt');
        crtToggle.classList.toggle('active');
        localStorage.setItem('crt-enabled', crtToggle.classList.contains('active'));
    });

    vignetteToggle.addEventListener('click', () => {
        vignette.classList.toggle('no-vignette');
        vignetteToggle.classList.toggle('active');
        localStorage.setItem('vignette-enabled', vignetteToggle.classList.contains('active'));
    });

    backgroundToggle.addEventListener('click', () => {
        body.classList.toggle('no-background');
        backgroundToggle.classList.toggle('active');
        localStorage.setItem('background-enabled', backgroundToggle.classList.contains('active'));
    });

    // Simple animated background
    const canvas = backgroundCanvas;
    const ctx = canvas.getContext("2d");
    let time = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function drawBackground() {
        if (body.classList.contains('no-background')) return;

        canvas.width = canvas.height = 512;

        let last_frame = (new Date().getTime()) / 1000;
        function frame() {
            const img = new Image();
            const now = (new Date().getTime()) / 1000;
            let delta = now - last_frame;
            last_frame = now;
            img.src = ctx.canvas.toDataURL("image/jpeg", 0.75 + 0.25 * Math.sin(now));
            img.onload = () => {
                ctx.drawImage(img, 0, delta * 32);
                for (let i = 0; i < Math.random() * 64; i++) {
                    ctx.fillStyle = Math.random() > 0.5 ? "#b4befe" : "#585b70";
                    ctx.beginPath();
                    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, 2 * Math.PI);
                    ctx.fill();
                }
                ctx.fillStyle = "rgba(13, 14, 21, 0.05)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                requestAnimationFrame(frame);
            }
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
            body.style.background = 'black';
            body.style.color = '#00ff00';
            document.querySelectorAll('a').forEach(a => a.style.color = '#00ff00');
            setTimeout(() => location.reload(), 3000);
        }
    });
}

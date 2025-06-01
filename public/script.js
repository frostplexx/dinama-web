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

    const TARGET_FPS = 15;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    function drawBackground() {
        if (crt.classList.contains('no-background')) return;

        const canvas = document.querySelector(".background");
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.height = 512;

        let lastRender = 0;
        let lastFrameTime = 0;

        function frame(now = performance.now()) {

            if (crt.classList.contains('no-background')) return;
            if (now - lastRender >= FRAME_INTERVAL) {
                // Calculate delta time based on last frame time
                const delta = (now - lastFrameTime) / 1000;
                lastFrameTime = now;
                lastRender = now;

                const img = new Image();
                img.src = ctx.canvas.toDataURL("image/jpeg", 0.75 + 0.25 * Math.sin(now / 1000));
                img.onload = () => {
                    ctx.drawImage(img, 0, delta * 32);

                    for (let i = 0; i < Math.random() * 64; i++) {
                        ctx.fillStyle = Math.random() > 0.5 ? "#6574a5" : "#0d0e15";
                        ctx.beginPath();
                        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1.5, 0, 2 * Math.PI);
                        ctx.fill();
                    }

                    ctx.fillStyle = "rgba(13, 14, 21, 0.05)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    requestAnimationFrame(frame);
                };
            } else {
                requestAnimationFrame(frame);
            }
        }

        // Start the animation loop
        requestAnimationFrame(frame);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawBackground();
}

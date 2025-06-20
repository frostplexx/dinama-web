window.onload = function() {
    console.log("Howdy")
    loadProjects();

    // Toggle functionality
    const crt = document.querySelector('.crt');
    const vignette = document.querySelector('.vignette');
    const backgroundCanvas = document.querySelector(".background");

    const crtToggle = document.getElementById('crtToggle');
    const vignetteToggle = document.getElementById('vignetteToggle');
    const backgroundToggle = document.getElementById('backgroundToggle');

    // Check if localStorage is available (won't work in Claude artifacts)
    const hasLocalStorage = typeof (Storage) !== "undefined";

    // Load saved preferences (fallback to defaults if localStorage unavailable)
    let savedCRT = true;
    let savedVignette = true;
    let savedBackground = true;

    if (hasLocalStorage) {
        savedCRT = localStorage.getItem('crt-enabled') !== 'false';
        savedVignette = localStorage.getItem('vignette-enabled') !== 'false';
        savedBackground = localStorage.getItem('background-enabled') !== 'false';
    }

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
        if (hasLocalStorage) {
            localStorage.setItem('crt-enabled', crtToggle.classList.contains('active'));
        }
    });

    vignetteToggle.addEventListener('click', () => {
        vignette.classList.toggle('no-vignette');
        vignetteToggle.classList.toggle('active');
        if (hasLocalStorage) {
            localStorage.setItem('vignette-enabled', vignetteToggle.classList.contains('active'));
        }
    });

    backgroundToggle.addEventListener('click', () => {
        const isActive = backgroundToggle.classList.toggle('active');
        crt.classList.toggle('no-background');
        if (hasLocalStorage) {
            localStorage.setItem('background-enabled', isActive);
        }

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
    let animationFrameId;

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

            animationFrameId = requestAnimationFrame(frame);

            if (now - lastRender >= FRAME_INTERVAL) {
                const delta = (now - lastFrameTime) / 1000;
                lastFrameTime = now;
                lastRender = now;

                const img = new Image();
                img.src = ctx.canvas.toDataURL("image/jpeg", 0.75 + 0.25 * Math.sin(now / 1000));
                img.onload = () => {
                    ctx.drawImage(img, 0, delta * 32);

                    for (let i = 0; i < Math.random() * 64; i++) {
                        ctx.fillStyle = Math.random() > 0.5 ? "#BE89FF" : "#232136";
                        ctx.beginPath();
                        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1.5, 0, 2 * Math.PI);
                        ctx.fill();
                    }

                    ctx.fillStyle = "rgba(13, 14, 21, 0.05)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                };
            }
        }

        animationFrameId = requestAnimationFrame(frame);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawBackground();

    async function loadProjects() {
        const loadingEl = document.getElementById('projects-loading');
        const errorEl = document.getElementById('projects-error');
        const tableEl = document.getElementById('projects-table');
        const tbodyEl = document.getElementById('projects-tbody');

        try {
            loadingEl.style.display = 'block';
            errorEl.style.display = 'none';
            tableEl.style.display = 'none';

            // Fetch from the pre-built static file
            const response = await fetch('/data/projects.json');

            console.log(response);

            if (!response.ok) {
                throw new Error(`Failed to load projects data: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to load projects');
            }

            // Clear existing content
            tbodyEl.innerHTML = '';

            // Populate projects
            data.projects.forEach(project => {
                const row = document.createElement('tr');

                // Format date
                const date = new Date(project.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                });

                // Status badge class
                const statusClass = project.status.toLowerCase().replace('_', '-');

                // Tech stack display (limit to avoid overflow)
                const techStack = project.techStack.slice(0, 4).join(' • ');

                row.innerHTML = `
                    <td>-rwxr-xr-x</td>
                    <td>daniel</td>
                    <td>${date}</td>
                    <td>
                        <a href="${project.url}" target="_blank" rel="noopener noreferrer">${project.name}</a>
                        <span class="status-badge status-${statusClass}">${project.status}</span><br>
                        <div class="project-description">${project.description}</div>
                        <div class="tech-stack">${techStack}</div>
                    </td>
                `;

                tbodyEl.appendChild(row);
            });

            // Show cache status with build-time info
            if (data.buildTime) {
                const buildDate = new Date(data.lastFetched).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });


            }

            loadingEl.style.display = 'none';
            tableEl.style.display = 'table';

        } catch (error) {
            console.error('Error loading projects:', error);
            loadingEl.style.display = 'none';
            errorEl.style.display = 'block';

            // Show a more user-friendly error message
            const errorMessage = errorEl.querySelector('p');
            if (error.message.includes('Failed to load projects data')) {
                errorMessage.textContent = 'Projects data not found. The site may not have been built properly. ';
            } else {
                errorMessage.textContent = `Error: ${error.message} `;
            }
        }
    }

    // Retry functionality
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', loadProjects);
    }

};

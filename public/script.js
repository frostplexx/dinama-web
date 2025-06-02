window.onload = function() {
    // Cache DOM elements
    const crt = document.querySelector('.crt');
    const vignette = document.querySelector('.vignette');
    const backgroundCanvas = document.querySelector(".background");
    const crtToggle = document.getElementById('crtToggle');
    const vignetteToggle = document.getElementById('vignetteToggle');
    const backgroundToggle = document.getElementById('backgroundToggle');

    // Check localStorage availability
    const hasLocalStorage = typeof (Storage) !== "undefined";

    // Load saved preferences with fallbacks
    let savedCRT = hasLocalStorage ? localStorage.getItem('crt-enabled') !== 'false' : true;
    let savedVignette = hasLocalStorage ? localStorage.getItem('vignette-enabled') !== 'false' : true;
    let savedBackground = hasLocalStorage ? localStorage.getItem('background-enabled') !== 'false' : true;

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

    // Toggle event handlers
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
            startBackground();
        } else {
            stopBackground();
        }
    });

    // Optimized animated background
    const canvas = backgroundCanvas;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let isBackgroundRunning = false;

    // Animation parameters
    const TARGET_FPS = 10; // Reduced from 15 for better performance
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    let lastFrameTime = 0;
    let particles = [];

    // Initialize particles array for better performance
    function initParticles() {
        particles = [];
        for (let i = 0; i < 32; i++) { // Pre-allocate particles
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                color: Math.random() > 0.5 ? "#6574a5" : "#0d0e15",
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles(); // Reinitialize particles on resize
    }

    function updateParticles(deltaTime) {
        particles.forEach(particle => {
            particle.x += particle.vx * deltaTime * 60; // 60fps normalized
            particle.y += particle.vy * deltaTime * 60;

            // Wrap around screen
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;

            // Occasionally change color and properties
            if (Math.random() < 0.01) {
                particle.color = Math.random() > 0.5 ? "#6574a5" : "#0d0e15";
                particle.radius = Math.random() * 1.5;
            }
        });
    }

    function drawParticles() {
        particles.forEach(particle => {
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    function animateBackground(currentTime = performance.now()) {
        if (!isBackgroundRunning || crt.classList.contains('no-background')) {
            return;
        }

        animationFrameId = requestAnimationFrame(animateBackground);

        // Throttle to target FPS
        if (currentTime - lastFrameTime < FRAME_INTERVAL) {
            return;
        }

        const deltaTime = (currentTime - lastFrameTime) / 1000;
        lastFrameTime = currentTime;

        // Clear canvas with fade effect (replaces the problematic toDataURL approach)
        ctx.fillStyle = "rgba(13, 14, 21, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        updateParticles(deltaTime);
        drawParticles();

        // Add subtle noise effect without canvas readback
        if (Math.random() < 0.1) { // Only 10% of frames
            ctx.fillStyle = `rgba(101, 116, 165, ${0.02 + 0.01 * Math.sin(currentTime / 1000)})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    function startBackground() {
        if (isBackgroundRunning) return;
        isBackgroundRunning = true;
        initParticles();
        lastFrameTime = performance.now();
        animationFrameId = requestAnimationFrame(animateBackground);
    }

    function stopBackground() {
        isBackgroundRunning = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Setup canvas
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Start background if enabled
    if (!crt.classList.contains('no-background')) {
        startBackground();
    }

    // Optimized GitHub Projects Loading with error handling and caching
    let projectsCache = null;
    let lastFetchTime = 0;
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    async function loadProjects(useCache = true) {
        const loadingEl = document.getElementById('projects-loading');
        const errorEl = document.getElementById('projects-error');
        const tableEl = document.getElementById('projects-table');
        const tbodyEl = document.getElementById('projects-tbody');

        // Check cache first
        const now = Date.now();
        if (useCache && projectsCache && (now - lastFetchTime) < CACHE_DURATION) {
            displayProjects(projectsCache, loadingEl, errorEl, tableEl, tbodyEl);
            return;
        }

        try {
            loadingEl.style.display = 'block';
            errorEl.style.display = 'none';
            tableEl.style.display = 'none';

            // Add timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch('/api/github', {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch projects');
            }

            // Cache the results
            projectsCache = data;
            lastFetchTime = now;

            displayProjects(data, loadingEl, errorEl, tableEl, tbodyEl);

        } catch (error) {
            console.error('Error loading projects:', error);
            loadingEl.style.display = 'none';
            errorEl.style.display = 'block';

            const errorMessage = errorEl.querySelector('p');
            if (error.name === 'AbortError') {
                errorMessage.textContent = 'Request timed out. Please try again. ';
            } else if (error.message.includes('fetch')) {
                errorMessage.textContent = 'Failed to connect to GitHub API. ';
            } else {
                errorMessage.textContent = `Error: ${error.message} `;
            }
        }
    }

    function displayProjects(data, loadingEl, errorEl, tableEl, tbodyEl) {
        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();

        data.projects.forEach(project => {
            const row = document.createElement('tr');

            // Format date once
            const date = new Date(project.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            });

            const statusClass = project.status.toLowerCase().replace('_', '-');
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

            fragment.appendChild(row);
        });

        // Clear and append all at once
        tbodyEl.innerHTML = '';
        tbodyEl.appendChild(fragment);

        loadingEl.style.display = 'none';
        tableEl.style.display = 'table';
    }

    // Retry functionality
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', () => loadProjects(false)); // Force refresh on retry
    }

    // Load projects when page loads
    loadProjects();
};

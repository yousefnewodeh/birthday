document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('birthdayCard');
    const confettiBtn = document.getElementById('confettiBtn');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');

    let isMusicPlaying = false;

    function toggleMusic() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
        } else {
            bgMusic.play().catch(e => console.log("Autoplay prevented:", e));
            musicToggle.classList.add('playing');
        }
        isMusicPlaying = !isMusicPlaying;
    }

    musicToggle.addEventListener('click', toggleMusic);

    // Magical Star Background
    function createStars() {
        const container = document.getElementById('cakes-container');
        const starCount = 100;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 3;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.left = Math.random() * 100 + 'vw';
            star.style.top = Math.random() * 100 + 'vh';
            star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
            container.appendChild(star);
        }
    }

    // Cake background generation
    function createCakes() {
        const container = document.getElementById('cakes-container');
        const cakeCount = 25; // Slightly more to balance both themes
        const cakeSymbols = ['🌸', '✨', '🎀', '🧸', '💖', '🦋', '🍭', '🧁', '👑', '🦢'];

        for (let i = 0; i < cakeCount; i++) {
            const cake = document.createElement('div');
            cake.className = 'floating-item';
            cake.innerHTML = cakeSymbols[Math.floor(Math.random() * cakeSymbols.length)];
            cake.style.left = Math.random() * 100 + 'vw';
            cake.style.animationDuration = (Math.random() * 8 + 7) + 's';
            cake.style.animationDelay = Math.random() * 15 + 's';
            cake.style.fontSize = (Math.random() * 25 + 20) + 'px';
            container.appendChild(cake);
        }
    }

    // Sparkle Trail
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '⭐'; // Standard star sparkle
        sparkle.style.color = 'var(--gold)';
        sparkle.style.position = 'fixed';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.fontSize = Math.random() * 15 + 10 + 'px';
        sparkle.style.zIndex = '10000';
        sparkle.style.transition = 'all 0.8s ease-out';
        sparkle.style.opacity = '1';
        sparkle.style.textShadow = '0 0 10px var(--gold)';
        document.body.appendChild(sparkle);

        requestAnimationFrame(() => {
            sparkle.style.transform = `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px) scale(0) rotate(${Math.random() * 360}deg)`;
            sparkle.style.opacity = '0';
        });

        setTimeout(() => sparkle.remove(), 800);
    }

    window.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.8) {
            createSparkle(e.clientX, e.clientY);
        }
    });

    createStars();
    createCakes();

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 3D Tilt Effect
    const wrapper = document.querySelector('.book-wrapper');
    const book = document.getElementById('birthdayBook');
    const pages = document.querySelectorAll('.page');
    let currentPage = 0;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        wrapper.addEventListener('mousemove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10; // Max 10 deg

            book.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        wrapper.addEventListener('mouseleave', () => {
            book.style.transform = 'rotateX(0) rotateY(0)';
        });
    }

    // Toggle Pages
    wrapper.addEventListener('click', (e) => {
        // Don't flip if clicking the button
        if (e.target.id === 'confettiBtn') {
            e.stopPropagation(); // Explicitly stop propagation
            return;
        }

        if (currentPage < pages.length) {
            pages[currentPage].classList.add('flipped');
            pages[currentPage].classList.remove('active');

            currentPage++;
            wrapper.classList.add('opened');

            if (currentPage < pages.length) {
                pages[currentPage].classList.add('active');
            }

            // Start music on first interaction if not playing
            if (!isMusicPlaying) {
                toggleMusic();
            }
        } else {
            // Reset book
            wrapper.classList.remove('opened');
            for (let i = pages.length - 1; i >= 0; i--) {
                setTimeout(() => {
                    pages[i].classList.remove('flipped');
                    if (i === 0) pages[i].classList.add('active');
                    else pages[i].classList.remove('active');
                }, (pages.length - 1 - i) * 100);
            }
            currentPage = 0;
        }
    });

    // Confetti System
    const particles = [];
    const colors = ['#ff8fa3', '#ffccd5', '#fff0f3', '#ffd700', '#ff4d6d'];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 8 + 4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            if (this.y > canvas.height) {
                const index = particles.indexOf(this);
                if (index > -1 && particles.length > 200) {
                    particles.splice(index, 1);
                } else {
                    this.y = -20;
                    this.x = Math.random() * canvas.width;
                }
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    function initConfetti() {
        for (let i = 0; i < 150; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    let confettiActive = false;
    confettiBtn.addEventListener('click', () => {
        // Light Burst effect
        const burst = document.createElement('div');
        burst.className = 'light-burst';
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 1000);

        if (!confettiActive) {
            initConfetti();
            animate();
            confettiActive = true;
            confettiBtn.textContent = 'More Magic! ✨';
        } else {
            // Add more particles on subsequent clicks
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle());
            }
        }
    });
});


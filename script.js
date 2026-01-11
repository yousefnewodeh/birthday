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

    // Cake background generation
    function createCakes() {
        const container = document.getElementById('cakes-container');
        const cakeCount = 30;
        const cakeSymbols = ['🎂', '🍰', '🧁', '🍩', '✨', '🍭'];

        for (let i = 0; i < cakeCount; i++) {
            const cake = document.createElement('div');
            cake.className = 'floating-item';
            cake.innerHTML = cakeSymbols[Math.floor(Math.random() * cakeSymbols.length)];
            cake.style.left = Math.random() * 100 + 'vw';
            cake.style.animationDuration = (Math.random() * 5 + 5) + 's';
            cake.style.animationDelay = Math.random() * 15 + 's';
            cake.style.fontSize = (Math.random() * 25 + 20) + 'px';
            container.appendChild(cake);
        }
    }

    createCakes();

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 3D Tilt Effect
    const wrapper = document.querySelector('.card-wrapper');

    wrapper.addEventListener('mousemove', (e) => {
        if (card.classList.contains('open')) {
            wrapper.style.transform = 'none';
            return;
        }

        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg
        const rotateY = ((x - centerX) / centerX) * 15; // Max 15 deg

        wrapper.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    wrapper.addEventListener('mouseleave', () => {
        wrapper.style.transform = 'perspective(2000px) rotateX(0) rotateY(0)';
    });

    // Toggle Card
    card.addEventListener('click', (e) => {
        // Don't flip if clicking the button
        if (e.target !== confettiBtn) {
            card.classList.toggle('open');
            card.parentElement.classList.toggle('expanded');

            // Reset tilt when opening
            if (card.classList.contains('open')) {
                wrapper.style.transform = 'none';
            }

            // Start music on first interaction if not playing
            if (!isMusicPlaying) {
                toggleMusic();
            }
        }
    });

    // Confetti System
    const particles = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#6c5ce7', '#a29bfe', '#fd79a8'];

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


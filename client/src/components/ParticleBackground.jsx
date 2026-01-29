import { useEffect, useRef } from 'react';

const ParticleBackground = ({ theme = 'light' }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        // Configuration
        const spacing = 30;
        const radius = 1.5;
        const mouseRadius = 150;
        const returnSpeed = 0.1;
        const displaceFactor = 0.5;

        // Colors
        const particleColor = theme === 'dark' 
            ? 'rgba(255, 255, 255, 0.2)'  // White-ish for dark mode
            : 'rgba(156, 163, 175, 0.5)'; // Gray-400 for light mode

        const mouse = { x: undefined, y: undefined };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const handleMouseMove = (event) => {
            mouse.x = event.x;
            mouse.y = event.y + window.scrollY; // Account for scroll if fixed, but we'll make canvas fixed
        };
        
        // However, if canvas is fixed position, we don't need scrollY
        // Let's assume canvas is fixed inset-0
        const handleFixedMouseMove = (event) => {
             mouse.x = event.clientX;
             mouse.y = event.clientY;
        }

        class Particle {
            constructor(x, y) {
                this.baseX = x;
                this.baseY = y;
                this.x = x;
                this.y = y;
                this.density = (Math.random() * 30) + 1;
            }

            draw() {
                ctx.fillStyle = particleColor;
                ctx.beginPath();
                ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = mouseRadius;
                let force = (maxDistance - distance) / maxDistance;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                if (distance < mouseRadius) {
                    // Repulsion (move away)
                    this.x -= directionX * displaceFactor * 5; 
                    this.y -= directionY * displaceFactor * 5;
                } else {
                    // Return to base
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx * returnSpeed;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy * returnSpeed;
                    }
                }
            }
        }

        const initParticles = () => {
            particles = [];
            // Create a grid
            for (let y = 0; y < canvas.height; y += spacing) {
                for (let x = 0; x < canvas.width; x += spacing) {
                    particles.push(new Particle(x, y));
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].draw();
                particles[i].update();
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleFixedMouseMove);
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleFixedMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed inset-0 z-0 pointer-events-none opacity-40"
            style={{ background: 'transparent' }}
        />
    );
};

export default ParticleBackground;

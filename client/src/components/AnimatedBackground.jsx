// src/components/AnimatedBackground.jsx
import { useEffect, useRef, useState } from 'react';

const AnimatedBackground = () => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const starsRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set initial canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const FPS = 60;
        const starCount = 100;

        // Initialize stars
        starsRef.current = [];
        for (let i = 0; i < starCount; i++) {
            starsRef.current.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1 + 1,
                vx: Math.floor(Math.random() * 50) - 25,
                vy: Math.floor(Math.random() * 50) - 25
            });
        }

        // Calculate distance between two points
        const distance = (point1, point2) => {
            const xs = Math.pow(point2.x - point1.x, 2);
            const ys = Math.pow(point2.y - point1.y, 2);
            return Math.sqrt(xs + ys);
        };

        // Draw the scene
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Fill with black background
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.globalCompositeOperation = "lighter";

            // Draw stars
            for (let i = 0; i < starsRef.current.length; i++) {
                const s = starsRef.current[i];
                ctx.fillStyle = "#fff";
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillStyle = 'black';
                ctx.stroke();
            }

            // Draw connections between stars
            ctx.beginPath();
            for (let i = 0; i < starsRef.current.length; i++) {
                const starI = starsRef.current[i];
                ctx.moveTo(starI.x, starI.y);
                if (distance(mouseRef.current, starI) < 150) ctx.lineTo(mouseRef.current.x, mouseRef.current.y);

                for (let j = 0; j < starsRef.current.length; j++) {
                    const starII = starsRef.current[j];
                    if (distance(starI, starII) < 150) {
                        ctx.lineTo(starII.x, starII.y);
                    }
                }
            }
            ctx.lineWidth = 0.05;
            ctx.strokeStyle = 'white';
            ctx.stroke();
        };

        // Update star positions
        const update = () => {
            for (let i = 0; i < starsRef.current.length; i++) {
                const s = starsRef.current[i];
                s.x += s.vx / FPS;
                s.y += s.vy / FPS;

                if (s.x < 0 || s.x > canvas.width) s.vx = -s.vx;
                if (s.y < 0 || s.y > canvas.height) s.vy = -s.vy;
            }
        };

        // Animation loop
        const tick = () => {
            draw();
            update();
            animationRef.current = requestAnimationFrame(tick);
        };

        // Handle mouse movement
        const handleMouseMove = (e) => {
            mouseRef.current = {
                x: e.clientX,
                y: e.clientY
            };
        };

        // Handle window resize
        const handleResize = () => {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            });
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Ensure black background is maintained after resize
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        // Start animation
        tick();

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [dimensions]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full"
            style={{ background: 'black', zIndex: -1 }}
        />
    );
};

export default AnimatedBackground;
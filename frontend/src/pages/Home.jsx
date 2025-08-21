import Navbar from '../components/layout/navbar.jsx';
import HeroSection from '../components/heroSection/HeroSection.jsx';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const particles = [];
    const colors = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];

    class FriendParticle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 8 + 4; // Slightly larger for better visibility
        this.speedX = Math.random() * 0.8 - 0.4;
        this.speedY = Math.random() * 0.8 - 0.4;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.originalSize = this.size;
        this.rotation = Math.random() * Math.PI * 2;
      }

      update(mouse) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          this.size = this.originalSize * 1.8; // More noticeable growth
          const force = (150 - distance) / 150;
          this.x += dx * force * 0.03; // Slightly stronger attraction
          this.y += dy * force * 0.03;
        } else {
          this.size = this.originalSize;
          this.x += this.speedX;
          this.y += this.speedY;
        }

        if (this.x > canvas.width + 30) this.x = -30;
        if (this.x < -30) this.x = canvas.width + 30;
        if (this.y > canvas.height + 30) this.y = -30;
        if (this.y < -30) this.y = canvas.height + 30;

        this.rotation += 0.015; // Slightly faster rotation
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Draw heart shape with more visibility
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 25; // Stronger glow
        ctx.shadowColor = this.color;
        
        ctx.beginPath();
        const curve = this.size * 0.3;
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(
          this.size, -this.size - curve,
          this.size + curve, 0,
          0, this.size
        );
        ctx.bezierCurveTo(
          -this.size - curve, 0,
          -this.size, -this.size - curve,
          0, -this.size
        );
        ctx.fill();
        
        ctx.restore();
      }
    }

    for (let i = 0; i < 70; i++) { // Slightly fewer particles for better performance
      particles.push(new FriendParticle());
    }

    const drawConnections = () => {
      ctx.shadowBlur = 0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const strength = 1 - (distance / 120);
            ctx.strokeStyle = `${particles[i].color}${Math.round(strength * 150).toString(16).padStart(2, '0')}`; // More opaque
            ctx.lineWidth = strength * 3; // Thicker lines
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            
            const cpX = (particles[i].x + particles[j].x) / 2 + Math.sin(Date.now() * 0.001) * 15;
            const cpY = (particles[i].y + particles[j].y) / 2 + Math.cos(Date.now() * 0.001) * 15;
            ctx.quadraticCurveTo(cpX, cpY, particles[j].x, particles[j].y);
            
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections behind particles
      drawConnections();
      
      // Draw particles
      particles.forEach(particle => {
        particle.update(mousePosition);
        particle.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Very subtle background gradient - almost white */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#FFF0F5]/20 via-[#F0F8FF]/15 to-[#F5F5DC]/10" />
      
      {/* Canvas should be above background but below content */}
      <canvas ref={canvasRef} className="absolute inset-0 z-1" />
      
      {/* Very subtle overlay - almost transparent */}
      <div className="absolute inset-0 z-2 bg-gradient-to-b from-[#FFE4E1]/10 to-[#ADD8E6]/5" />
      
      {/* Subtle sparkle effect */}
      <div className="absolute inset-0 z-3">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-twinkle"
            style={{
              width: '3px',
              height: '3px',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: '#FFD700',
              borderRadius: '50%',
              animationDelay: `${i * 0.7}s`,
              opacity: Math.random() * 0.4 + 0.1
            }}
          />
        ))}
      </div>

      {/* Content on top */}
      <div className="relative z-10">
        <Navbar />
        <main className="pt-52 pb-12 min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <HeroSection />
        </main>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
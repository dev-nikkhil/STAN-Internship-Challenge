import { useEffect, useState } from 'react';

export default function AnimatedHeading() {
  const [displayText, setDisplayText] = useState('');
  const [currentColor, setCurrentColor] = useState(0);
  const fullText = "Meet Buddy. Your AI friend with a memory.";

  // Color palette options
//   const colors = [
//     'text-blue-400',  // Blue
//     'text-purple-400', // Purple
//     'text-emerald-400', // Green
//     'text-amber-400',  // Amber
//     'text-rose-400'    // Pink
//   ];

    const colors = [
  // Blue-Purple
  'bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent',
  
  // Electric Green
  'bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent',
  
  // Sunset
  'bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent',
  
  // Neon
  'bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent',
  
  // Berry
  'bg-gradient-to-r from-rose-400 to-fuchsia-500 bg-clip-text text-transparent',
  
  // Fire
  'bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent',
  
  // Ocean
  'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent',
  
  // Candy
  'bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent'
];

  useEffect(() => {
    let timeout;
    let i = 0;
    let isTyping = true;
    let isDeleting = false;

    const typeWriter = () => {
      if (isTyping) {
        if (i < fullText.length) {
          setDisplayText(fullText.substring(0, i + 1));
          i++;
          timeout = setTimeout(typeWriter, 100);
        } else {
          isTyping = false;
          isDeleting = true;
          timeout = setTimeout(typeWriter, 1500);
        }
      } else if (isDeleting) {
        if (i > 0) {
          setDisplayText(fullText.substring(0, i - 1));
          i--;
          timeout = setTimeout(typeWriter, 50);
        } else {
          isDeleting = false;
          isTyping = true;
          // Change color when restarting
          setCurrentColor((prev) => (prev + 1) % colors.length);
          timeout = setTimeout(typeWriter, 500);
        }
      }
    };

    typeWriter();

    return () => clearTimeout(timeout);
  }, [currentColor]); // Reset animation when color changes

  return (
    <h1 className={`text-4xl md:text-5xl font-bold mb-6 text-center tracking-tight ${colors[currentColor]}`}>
      {displayText}
      <span className="animate-pulse text-white">|</span>
    </h1>
  );
}
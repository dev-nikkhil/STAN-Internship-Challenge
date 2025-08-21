import { useNavigate } from 'react-router-dom';

export default function GradientButton() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/dashboard');
  }
  
  return (
    <button
      onClick={handleClick}
      className="
        px-6 py-3 
        text-base 
        font-semibold 
        text-white 
        rounded-xl 
        relative 
        overflow-hidden 
        group
        border-2
        border-pink-400
        bg-gradient-to-r from-[#FF6B6B] to-[#FD79A8]
        hover:from-[#FF8E53] hover:to-[#FF9AA2]
        hover:border-pink-500
        transition-all
        duration-300
        flex items-center justify-center gap-2
        shadow-lg
        shadow-pink-500/30
      "
    >
      {/* Animated glow effect */}
      <span className="absolute inset-0 bg-pink-500 opacity-0 group-hover:opacity-15 transition-opacity duration-300 rounded-xl" />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center">
        💬 Talk Now
      </span>

      {/* Subtle glow */}
      <span className="absolute -inset-1 rounded-xl bg-pink-400 blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
    </button>
  );
}

export default function AuthButtons({ onButtonClick }) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onButtonClick('login')}
        className="px-4 py-2 border border-[#FF6B6B] text-[#FF6B6B] rounded-lg hover:bg-[#FF6B6B]/10 transition-colors font-medium"
      >
        Login
      </button>
      <button
        onClick={() => onButtonClick('signup')}
        className="px-4 py-2 bg-gradient-to-r from-[#FF6B6B] to-[#FD79A8] text-white rounded-lg hover:from-[#FF8E53] hover:to-[#FF9AA2] transition-all font-medium shadow-md hover:shadow-lg"
      >
        Signup
      </button>
    </div>
  );
}
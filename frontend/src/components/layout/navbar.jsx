import { Link } from 'react-router-dom';
import AuthButtons from '../ui/AuthButton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import LogoutButton from '../ui/LogoutButton.jsx';

export default function Navbar({ onAuthButtonClick }) {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="w-full px-6 py-5 absolute top-0 left-0 z-20">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          to="/" 
          className="
            text-3xl md:text-4xl 
            font-extrabold 
            bg-gradient-to-r 
            from-[#FF6B6B] 
            via-[#FD79A8] 
            to-[#FF8E53] 
            bg-clip-text 
            text-transparent
            tracking-tighter
            drop-shadow-lg
            hover:scale-105
            transition-transform
            duration-300
          "
        >
          Buddy
        </Link>
        
        <div className="flex items-center gap-6">
          {/* Dashboard Link - Only shown when authenticated */}
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="
                text-gray-700
                font-medium
                hover:text-[#FF6B6B]
                transition-colors
                duration-200
              "
            >
              Dashboard
            </Link>
          )}

          {/* Auth Buttons/Logout */}
          {isAuthenticated ? (
            <LogoutButton />
          ) : (
            <AuthButtons onButtonClick={onAuthButtonClick} />
          )}
        </div>
      </div>
    </nav>
  );
}
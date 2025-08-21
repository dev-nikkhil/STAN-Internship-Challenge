import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthModal from './components/auth/authModel.jsx';
import Navbar from './components/layout/navbar.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Dashboard from './pages/Dashboard.jsx';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeWithAuthModal />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function HomeWithAuthModal() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  return (
    <div className="relative"> 
      <Navbar 
        onAuthButtonClick={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }} 
      />
      <Home />
      
    
      {authModalOpen && (
        <AuthModal 
          mode={authMode}
          onClose={() => setAuthModalOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;
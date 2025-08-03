import { RefreshCw, Zap } from 'lucide-react';

const Header = ({ user, onSignOut, onStartOver }) => (
  <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
    <div className="container mx-auto px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-50"></div>
            <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black text-white">MovieMagnet</h1>
            <p className="text-xs text-white/60 -mt-1">Zero-effort picks</p>
          </div>
        </div>
        
        {/* User section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onStartOver}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">New Pick</span>
          </button>
          
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
            <img 
              src={user.profilePicture} 
              alt={user.name}
              className="w-8 h-8 rounded-full ring-2 ring-white/20"
            />
            <div className="hidden sm:block">
              <div className="text-white text-sm font-medium">{user.name}</div>
              <button
                onClick={onSignOut}
                className="text-white/50 hover:text-white text-xs transition-colors"
              >
                Sign out
              </button>
            </div>
            <button
              onClick={onSignOut}
              className="sm:hidden text-white/50 hover:text-white text-xs transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;


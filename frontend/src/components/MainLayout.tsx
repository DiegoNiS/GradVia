import React from 'react';
import { BackgroundOrbs } from './BackgroundOrbs';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div id="app-main-layout" className="relative min-h-screen bg-background text-foreground flex flex-col selection:bg-zinc-800">
      {/* Fondo Neumórfico Monocromático */}
      <BackgroundOrbs />
      
      {/* Top Navbar / Header Container */}
      <header id="main-header" className="w-full p-4 md:px-8 md:py-6 relative z-10 flex items-center justify-between">
        <div id="header-logo" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl neu-card-sm flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-100 shadow-[0_0_8px_rgba(255,255,255,0.6)]"></div>
          </div>
          <span className="font-semibold text-lg tracking-tight text-zinc-100">GradVia</span>
        </div>
        <div id="header-user-menu" className="flex items-center gap-4 text-xs text-zinc-400">
          <span className="hidden sm:inline font-medium tracking-wide">Sistema de Gestión Académica</span>
          <div className="w-9 h-9 rounded-full neu-button flex items-center justify-center cursor-pointer">
            <span className="text-xs text-zinc-300 font-mono">GV</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content-area" className="relative z-10 w-full flex-1 p-4 md:px-8 pb-8">
        {children}
      </main>
    </div>
  );
};

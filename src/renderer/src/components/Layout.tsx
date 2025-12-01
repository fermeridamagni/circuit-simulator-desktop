import type React from "react";

interface LayoutProps {
  children: React.ReactNode;
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  topBar: React.ReactNode;
  bottomPanel: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  leftPanel,
  rightPanel,
  topBar,
  bottomPanel,
}) => {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-gray-900 text-white">
      {/* Top Bar */}
      <header className="z-10 flex h-14 items-center border-gray-700 border-b bg-gray-800 px-4">
        {topBar}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel (Palette) */}
        <aside className="z-10 flex w-64 flex-col border-gray-700 border-r bg-gray-800">
          {leftPanel}
        </aside>

        {/* Main Content (Canvas) */}
        <main className="relative flex-1 overflow-hidden bg-gray-950">
          {children}

          {/* Bottom Panel (Debug Console) - Overlay or fixed height */}
          <div className="absolute right-0 bottom-0 left-0 z-20 h-48 border-gray-700 border-t bg-gray-900/90 backdrop-blur-sm">
            {bottomPanel}
          </div>
        </main>

        {/* Right Panel (Inspector) */}
        <aside className="z-10 flex w-72 flex-col border-gray-700 border-l bg-gray-800">
          {rightPanel}
        </aside>
      </div>
    </div>
  );
};

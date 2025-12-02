import type React from "react";

type LayoutProps = {
  children: React.ReactNode;
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  topBar: React.ReactNode;
  bottomPanel: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  leftPanel,
  rightPanel,
  topBar,
  bottomPanel,
}) => {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-canvas-bg font-sans text-text-primary">
      {/* Top Bar */}
      <header className="z-10 flex h-12 items-center border-border-subtle border-b bg-panel-bg px-4">
        {topBar}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel (Palette) */}
        <aside className="z-10 flex w-64 flex-col border-border-subtle border-r bg-panel-bg">
          {leftPanel}
        </aside>

        {/* Main Content (Canvas) */}
        <main className="relative flex-1 overflow-hidden bg-canvas-bg">
          {children}

          {/* Bottom Panel (Debug Console) - Overlay or fixed height */}
          <div className="absolute right-0 bottom-0 left-0 z-20 h-48 border-border-subtle border-t bg-panel-bg/90 backdrop-blur-md">
            {bottomPanel}
          </div>
        </main>

        {/* Right Panel (Inspector) */}
        <aside className="z-10 flex w-72 flex-col border-border-subtle border-l bg-panel-bg">
          {rightPanel}
        </aside>
      </div>
    </div>
  );
};

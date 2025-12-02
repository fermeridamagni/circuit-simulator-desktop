import { Terminal } from "lucide-react";
import type React from "react";

export const DebugConsole: React.FC = () => (
  <div className="flex h-full flex-col">
    <div className="flex h-8 items-center gap-2 border-border-subtle border-b bg-panel-bg px-3">
      <Terminal className="text-text-secondary" size={14} />
      <span className="font-bold text-text-muted text-xs uppercase tracking-wider">
        Serial Monitor / Debug
      </span>
    </div>
    <div className="flex-1 overflow-y-auto p-2 font-mono text-green-400 text-xs">
      <div>&gt; System initialized.</div>
      <div>&gt; Ready for simulation.</div>
      <div className="mt-2 text-text-muted italic">
        -- No active simulation output --
      </div>
    </div>
  </div>
);

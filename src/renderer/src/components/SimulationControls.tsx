import clsx from "clsx";
import { Pause, Play, RotateCcw, Square } from "lucide-react";
import type React from "react";
import { useCircuitStore } from "../store/useCircuitStore";

export const SimulationControls: React.FC = () => {
  const {
    simulationState,
    startSimulation,
    stopSimulation,
    pauseSimulation,
    resumeSimulation,
  } = useCircuitStore();
  const { isRunning, isPaused, time } = simulationState;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center rounded-lg border border-border-subtle bg-surface-bg p-1 shadow-sm">
        {isRunning ? (
          <>
            {isPaused ? (
              <button
                className="rounded p-2 text-green-500 transition-colors hover:bg-green-500/10"
                onClick={resumeSimulation}
                title="Resume"
                type="button"
              >
                <Play fill="currentColor" size={18} />
              </button>
            ) : (
              <button
                className="rounded p-2 text-yellow-500 transition-colors hover:bg-yellow-500/10"
                onClick={pauseSimulation}
                title="Pause"
                type="button"
              >
                <Pause fill="currentColor" size={18} />
              </button>
            )}
            <button
              className="rounded p-2 text-red-500 transition-colors hover:bg-red-500/10"
              onClick={stopSimulation}
              title="Stop"
              type="button"
            >
              <Square fill="currentColor" size={18} />
            </button>
          </>
        ) : (
          <button
            className="rounded p-2 text-green-500 transition-colors hover:bg-green-500/10"
            onClick={startSimulation}
            title="Start Simulation"
            type="button"
          >
            <Play fill="currentColor" size={18} />
          </button>
        )}
        <div className="mx-1 h-6 w-px bg-border-subtle" />
        <button
          className="rounded p-2 text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
          onClick={() => {
            stopSimulation();
            startSimulation();
          }}
          title="Restart"
          type="button"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="flex flex-col">
        <span className="font-bold text-[10px] text-text-muted uppercase tracking-wider">
          Sim Time
        </span>
        <span
          className={clsx(
            "font-mono text-sm",
            isRunning ? "text-green-400" : "text-text-secondary"
          )}
        >
          {(time / 1000).toFixed(2)}s
        </span>
      </div>
    </div>
  );
};

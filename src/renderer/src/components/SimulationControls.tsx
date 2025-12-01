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
      <div className="flex items-center rounded-lg border border-gray-700 bg-gray-900 p-1">
        {isRunning ? (
          <>
            {isPaused ? (
              <button
                className="rounded p-2 text-green-500 transition-colors hover:bg-green-900/50"
                onClick={resumeSimulation}
                title="Resume"
              >
                <Play fill="currentColor" size={18} />
              </button>
            ) : (
              <button
                className="rounded p-2 text-yellow-500 transition-colors hover:bg-yellow-900/50"
                onClick={pauseSimulation}
                title="Pause"
              >
                <Pause fill="currentColor" size={18} />
              </button>
            )}
            <button
              className="rounded p-2 text-red-500 transition-colors hover:bg-red-900/50"
              onClick={stopSimulation}
              title="Stop"
            >
              <Square fill="currentColor" size={18} />
            </button>
          </>
        ) : (
          <button
            className="rounded p-2 text-green-500 transition-colors hover:bg-green-900/50"
            onClick={startSimulation}
            title="Start Simulation"
          >
            <Play fill="currentColor" size={18} />
          </button>
        )}
        <div className="mx-1 h-6 w-px bg-gray-700" />
        <button
          className="rounded p-2 text-gray-400 transition-colors hover:bg-gray-700"
          onClick={() => {
            stopSimulation();
            startSimulation();
          }}
          title="Restart"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="flex flex-col">
        <span className="font-bold text-[10px] text-gray-500 uppercase tracking-wider">
          Sim Time
        </span>
        <span
          className={clsx(
            "font-mono text-sm",
            isRunning ? "text-green-400" : "text-gray-400"
          )}
        >
          {(time / 1000).toFixed(2)}s
        </span>
      </div>
    </div>
  );
};

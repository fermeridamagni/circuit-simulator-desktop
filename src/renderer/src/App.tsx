import { Zap } from "lucide-react";
import { CircuitCanvas } from "./components/CircuitCanvas";
import { ComponentPalette } from "./components/ComponentPalette";
import { DebugConsole } from "./components/DebugConsole";
import { Layout } from "./components/Layout";
import { PropertyInspector } from "./components/PropertyInspector";
import { SimulationControls } from "./components/SimulationControls";

function App() {
  return (
    <Layout
      bottomPanel={<DebugConsole />}
      leftPanel={<ComponentPalette />}
      rightPanel={<PropertyInspector />}
      topBar={
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded bg-blue-600 p-1">
              <Zap className="text-white" size={20} />
            </div>
            <h1 className="font-bold text-lg tracking-tight">
              Spark{" "}
              <span className="font-normal text-gray-400 text-xs">v0.1.0</span>
            </h1>
          </div>
          <SimulationControls />
          <div className="w-20" /> {/* Spacer for balance */}
        </div>
      }
    >
      <CircuitCanvas />
    </Layout>
  );
}

export default App;

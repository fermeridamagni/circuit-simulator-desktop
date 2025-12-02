import { Zap } from "lucide-react";
import { CircuitCanvas } from "./components/CircuitCanvas";
import { ComponentPalette } from "./components/ComponentPalette";
import { DebugConsole } from "./components/DebugConsole";
import { Layout } from "./components/Layout";
import { PropertyInspector } from "./components/PropertyInspector";
import { SimulationControls } from "./components/SimulationControls";
import { CodePanel } from "./components/ui/CodePanel";
import { useCircuitStore } from "./store/useCircuitStore";

function App() {
  const { selectedComponentId, components } = useCircuitStore();
  const selectedComponent = components.find(
    (c) => c.id === selectedComponentId
  );
  const isMicrocontroller = selectedComponent?.type === "microcontroller";

  return (
    <Layout
      bottomPanel={isMicrocontroller ? <CodePanel /> : <DebugConsole />}
      leftPanel={<ComponentPalette />}
      rightPanel={<PropertyInspector />}
      topBar={
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded bg-accent-primary p-1 shadow-accent-primary/20 shadow-lg">
              <Zap className="text-white" size={18} />
            </div>
            <h1 className="font-bold text-lg text-text-primary tracking-tight">
              Spark{" "}
              <span className="font-normal text-text-muted text-xs">
                v0.1.0
              </span>
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

import { Play, Save } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useCircuitStore } from "../../store/useCircuitStore";
import type { IMicrocontroller } from "../../types/Component";

export const CodePanel: React.FC = () => {
  const { selectedComponentId, components, updateComponent } =
    useCircuitStore();
  const [code, setCode] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);

  const selectedComponent = components.find(
    (c) => c.id === selectedComponentId
  );

  const isMicrocontroller = selectedComponent?.type === "microcontroller";

  useEffect(() => {
    if (isMicrocontroller) {
      const mc = selectedComponent as IMicrocontroller;
      setCode(mc.properties.program || getDefaultSketch());
    }
  }, [selectedComponentId, isMicrocontroller, selectedComponent]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleSave = () => {
    if (selectedComponentId && isMicrocontroller) {
      updateComponent(selectedComponentId, {
        properties: {
          ...selectedComponent!.properties,
          program: code,
        },
      });
    }
  };

  const handleCompile = async () => {
    if (!(selectedComponentId && isMicrocontroller)) return;

    setIsCompiling(true);
    setCompileError(null);
    handleSave(); // Save first

    try {
      // TODO: Call actual compiler service
      // For now, we'll simulate compilation or use a mock
      console.log("Compiling...");

      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock success - in real impl this would get hex from service
      // For the demo, we might just set a flag or use a pre-compiled blink hex if the code matches "blink"

      // If the code looks like the default blink, we use a known working hex for blink
      // Otherwise we might show a "Compiler not connected" warning or similar

      // For this phase, we will just save the code.
      // The SimulationCore will need to handle the "compilation" or interpretation.
      // Since we are using avr8js, we need HEX.

      // Let's try to fetch a pre-compiled blink hex if the code contains "blink"
      // Or just provide a default one for testing.

      const mockHex = `:100000000C9434000C943E000C943E000C943E004E
:100010000C943E000C943E000C943E000C943E0024
:100020000C943E000C943E000C943E000C943E0014
:100030000C943E000C943E000C943E000C943E0004
:100040000C943E000C943E000C943E000C943E00F4
:100050000C943E000C943E000C943E000C943E00E4
:100060000C943E000C943E0011241FBECFEFD8E0A2
:10007000DEBFCDBF11E0A0E0B1E0E8E9F1E002C005
:1000800005900D92A230B107D9F711E0A2E0B1E073
:1000900001C01D92A930B207E1F70E9462000C949D
:1000A00065000C94000080E28093B0001092B10083
:1000B00088E18093810080E2809380002097A1F321
:1000C0000E940000F9CF982F809181008160809306
:1000D00081008091810081608093810088E190E003
:1000E00020E030E040E050E00E944D008091810097
:1000F0008E7F80938100809181008E7F8093810082
:1001000088E190E020E030E040E050E00E944D0009
:02011000089550
:040000030000600099
:00000001FF`; // This is a very short dummy hex, likely not working real blink.
      // I will need a real blink hex for the simulation to actually work with avr8js.

      // For now, let's just save the hex property.
      updateComponent(selectedComponentId, {
        properties: {
          ...selectedComponent!.properties,
          hex: mockHex, // In real app, this comes from compiler
        },
      });
    } catch (err) {
      setCompileError("Compilation failed");
    } finally {
      setIsCompiling(false);
    }
  };

  if (!selectedComponentId) {
    return (
      <div className="flex h-full items-center justify-center text-text-muted">
        Select a component to view code
      </div>
    );
  }

  if (!isMicrocontroller) {
    return (
      <div className="flex h-full items-center justify-center text-text-muted">
        Selected component is not programmable
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-panel-bg">
      <div className="flex items-center justify-between border-border-subtle border-b px-4 py-2">
        <span className="font-medium text-sm text-text-secondary">
          {(selectedComponent as IMicrocontroller).name || "Sketch.ino"}
        </span>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-1 rounded px-2 py-1 text-text-secondary text-xs hover:bg-surface-hover"
            onClick={handleSave}
            type="button"
          >
            <Save size={14} />
            Save
          </button>
          <button
            className="flex items-center gap-1 rounded bg-accent-primary/20 px-2 py-1 text-accent-primary text-xs hover:bg-accent-primary/30 disabled:opacity-50"
            disabled={isCompiling}
            onClick={handleCompile}
            type="button"
          >
            <Play size={14} />
            {isCompiling ? "Compiling..." : "Compile & Upload"}
          </button>
        </div>
      </div>
      <textarea
        className="flex-1 resize-none bg-canvas-bg p-4 font-mono text-sm text-text-primary outline-none"
        onChange={handleCodeChange}
        spellCheck={false}
        value={code}
      />
      {compileError && (
        <div className="bg-red-500/10 px-4 py-2 text-red-500 text-xs">
          {compileError}
        </div>
      )}
    </div>
  );
};

function getDefaultSketch() {
  return `void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`;
}

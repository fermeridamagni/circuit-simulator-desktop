import { Circle, Cpu, Square, Zap } from "lucide-react";
import type React from "react";
import type { ComponentType } from "../types/Component";

export const ComponentPalette: React.FC = () => {
  const handleDragStart = (e: React.DragEvent, type: ComponentType) => {
    e.dataTransfer.setData("componentType", type);
  };

  const components: {
    type: ComponentType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { type: "resistor", label: "Resistor", icon: <Zap size={20} /> },
    { type: "led", label: "LED", icon: <Circle size={20} /> },
    { type: "button", label: "Button", icon: <Square size={20} /> },
    { type: "microcontroller", label: "Arduino Uno", icon: <Cpu size={20} /> },
  ];

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <h2 className="font-bold text-text-muted text-xs uppercase tracking-wider">
        Components
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {components.map((comp) => (
          <button
            className="flex cursor-grab flex-col items-center justify-center rounded-md border border-border-subtle bg-surface-bg p-3 transition-all hover:border-accent-primary/50 hover:bg-surface-hover active:scale-95 active:cursor-grabbing"
            draggable
            key={comp.type}
            onDragStart={(e) => handleDragStart(e, comp.type)}
            type="button"
          >
            <div className="mb-2 text-text-secondary group-hover:text-text-primary">
              {comp.icon}
            </div>
            <span className="font-medium text-text-secondary text-xs">
              {comp.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

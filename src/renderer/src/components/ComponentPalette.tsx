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
      <h2 className="font-bold text-gray-400 text-sm uppercase tracking-wider">
        Components
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {components.map((comp) => (
          <div
            className="flex cursor-grab flex-col items-center justify-center rounded border border-transparent bg-gray-700 p-3 transition-colors hover:border-blue-500 hover:bg-gray-600 active:cursor-grabbing"
            draggable
            key={comp.type}
            onDragStart={(e) => handleDragStart(e, comp.type)}
          >
            <div className="mb-2 text-blue-400">{comp.icon}</div>
            <span className="text-gray-200 text-xs">{comp.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

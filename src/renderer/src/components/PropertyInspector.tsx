import type React from "react";
import { useCircuitStore } from "../store/useCircuitStore";

export const PropertyInspector: React.FC = () => {
  const { components, selectedComponentId, updateComponent } =
    useCircuitStore();

  const selectedComponent = components.find(
    (c) => c.id === selectedComponentId
  );

  if (!selectedComponent) {
    return (
      <div className="mt-10 p-4 text-center text-gray-500 text-sm">
        Select a component to view properties
      </div>
    );
  }

  const handleChange = (key: string, value: number | string) => {
    updateComponent(selectedComponent.id, {
      properties: {
        ...selectedComponent.properties,
        [key]: value,
      },
    });
  };

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <h2 className="font-bold text-text-muted text-xs uppercase tracking-wider">
        Properties
      </h2>

      <div className="flex flex-col gap-1">
        <label className="text-text-secondary text-xs" htmlFor="component-id">
          ID
        </label>
        <input
          className="cursor-not-allowed rounded border border-border-subtle bg-surface-bg px-2 py-1 font-mono text-text-muted text-xs"
          disabled
          id="component-id"
          type="text"
          value={selectedComponent.id}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-text-secondary text-xs" htmlFor="component-name">
          Name
        </label>
        <input
          className="rounded border border-border-subtle bg-surface-bg px-2 py-1 text-sm text-text-primary outline-none transition-colors focus:border-accent-primary"
          id="component-name"
          onChange={(e) =>
            updateComponent(selectedComponent.id, { name: e.target.value })
          }
          type="text"
          value={selectedComponent.name}
        />
      </div>

      <div className="my-2 h-px bg-border-subtle" />

      {/* Dynamic Properties based on type */}
      {selectedComponent.type === "resistor" && (
        <div className="flex flex-col gap-1">
          <label
            className="text-text-secondary text-xs"
            htmlFor="resistor-resistance"
          >
            Resistance (Ω)
          </label>
          <input
            className="rounded border border-border-subtle bg-surface-bg px-2 py-1 text-sm text-text-primary outline-none transition-colors focus:border-accent-primary"
            id="resistor-resistance"
            onChange={(e) => handleChange("resistance", Number(e.target.value))}
            type="number"
            value={selectedComponent.properties.resistance}
          />
        </div>
      )}

      {selectedComponent.type === "led" && (
        <>
          <div className="flex flex-col gap-1">
            <label
              className="text-text-secondary text-xs"
              htmlFor="led-color-picker"
            >
              Color
            </label>
            <input
              className="h-8 w-full cursor-pointer rounded border border-border-subtle bg-transparent"
              id="led-color-picker"
              onChange={(e) => handleChange("color", e.target.value)}
              type="color"
              value={selectedComponent.properties.color}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              className="text-text-secondary text-xs"
              htmlFor="led-forward-voltage"
            >
              Forward Voltage (V)
            </label>
            <input
              className="rounded border border-border-subtle bg-surface-bg px-2 py-1 text-sm text-text-primary outline-none transition-colors focus:border-accent-primary"
              id="led-forward-voltage"
              onChange={(e) =>
                handleChange("forwardVoltage", Number(e.target.value))
              }
              step="0.1"
              type="number"
              value={selectedComponent.properties.forwardVoltage}
            />
          </div>
        </>
      )}
    </div>
  );
};

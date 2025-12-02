import type Konva from "konva";
import type React from "react";
import { Circle, Group, Rect } from "react-konva";
import { useCircuitStore } from "../../store/useCircuitStore";
import type { ILed } from "../../types/Component";

type LedNodeProps = {
  component: ILed;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onPinClick: (pinId: string, e: Konva.KonvaEventObject<MouseEvent>) => void;
};

export const LedNode: React.FC<LedNodeProps> = ({
  component,
  isSelected,
  onSelect,
  onDragEnd,
  onPinClick,
}) => {
  const { simulationState } = useCircuitStore();

  // Get voltage at the anode (assuming pin 0 is anode for now)
  const anodePinId = component.pins[0]?.id;
  const voltage = simulationState.nodeVoltages[anodePinId] || 0;

  // Simple brightness calculation
  const isOn = voltage > (component.properties.forwardVoltage || 1.8);
  const brightness = isOn ? Math.min((voltage - 1.8) / 2, 1) : 0.2;

  const baseColor = component.properties.color || "#ef4444"; // Red-500 default

  return (
    <Group
      draggable
      id={component.id}
      onClick={onSelect}
      onDragEnd={onDragEnd}
      onDragStart={onSelect}
      x={component.position.x}
      y={component.position.y}
    >
      {/* Selection Halo */}
      {isSelected && (
        <Rect
          cornerRadius={8}
          dash={[4, 4]}
          height={50}
          stroke="#3b82f6"
          strokeWidth={1.5}
          width={50}
          x={-25}
          y={-25}
        />
      )}

      {/* LED Body - Glassy look */}
      <Circle
        fill={baseColor}
        opacity={brightness}
        radius={12}
        shadowBlur={isOn ? 25 : 0}
        shadowColor={baseColor}
        shadowOpacity={isOn ? 0.9 : 0}
        stroke={isOn ? "#ffffff" : "#52525b"} // White glow if on, Zinc-600 if off
        strokeWidth={1.5}
      />

      {/* Inner Reflection (Shiny effect) */}
      <Circle fill="white" opacity={0.3} radius={4} x={-4} y={-4} />

      {/* Pins (Visual) */}
      <Group y={12}>
        {/* Anode (Longer) */}
        <Rect fill="#a1a1aa" height={12} width={2} x={-4} />
        {/* Cathode (Shorter) */}
        <Rect fill="#a1a1aa" height={8} width={2} x={4} />
      </Group>

      {/* Interaction Pins (Invisible Hit Areas) */}
      {component.pins.map((pin, index) => (
        <Circle
          fill="transparent"
          key={pin.id}
          onClick={(e) => {
            e.cancelBubble = true;
            onPinClick(pin.id, e);
          }}
          onMouseEnter={(e) => {
            const container = e.target.getStage()?.container();
            if (container) container.style.cursor = "crosshair";
          }}
          onMouseLeave={(e) => {
            const container = e.target.getStage()?.container();
            if (container) container.style.cursor = "default";
          }}
          radius={6}
          x={index === 0 ? -4 : 4}
          y={24}
        />
      ))}
    </Group>
  );
};

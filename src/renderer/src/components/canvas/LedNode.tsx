import type Konva from "konva";
import type React from "react";
import { Circle, Group, Rect, Text } from "react-konva";
import { useCircuitStore } from "../../store/useCircuitStore";
import type { ILed } from "../../types/Component";

interface LedNodeProps {
  component: ILed;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onPinClick: (pinId: string, e: Konva.KonvaEventObject<MouseEvent>) => void;
}

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
  const brightness = isOn ? Math.min((voltage - 1.8) / 2, 1) : 0.1;

  const baseColor = component.properties.color || "#ff0000";

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
          cornerRadius={5}
          dash={[5, 5]}
          height={50}
          stroke="#3b82f6"
          strokeWidth={2}
          width={50}
          x={-25}
          y={-25}
        />
      )}
      {/* LED Body */}
      <Circle
        fill={baseColor}
        opacity={brightness}
        radius={15}
        shadowBlur={isOn ? 20 : 0}
        shadowColor={baseColor}
        shadowOpacity={isOn ? 0.8 : 0}
        stroke="black"
        strokeWidth={1}
      />
      {/* Pins (Visual only for now) */}
      <Rect fill="#999" height={10} width={2} x={-5} y={15} /> {/* Anode */}
      <Rect fill="#999" height={8} width={2} x={3} y={15} /> {/* Cathode */}
      {/* Interaction Pins */}
      <Circle
        fill="transparent"
        onClick={(e) => onPinClick(component.pins[0].id, e)}
        onMouseEnter={(e) => {
          const container = e.target.getStage()?.container();
          if (container) container.style.cursor = "crosshair";
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage()?.container();
          if (container) container.style.cursor = "default";
        }}
        radius={4}
        stroke="transparent"
        x={-4}
        y={25}
      />
      <Circle
        fill="transparent"
        onClick={(e) => onPinClick(component.pins[1].id, e)}
        onMouseEnter={(e) => {
          const container = e.target.getStage()?.container();
          if (container) container.style.cursor = "crosshair";
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage()?.container();
          if (container) container.style.cursor = "default";
        }}
        radius={4}
        stroke="transparent"
        x={4}
        y={23}
      />
      {/* Label */}
      <Text
        align="center"
        fill="#ccc"
        fontSize={10}
        text={component.name}
        width={60}
        x={-30}
        y={30}
      />
    </Group>
  );
};

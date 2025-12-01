import type Konva from "konva";
import type React from "react";
import { Circle, Group, Rect, Text } from "react-konva";
import type { IResistor } from "../../types/Component";

interface ResistorNodeProps {
  component: IResistor;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onPinClick: (pinId: string, e: Konva.KonvaEventObject<MouseEvent>) => void;
}

export const ResistorNode: React.FC<ResistorNodeProps> = ({
  component,
  isSelected,
  onSelect,
  onDragEnd,
  onPinClick,
}) => {
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
          height={30}
          stroke="#3b82f6"
          strokeWidth={2}
          width={70}
          x={-35}
          y={-15}
        />
      )}
      {/* Resistor Body */}
      <Rect
        cornerRadius={4}
        fill="#e5e7eb"
        height={16}
        stroke="#374151"
        strokeWidth={2} // gray-200
        width={50} // gray-700
        x={-25}
        y={-8}
      />
      {/* Color Bands (Decorative for 220 ohm: Red Red Brown) */}
      <Rect fill="#ef4444" height={16} width={4} x={-15} y={-8} />
      <Rect fill="#ef4444" height={16} width={4} x={-5} y={-8} />
      <Rect fill="#78350f" height={16} width={4} x={5} y={-8} />
      <Rect fill="#d4af37" height={16} width={4} x={15} y={-8} />{" "}
      {/* Gold tolerance */}
      {/* Terminals */}
      <Rect fill="#9ca3af" height={2} width={10} x={-35} y={-1} />
      <Rect fill="#9ca3af" height={2} width={10} x={25} y={-1} />
      {/* Pins (Interaction Points) */}
      <Circle
        fill="transparent"
        name="pin-start"
        onClick={(e) =>
          component.pins[0] && onPinClick(component.pins[0].id, e)
        }
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
        x={-35}
        y={0}
      />
      <Circle
        fill="transparent"
        name="pin-end"
        onClick={(e) =>
          component.pins[1] && onPinClick(component.pins[1].id, e)
        }
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
        x={35}
        y={0}
      />
      {/* Label */}
      <Text
        align="center"
        fill="#ccc"
        fontSize={10}
        text={`${component.properties.resistance}Ω`}
        width={60}
        x={-30}
        y={15}
      />
    </Group>
  );
};

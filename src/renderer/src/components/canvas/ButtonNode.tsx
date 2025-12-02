import type Konva from "konva";
import type React from "react";
import { Circle, Group, Rect } from "react-konva";
import { useCircuitStore } from "../../store/useCircuitStore";
import type { IComponent } from "../../types/Component";

type ButtonNodeProps = {
  component: IComponent;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onPinClick: (pinId: string, e: Konva.KonvaEventObject<MouseEvent>) => void;
};

export const ButtonNode: React.FC<ButtonNodeProps> = ({
  component,
  isSelected,
  onSelect,
  onDragEnd,
  onPinClick,
}) => {
  const { updateComponent } = useCircuitStore();
  const isPressed = component.state?.isPressed;

  const handleMouseDown = () => {
    updateComponent(component.id, {
      state: { ...component.state, isPressed: true },
    });
  };

  const handleMouseUp = () => {
    updateComponent(component.id, {
      state: { ...component.state, isPressed: false },
    });
  };

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

      {/* Base */}
      <Rect
        cornerRadius={4}
        fill="#374151"
        height={40}
        width={40}
        x={-20}
        y={-20}
      />

      {/* Button Cap */}
      <Circle
        fill={isPressed ? "#b91c1c" : "#ef4444"}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        radius={12}
        shadowBlur={2}
        shadowColor="black"
        shadowOpacity={0.5} // Ensure release if mouse leaves
      />

      {/* Pins */}
      <Rect
        fill="#9ca3af"
        height={5}
        onClick={(e) =>
          component.pins[0] && onPinClick(component.pins[0].id, e)
        }
        onMouseEnter={(e) => {
          const container = e.target.getStage()?.container();
          if (container) {
            container.style.cursor = "crosshair";
          }
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage()?.container();
          if (container) {
            container.style.cursor = "default";
          }
        }}
        width={4}
        x={-20}
        y={-25}
      />
      <Rect
        fill="#9ca3af"
        height={5}
        onClick={(e) =>
          component.pins[1] && onPinClick(component.pins[1].id, e)
        }
        onMouseEnter={(e) => {
          const container = e.target.getStage()?.container();
          if (container) {
            container.style.cursor = "crosshair";
          }
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage()?.container();
          if (container) {
            container.style.cursor = "default";
          }
        }}
        width={4}
        x={16}
        y={-25}
      />
      <Rect
        fill="#9ca3af"
        height={5}
        onClick={(e) =>
          component.pins[2] && onPinClick(component.pins[2].id, e)
        }
        onMouseEnter={(e) => {
          const container = e.target.getStage()?.container();
          if (container) {
            container.style.cursor = "crosshair";
          }
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage()?.container();
          if (container) {
            container.style.cursor = "default";
          }
        }}
        width={4}
        x={-20}
        y={20}
      />
      <Rect
        fill="#9ca3af"
        height={5}
        onClick={(e) =>
          component.pins[3] && onPinClick(component.pins[3].id, e)
        }
        onMouseEnter={(e) => {
          const container = e.target.getStage()?.container();
          if (container) {
            container.style.cursor = "crosshair";
          }
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage()?.container();
          if (container) {
            container.style.cursor = "default";
          }
        }}
        width={4}
        x={16}
        y={20}
      />
    </Group>
  );
};

import type Konva from "konva";
import type React from "react";
import { Circle, Group, Rect, Text } from "react-konva";
import type { IComponent } from "../../types/Component";

interface MicrocontrollerNodeProps {
  component: IComponent;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onPinClick: (pinId: string, e: Konva.KonvaEventObject<MouseEvent>) => void;
}

export const MicrocontrollerNode: React.FC<MicrocontrollerNodeProps> = ({
  component,
  isSelected,
  onSelect,
  onDragEnd,
  onPinClick,
}) => {
  const width = 100;
  const height = 140;

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
          height={height + 10}
          stroke="#3b82f6"
          strokeWidth={2}
          width={width + 10}
          x={-width / 2 - 5}
          y={-height / 2 - 5}
        />
      )}

      {/* PCB Body */}
      <Rect
        cornerRadius={4}
        fill="#006468"
        height={height}
        stroke="#004d50"
        strokeWidth={2} // Teal PCB color
        width={width}
        x={-width / 2}
        y={-height / 2}
      />

      {/* USB Connector */}
      <Rect
        fill="#9ca3af"
        height={10}
        stroke="#4b5563"
        width={30}
        x={-15}
        y={-height / 2 - 5}
      />

      {/* Main Chip */}
      <Rect
        fill="#1f2937"
        height={30}
        rotation={45}
        width={30}
        x={-15}
        y={10}
      />

      {/* Pins - Left Side (Analog/Power) */}
      {Array.from({ length: 6 }).map((_, i) => {
        // Let's try to find pin by name "A{i}"
        const pin = component.pins.find((p) => p.name === `A${i}`);

        return (
          <Group key={`l-${i}`} x={-width / 2 + 5} y={-40 + i * 15}>
            <Circle
              fill="#d1d5db"
              onClick={(e) => pin && onPinClick(pin.id, e)}
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
              radius={3}
            />
            <Text fill="white" fontSize={8} text={`A${i}`} x={8} y={-3} />
          </Group>
        );
      })}

      {/* Pins - Right Side (Digital) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const pin = component.pins.find((p) => p.name === `D${i}`);
        return (
          <Group key={`r-${i}`} x={width / 2 - 5} y={-50 + i * 15}>
            <Circle
              fill="#d1d5db"
              onClick={(e) => pin && onPinClick(pin.id, e)}
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
              radius={3}
            />
            <Text fill="white" fontSize={8} text={`D${i}`} x={-18} y={-3} />
          </Group>
        );
      })}

      <Text
        fill="white"
        fontSize={12}
        fontStyle="bold"
        text="UNO"
        x={-20}
        y={-height / 2 + 10}
      />
    </Group>
  );
};

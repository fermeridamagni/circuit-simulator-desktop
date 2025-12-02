import type Konva from "konva";
import type React from "react";
import { Circle, Group, Rect, Text } from "react-konva";
import type { IComponent } from "../../types/Component";

type ArduinoUnoNodeProps = {
  component: IComponent;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onPinClick: (pinId: string, e: Konva.KonvaEventObject<MouseEvent>) => void;
};

export const ArduinoUnoNode: React.FC<ArduinoUnoNodeProps> = ({
  component,
  isSelected,
  onSelect,
  onDragEnd,
  onPinClick,
}) => {
  const width = 200;
  const height = 150;

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
        cornerRadius={6}
        fill="#00878F" // Arduino Teal
        height={height}
        stroke="#005f63"
        strokeWidth={1}
        width={width}
        x={-width / 2}
        y={-height / 2}
      />

      {/* USB Connector (Silver) - Top Left */}
      <Rect
        fill="#C0C0C0"
        height={40}
        stroke="#808080"
        width={45}
        x={-width / 2 - 10}
        y={-height / 2 + 15}
      />

      {/* Power Jack (Black) - Bottom Left */}
      <Rect
        fill="#1a1a1a"
        height={45}
        stroke="#000"
        width={50}
        x={-width / 2 - 5}
        y={height / 2 - 55}
      />

      {/* ATmega328P Chip - Bottom Right */}
      <Rect fill="#1a1a1a" height={14} width={100} x={10} y={30} />
      <Text fill="#aaa" fontSize={10} text="ATMEGA328P" x={25} y={32} />

      {/* Crystal Oscillator - Oval Silver */}
      <Circle
        fill="#C0C0C0"
        radius={5}
        scaleX={2}
        stroke="#808080"
        strokeWidth={1}
        x={-20}
        y={20}
      />

      {/* Reset Button - Top Left */}
      <Circle
        fill="#F0F0F0"
        radius={6}
        stroke="#C0C0C0"
        strokeWidth={1}
        x={-width / 2 + 20}
        y={-height / 2 + 15}
      />
      <Text
        fill="white"
        fontSize={8}
        text="RESET"
        x={-width / 2 + 30}
        y={-height / 2 + 12}
      />

      {/* Headers Backgrounds (Black Strips) */}
      {/* Top Header (Digital) */}
      <Rect
        fill="#1a1a1a"
        height={12}
        width={160}
        x={-40}
        y={-height / 2 + 5}
      />
      {/* Bottom Header (Power + Analog) */}
      <Rect
        fill="#1a1a1a"
        height={12}
        width={160}
        x={-40}
        y={height / 2 - 17}
      />

      {/* Labels */}
      <Text
        fill="white"
        fontSize={20}
        fontStyle="bold"
        text="UNO"
        x={55}
        y={-10}
      />
      <Text fill="white" fontSize={12} text="ARDUINO" x={50} y={-28} />
      <Text
        fill="white"
        fontSize={8}
        text="DIGITAL (~PWM)"
        x={20}
        y={-height / 2 + 20}
      />
      <Text
        fill="white"
        fontSize={8}
        text="POWER"
        x={-30}
        y={height / 2 - 30}
      />
      <Text
        fill="white"
        fontSize={8}
        text="ANALOG IN"
        x={50}
        y={height / 2 - 30}
      />

      {/* ICSP Header (2x3) - Right Edge */}
      <Group x={width / 2 - 15} y={0}>
        <Circle
          fill="#1a1a1a"
          radius={2}
          stroke="#d4af37"
          strokeWidth={1}
          x={0}
          y={0}
        />
        <Circle
          fill="#1a1a1a"
          radius={2}
          stroke="#d4af37"
          strokeWidth={1}
          x={0}
          y={6}
        />
        <Circle
          fill="#1a1a1a"
          radius={2}
          stroke="#d4af37"
          strokeWidth={1}
          x={0}
          y={12}
        />
        <Circle
          fill="#1a1a1a"
          radius={2}
          stroke="#d4af37"
          strokeWidth={1}
          x={6}
          y={0}
        />
        <Circle
          fill="#1a1a1a"
          radius={2}
          stroke="#d4af37"
          strokeWidth={1}
          x={6}
          y={6}
        />
        <Circle
          fill="#1a1a1a"
          radius={2}
          stroke="#d4af37"
          strokeWidth={1}
          x={6}
          y={12}
        />
        <Text fill="white" fontSize={5} text="ICSP" x={-5} y={18} />
      </Group>

      {/* Pins Rendering */}
      {component.pins.map((pin) => (
        <Group
          key={pin.id}
          x={pin.relativePosition.x}
          y={pin.relativePosition.y}
        >
          {/* Pin Hole */}
          <Circle
            fill="#1a1a1a" // Dark hole
            radius={3} // Gold rim
            stroke="#d4af37"
            strokeWidth={1}
          />
          {/* Hit Area */}
          <Circle
            fill="transparent"
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
          />
          {/* Label (Tiny) */}
          <Text
            fill="white"
            fontSize={6}
            text={pin.name}
            x={-4}
            y={pin.relativePosition.y < 0 ? 8 : -14} // Label below for top pins, above for bottom pins
          />
        </Group>
      ))}

      {/* ICSP Header (2x3) - Right Edge */}
      <Group x={width / 2 - 15} y={0}>
        <Circle
          fill="#1a1a1a"
          radius={2}
          stroke="#d4af37"
          strokeWidth={1}
          x={0}
          y={0}
        />
        <Circle
          fill="#1a1a1a"
          radius={2}
          stroke="#d4af37"
          strokeWidth={1}
          x={0}
          y={6}
        />
        <Circle
          fill="#1a1a1a"
          radius={2}
          stroke="#d4af37"
          strokeWidth={1}
          x={0}
          y={12}
        />
        <Circle
          fill="#1a1a1a"
          radius={2}
          stroke="#d4af37"
          strokeWidth={1}
          x={6}
          y={0}
        />
        <Circle
          fill="#1a1a1a"
          radius={2}
          stroke="#d4af37"
          strokeWidth={1}
          x={6}
          y={6}
        />
        <Circle
          fill="#1a1a1a"
          radius={2}
          stroke="#d4af37"
          strokeWidth={1}
          x={6}
          y={12}
        />
        <Text fill="white" fontSize={6} text="ICSP" x={-5} y={18} />
      </Group>

      {/* Pins Rendering */}
      {component.pins.map((pin) => (
        <Group
          key={pin.id}
          x={pin.relativePosition.x}
          y={pin.relativePosition.y}
        >
          {/* Pin Hole */}
          <Circle
            fill="#1a1a1a" // Dark hole
            radius={3} // Gold rim
            stroke="#d4af37"
            strokeWidth={1}
          />
          {/* Hit Area */}
          <Circle
            fill="transparent"
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
          />
          {/* Label (Tiny) */}
          <Text
            fill="white"
            fontSize={7}
            text={pin.name}
            x={-4}
            y={pin.relativePosition.y < 0 ? 8 : -14} // Label below for top pins, above for bottom pins
          />
        </Group>
      ))}
    </Group>
  );
};

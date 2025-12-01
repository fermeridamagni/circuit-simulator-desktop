import type Konva from "konva";
import type React from "react";
import { useRef, useState } from "react";
import { Layer, Line, Rect, Stage } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import { useCircuitStore } from "../store/useCircuitStore";
import type {
  ComponentType,
  IComponent,
  ILed,
  IResistor,
} from "../types/Component";
import { ButtonNode } from "./canvas/ButtonNode";
import { LedNode } from "./canvas/LedNode";
import { MicrocontrollerNode } from "./canvas/MicrocontrollerNode";
import { ResistorNode } from "./canvas/ResistorNode";

export const CircuitCanvas: React.FC = () => {
  const {
    components,
    connections,
    addComponent,
    updateComponent,
    selectedComponentId,
    selectComponent,
    addConnection,
  } = useCircuitStore();
  const stageRef = useRef<Konva.Stage>(null);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(1);

  // Wire creation state
  const [drawingWire, setDrawingWire] = useState<{
    startPinId: string;
    startPos: { x: number; y: number };
    currentPos: { x: number; y: number };
  } | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    const type = e.dataTransfer.getData("componentType") as ComponentType;
    if (!type) {
      return;
    }

    stage.setPointersPositions(e);
    const pointerPosition = stage.getRelativePointerPosition();

    if (pointerPosition) {
      const newComponent: IComponent = createComponent(
        type,
        pointerPosition.x,
        pointerPosition.y
      );
      addComponent(newComponent);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    if (!stage) {
      return;
    }

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    if (!pointer) {
      return;
    }

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setStageScale(newScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (drawingWire) {
      const stage = e.target.getStage();
      if (stage) {
        const pos = stage.getRelativePointerPosition();
        if (pos) {
          setDrawingWire({ ...drawingWire, currentPos: pos });
        }
      }
    }
  };

  const handleStageMouseUp = () => {
    if (drawingWire) {
      setDrawingWire(null); // Cancel wire if dropped on empty space
    }
  };

  // Helper to find absolute pin position
  const getPinPosition = (componentId: string, pinId: string) => {
    const component = components.find((c) => c.id === componentId);
    if (!component) {
      return { x: 0, y: 0 };
    }

    // This is a simplification. Ideally, components should report their pin world positions,
    // or we calculate them based on component rotation and relative pin positions.
    // For now, we'll approximate based on component type and known pin offsets.
    // A better way is to store pin world positions in the store or calculate them robustly.

    // Let's try to find the pin in the component definition
    const pin = component.pins.find((p) => p.id === pinId);
    if (pin) {
      return {
        x: component.position.x + pin.relativePosition.x,
        y: component.position.y + pin.relativePosition.y,
      };
    }
    return component.position;
  };

  const handlePinClick = (
    pinId: string,
    e: Konva.KonvaEventObject<MouseEvent>
  ) => {
    e.cancelBubble = true; // Prevent selecting component
    const stage = e.target.getStage();
    if (!stage) {
      return;
    }

    const pos = stage.getRelativePointerPosition();
    if (!pos) {
      return;
    }

    if (drawingWire) {
      // Finish wire
      if (drawingWire.startPinId !== pinId) {
        addConnection({
          id: uuidv4(),
          fromPinId: drawingWire.startPinId,
          toPinId: pinId,
        });
      }
      setDrawingWire(null);
    } else {
      // Start wire
      setDrawingWire({
        startPinId: pinId,
        startPos: getPinPosition(pinId.split("_")[0], pinId), // Better to use exact click pos or pin center? Pin center is better.
        currentPos: pos,
      });
    }
  };

  const renderComponent = (component: IComponent) => {
    const isSelected = component.id === selectedComponentId;
    const commonProps = {
      key: component.id,
      isSelected,
      onSelect: () => selectComponent(component.id),
      onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
        updateComponent(component.id, {
          position: { x: e.target.x(), y: e.target.y() },
        });
      },
      onPinClick: handlePinClick,
    };

    switch (component.type) {
      case "led":
        return <LedNode {...commonProps} component={component as ILed} />;
      case "resistor":
        return (
          <ResistorNode {...commonProps} component={component as IResistor} />
        );
      case "microcontroller":
        return <MicrocontrollerNode {...commonProps} component={component} />;
      case "button":
        return <ButtonNode {...commonProps} component={component} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="h-full w-full bg-gray-950"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Stage
        draggable={!drawingWire} // Disable stage drag when drawing wire
        height={window.innerHeight}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            selectComponent(null);
          }
        }}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onWheel={handleWheel}
        ref={stageRef}
        scaleX={stageScale}
        scaleY={stageScale}
        width={window.innerWidth - 500}
        x={stagePos.x}
        y={stagePos.y}
      >
        <Layer>
          {/* Grid (Optional) */}
          <Rect
            fill="#111827"
            height={10_000}
            width={10_000}
            x={-5000}
            y={-5000}
          />

          {/* Connections */}
          {connections.map((conn) => {
            const start = getPinPosition(
              conn.fromPinId.split("_")[0],
              conn.fromPinId
            ); // Hacky ID parsing
            const end = getPinPosition(
              conn.toPinId.split("_")[0],
              conn.toPinId
            );

            // If parsing fails, try to find component by iterating (slower but safer)
            // Actually, let's improve getPinPosition to search all components if needed or store componentId in pinId better.
            // For now, assuming pinId is `${componentId}_${pinName}` as per createComponent

            return (
              <Line
                key={conn.id}
                lineCap="round"
                lineJoin="round" // Red wire
                points={[start.x, start.y, end.x, end.y]}
                stroke="#ef4444"
                strokeWidth={3}
              />
            );
          })}

          {/* Wire being drawn */}
          {drawingWire && (
            <Line
              dash={[10, 5]}
              lineCap="round" // Blue while drawing
              lineJoin="round"
              listening={false}
              points={[
                drawingWire.startPos.x,
                drawingWire.startPos.y,
                drawingWire.currentPos.x,
                drawingWire.currentPos.y,
              ]}
              stroke="#3b82f6"
              strokeWidth={3}
            />
          )}

          {/* Components */}
          {components.map(renderComponent)}
        </Layer>
      </Stage>
    </div>
  );
};

// Helper to create components
function createComponent(
  type: ComponentType,
  x: number,
  y: number
): IComponent {
  const id = uuidv4();
  const base: IComponent = {
    id,
    type,
    name: `${type}_${id.slice(0, 4)}`,
    position: { x, y },
    rotation: 0,
    pins: [],
    properties: {},
  };

  if (type === "led") {
    return {
      ...base,
      pins: [
        {
          id: `${id}_anode`,
          componentId: id,
          name: "Anode",
          type: "digital",
          direction: "input",
          relativePosition: { x: -5, y: 15 },
        },
        {
          id: `${id}_cathode`,
          componentId: id,
          name: "Cathode",
          type: "digital",
          direction: "output",
          relativePosition: { x: 5, y: 15 },
        },
      ],
      properties: {
        color: "#ff0000",
        forwardVoltage: 2.0,
        maxCurrent: 0.02,
      },
    } as ILed;
  }

  if (type === "resistor") {
    return {
      ...base,
      pins: [
        {
          id: `${id}_p1`,
          componentId: id,
          name: "Pin 1",
          type: "digital",
          direction: "bidirectional",
          relativePosition: { x: -35, y: 0 },
        },
        {
          id: `${id}_p2`,
          componentId: id,
          name: "Pin 2",
          type: "digital",
          direction: "bidirectional",
          relativePosition: { x: 35, y: 0 },
        },
      ],
      properties: { resistance: 220 },
    };
  }

  if (type === "microcontroller") {
    const width = 100;
    // const height = 140;
    const pins: any[] = []; // Using any[] temporarily or import IPin to fix strict type

    // Analog pins (Left)
    for (let i = 0; i < 6; i++) {
      pins.push({
        id: `${id}_A${i}`,
        componentId: id,
        name: `A${i}`,
        type: "analog",
        direction: "bidirectional",
        relativePosition: { x: -width / 2 + 5, y: -40 + i * 15 },
      });
    }

    // Digital pins (Right)
    for (let i = 0; i < 8; i++) {
      pins.push({
        id: `${id}_D${i}`,
        componentId: id,
        name: `D${i}`,
        type: "digital",
        direction: "bidirectional",
        relativePosition: { x: width / 2 - 5, y: -50 + i * 15 },
      });
    }

    return {
      ...base,
      pins,
      properties: { program: "" },
    };
  }

  if (type === "button") {
    return {
      ...base,
      pins: [
        {
          id: `${id}_p1`,
          componentId: id,
          name: "Pin 1",
          type: "digital",
          direction: "bidirectional",
          relativePosition: { x: -20, y: -25 },
        },
        {
          id: `${id}_p2`,
          componentId: id,
          name: "Pin 2",
          type: "digital",
          direction: "bidirectional",
          relativePosition: { x: 16, y: -25 },
        },
        {
          id: `${id}_p3`,
          componentId: id,
          name: "Pin 3",
          type: "digital",
          direction: "bidirectional",
          relativePosition: { x: -20, y: 20 },
        },
        {
          id: `${id}_p4`,
          componentId: id,
          name: "Pin 4",
          type: "digital",
          direction: "bidirectional",
          relativePosition: { x: 16, y: 20 },
        },
      ],
    };
  }

  return base;
}

export type ComponentType = "resistor" | "led" | "microcontroller" | "button";

export interface IPosition {
  x: number;
  y: number;
}

export interface IPin {
  id: string;
  componentId: string;
  name: string; // e.g., "anode", "cathode", "pin1", "D0"
  type: "digital" | "analog" | "power" | "ground";
  direction: "input" | "output" | "bidirectional";
  relativePosition: IPosition; // Position relative to component center/top-left
}

export interface IComponent {
  id: string;
  type: ComponentType;
  name: string; // User friendly name
  position: IPosition;
  rotation: number; // in degrees
  pins: IPin[];
  properties: Record<string, any>;
}

export interface IResistor extends IComponent {
  type: "resistor";
  properties: {
    resistance: number; // in Ohms
  };
}

export interface ILed extends IComponent {
  type: "led";
  properties: {
    color: string; // hex code or name
    forwardVoltage: number; // in Volts
    maxCurrent: number; // in Amps
  };
}

export interface IConnection {
  id: string;
  fromPinId: string;
  toPinId: string;
  color?: string;
}

export interface ISimulationState {
  nodeVoltages: Record<string, number>; // pinId -> voltage
  branchCurrents: Record<string, number>; // connectionId -> current
  isRunning: boolean;
  isPaused: boolean;
  time: number; // Simulation time in ms
}

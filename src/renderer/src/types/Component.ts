export type ComponentType = "resistor" | "led" | "microcontroller" | "button";

export type IPosition = {
  x: number;
  y: number;
};

export type IPin = {
  id: string;
  componentId: string;
  name: string; // e.g., "anode", "cathode", "pin1", "D0"
  type: "digital" | "analog" | "power" | "ground";
  direction: "input" | "output" | "bidirectional";
  relativePosition: IPosition; // Position relative to component center/top-left
};

export type IComponent = {
  id: string;
  type: ComponentType;
  name: string; // User friendly name
  position: IPosition;
  rotation: number; // in degrees
  pins: IPin[];
  properties: Record<string, any>;
  state?: Record<string, any>; // Runtime state (e.g., isPressed for button)
};

export type IResistor = IComponent & {
  type: "resistor";
  properties: {
    resistance: number; // in Ohms
  };
};

export type ILed = IComponent & {
  type: "led";
  properties: {
    color: string; // hex code or name
    forwardVoltage: number; // in Volts
    maxCurrent: number; // in Amps
  };
};

export type IMicrocontroller = IComponent & {
  type: "microcontroller";
  properties: {
    program?: string; // .ino source code
    hex?: string; // compiled hex
  };
};

export type IConnection = {
  id: string;
  fromPinId: string;
  toPinId: string;
  color?: string;
};

export type ISimulationState = {
  nodeVoltages: Record<string, number>; // pinId -> voltage
  branchCurrents: Record<string, number>; // connectionId -> current
  isRunning: boolean;
  isPaused: boolean;
  time: number; // Simulation time in ms
};

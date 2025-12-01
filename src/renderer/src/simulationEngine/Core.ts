import type {
  IComponent,
  IConnection,
  ISimulationState,
} from "../types/Component";

export class SimulationCore {
  private components: IComponent[] = [];
  private connections: IConnection[] = [];
  private readonly state: ISimulationState = {
    nodeVoltages: {},
    branchCurrents: {},
    isRunning: false,
    isPaused: false,
    time: 0,
  };
  private intervalId: NodeJS.Timeout | null = null;
  private readonly tickRate = 60; // Hz

  // constructor() {}

  public updateCircuit(components: IComponent[], connections: IConnection[]) {
    this.components = components;
    this.connections = connections;
  }

  public startSimulationLoop(onUpdate: (state: ISimulationState) => void) {
    if (this.state.isRunning) {
      return;
    }

    this.state.isRunning = true;
    this.state.isPaused = false;

    this.intervalId = setInterval(() => {
      if (!this.state.isPaused) {
        this.tick();
        onUpdate({ ...this.state });
      }
    }, 1000 / this.tickRate);
  }

  stopSimulationLoop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.state.isRunning = false;
    this.state.isPaused = false;
    this.state.time = 0;
    // Reset voltages/currents?
    this.state.nodeVoltages = {};
    this.state.branchCurrents = {};
  }

  pauseSimulation() {
    this.state.isPaused = true;
  }

  resumeSimulation() {
    this.state.isPaused = false;
  }

  private tick() {
    this.state.time += 1000 / this.tickRate;
    this.solveCircuit();
  }

  private solveCircuit() {
    // Placeholder for circuit solving logic (MNA - Modified Nodal Analysis)
    // 1. Build graph
    // 2. Formulate equations (KCL/KVL)
    // 3. Solve linear system

    // For now, just a dummy update to show activity
    // Example: If there is a connection, set some dummy voltage

    // This is where the heavy lifting of SPICE-like simulation would go.
    // For the prototype, we can just simulate a simple logic:
    // If a component is connected to a source, propagate voltage.

    // Mock behavior for LED demo:
    // Find LEDs, check if they are "connected" (dummy check), set voltage
    if (this.connections.length >= 0) {
      // Dummy check to use the variable
    }

    this.components.forEach((comp) => {
      if (comp.type === "led") {
        // Random fluctuation for demo purposes if simulation is running
        const pinId = comp.pins[0]?.id;
        if (pinId) {
          // Simulate a voltage wave
          this.state.nodeVoltages[pinId] =
            2.5 + Math.sin(this.state.time / 500) * 2.5;
        }
      }
    });
  }

  getState() {
    return this.state;
  }
}

export const simulationEngine = new SimulationCore();

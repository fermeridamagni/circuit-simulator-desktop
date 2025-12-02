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

  updateCircuit(components: IComponent[], connections: IConnection[]) {
    this.components = components;
    this.connections = connections;
  }

  startSimulationLoop(onUpdate: (state: ISimulationState) => void) {
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
    // Reset voltages
    this.state.nodeVoltages = {};

    // 1. Build Adjacency List (Graph)
    const adjList = new Map<string, string[]>(); // pinId -> connectedPinIds

    // Initialize pins
    this.components.forEach((comp) => {
      comp.pins.forEach((pin) => {
        if (!adjList.has(pin.id)) adjList.set(pin.id, []);
      });
    });

    // Add wire connections
    this.connections.forEach((conn) => {
      adjList.get(conn.fromPinId)?.push(conn.toPinId);
      adjList.get(conn.toPinId)?.push(conn.fromPinId);
    });

    // 2. Identify Power Sources (For now, let's assume Arduino 5V pin is a source)
    // We need to find the Arduino component and its 5V pin (not implemented in UI yet, so let's mock a "Power" component or use a specific pin)
    // Hack: Let's say any pin named "D13" on an Arduino is HIGH (5V)

    const sources: string[] = [];
    this.components.forEach((comp) => {
      if (comp.type === "microcontroller") {
        // Assume D13 is blinking
        const d13 = comp.pins.find((p) => p.name === "D13");
        if (d13) {
          // Blink logic: 1s ON, 1s OFF
          const isHigh = Math.floor(this.state.time / 1000) % 2 === 0;
          if (isHigh) {
            this.state.nodeVoltages[d13.id] = 5;
            sources.push(d13.id);
          } else {
            this.state.nodeVoltages[d13.id] = 0;
          }
        }
      }
    });

    // 3. Propagate Voltage (BFS)
    // This is a very naive "Digital Logic" simulation, not true analog SPICE
    const queue = [...sources];
    const visited = new Set<string>(sources);

    while (queue.length > 0) {
      const currentPinId = queue.shift()!;
      const voltage = this.state.nodeVoltages[currentPinId];

      // Find component this pin belongs to
      const component = this.components.find((c) =>
        c.pins.some((p) => p.id === currentPinId)
      );

      // Propagate through wires
      const neighbors = adjList.get(currentPinId) || [];
      neighbors.forEach((neighborId) => {
        if (!visited.has(neighborId)) {
          this.state.nodeVoltages[neighborId] = voltage;
          visited.add(neighborId);
          queue.push(neighborId);
        }
      });

      // Propagate through components (Simple pass-through for now)
      if (component) {
        if (component.type === "button") {
          // If button is pressed, connect Pin 1 <-> Pin 2
          if (component.state?.isPressed) {
            // Find the "other" pin on the same side or pair
            // Simplified: Connect all pins if pressed
            component.pins.forEach((p) => {
              if (p.id !== currentPinId && !visited.has(p.id)) {
                this.state.nodeVoltages[p.id] = voltage;
                visited.add(p.id);
                queue.push(p.id);
              }
            });
          }
        } else if (component.type === "resistor") {
          // Resistors pass voltage (ignoring drop for logic sim)
          component.pins.forEach((p) => {
            if (p.id !== currentPinId && !visited.has(p.id)) {
              this.state.nodeVoltages[p.id] = voltage;
              visited.add(p.id);
              queue.push(p.id);
            }
          });
        }
      }
    }
  }

  getState() {
    return this.state;
  }
}

export const simulationEngine = new SimulationCore();

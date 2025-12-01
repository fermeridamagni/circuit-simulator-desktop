import { create } from "zustand";
import { simulationEngine } from "../simulationEngine/Core";
import type {
  IComponent,
  IConnection,
  ISimulationState,
} from "../types/Component";

interface CircuitState {
  components: IComponent[];
  connections: IConnection[];
  selectedComponentId: string | null;
  simulationState: ISimulationState;

  // Actions
  addComponent: (component: IComponent) => void;
  updateComponent: (id: string, updates: Partial<IComponent>) => void;
  removeComponent: (id: string) => void;

  addConnection: (connection: IConnection) => void;
  removeConnection: (id: string) => void;

  selectComponent: (id: string | null) => void;

  // Simulation Actions
  startSimulation: () => void;
  stopSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;

  // Internal update from engine
  syncSimulationState: (state: ISimulationState) => void;
}

export const useCircuitStore = create<CircuitState>((set, get) => ({
  components: [],
  connections: [],
  selectedComponentId: null,
  simulationState: {
    nodeVoltages: {},
    branchCurrents: {},
    isRunning: false,
    isPaused: false,
    time: 0,
  },

  addComponent: (component) => {
    set((state) => {
      const newComponents = [...state.components, component];
      simulationEngine.updateCircuit(newComponents, state.connections);
      return { components: newComponents };
    });
  },

  updateComponent: (id, updates) => {
    set((state) => {
      const newComponents = state.components.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      );
      simulationEngine.updateCircuit(newComponents, state.connections);
      return { components: newComponents };
    });
  },

  removeComponent: (id) => {
    set((state) => {
      const newComponents = state.components.filter((c) => c.id !== id);
      // Also remove connections attached to this component
      const newConnections = state.connections.filter(
        (conn) =>
          !(
            (conn.fromPinId.startsWith(id) || conn.toPinId.startsWith(id)) // Assuming pinId contains componentId or we look it up
          ) // Assuming pinId contains componentId or we look it up
      );
      simulationEngine.updateCircuit(newComponents, newConnections);
      return {
        components: newComponents,
        connections: newConnections,
        selectedComponentId:
          state.selectedComponentId === id ? null : state.selectedComponentId,
      };
    });
  },

  addConnection: (connection) => {
    set((state) => {
      const newConnections = [...state.connections, connection];
      simulationEngine.updateCircuit(state.components, newConnections);
      return { connections: newConnections };
    });
  },

  removeConnection: (id) => {
    set((state) => {
      const newConnections = state.connections.filter((c) => c.id !== id);
      simulationEngine.updateCircuit(state.components, newConnections);
      return { connections: newConnections };
    });
  },

  selectComponent: (id) => set({ selectedComponentId: id }),

  startSimulation: () => {
    simulationEngine.updateCircuit(get().components, get().connections);
    simulationEngine.startSimulationLoop((state) => {
      get().syncSimulationState(state);
    });
  },

  stopSimulation: () => {
    simulationEngine.stopSimulationLoop();
    set({
      simulationState: simulationEngine.getState(),
    });
  },

  pauseSimulation: () => {
    simulationEngine.pauseSimulation();
    set((state) => ({
      simulationState: { ...state.simulationState, isPaused: true },
    }));
  },

  resumeSimulation: () => {
    simulationEngine.resumeSimulation();
    set((state) => ({
      simulationState: { ...state.simulationState, isPaused: false },
    }));
  },

  syncSimulationState: (state) => {
    set({ simulationState: state });
  },
}));

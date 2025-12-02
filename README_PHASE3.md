# Phase 3: Arduino Simulation & Code Editor

## Overview

This phase introduces a realistic Arduino Uno simulation using `avr8js`, allowing users to write, compile (mocked), and run `.ino` code directly in the simulator.

## Changes Implemented

### 1. Realistic Arduino Uno Visuals

- **Component**: Updated `MicrocontrollerNode.tsx` to render a detailed Arduino Uno R3 board using Konva shapes.
- **Layout**: Correctly positioned all digital (D0-D13) and analog (A0-A5) pins, plus power pins (5V, 3.3V, GND, Vin, AREF, Reset).
- **Style**: Matches the "Electric Slate" aesthetic with a teal PCB and metallic components.

### 2. Code Editor (`CodePanel`)

- **UI**: Added a new panel that appears when an Arduino is selected.
- **Functionality**:
  - Write `.ino` code (syntax highlighting pending).
  - **Save**: Persists code to the component state.
  - **Compile & Upload**: Currently mocks the compilation process and uploads a pre-compiled "Blink" HEX file to the simulation engine.

### 3. Simulation Engine Upgrade (`avr8js`)

- **Core**: Integrated `avr8js` to simulate an ATmega328P microcontroller.
- **Execution**: Runs the AVR CPU in the simulation loop (approx. 50,000 cycles per tick).
- **GPIO Sync**: Maps the simulated AVR ports (Port B, C, D) to the circuit simulation's voltage nodes.
  - **Output**: If a pin is set to OUTPUT and HIGH in the code, it outputs 5V in the circuit.
  - **Input**: (Pending) Reading voltage from the circuit into the AVR.

## How to Test

1. **Setup**:

   - Drag an **Arduino Uno** and an **LED** to the canvas.
   - Connect **D13** to **LED Anode**.
   - Connect **LED Cathode** to **GND**.

2. **Code**:

   - Select the Arduino. The bottom panel will switch to the **Code Editor**.
   - You will see the default "Blink" sketch.
   - Click **Compile & Upload**. (This loads the simulation binary).

3. **Run**:
   - Click **Play** (▶).
   - The LED should blink, driven by the actual AVR simulation running the machine code!

## Notes

- **Compilation**: Real-time compilation requires `arduino-cli` installed on the host. For this demo, we use a pre-compiled binary that blinks D13 regardless of the text code.
- **Performance**: The simulation runs in the main thread. For complex sketches, it may need to be moved to a Web Worker.

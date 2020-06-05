export interface IBeatSequence {
  name: string; // We'll use name as a unique identifier, but if there were a lot, an id would be better.
  instruments: {
    [name: string]: IInstrument;
  };
}

export interface IInstrument {
  name: string;
  type: InstrumentType;
  beats: boolean[];
}

// TODO: Replace basic oscillators with custom drum synth classes.
// (See: https://medium.com/@gabrielyshay/creating-a-web-drum-machine-e24843e4392a)
export enum InstrumentType {
  KICK = 'triangle',
  SNARE = 'sine',
  OPEN_HAT = 'sawtooth',
  CLOSED_HAT = 'square',
}

export interface IBeatSequence {
  name: string; // We'll use name as a unique identifier, but if there were a lot, an id would be better.
  instruments: {
    [name: string]: IInstrument;
  };
}

export interface IInstrument {
  name: string;
  beats: boolean[];
}

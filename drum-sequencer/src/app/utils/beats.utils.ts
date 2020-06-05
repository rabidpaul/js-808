import {
  InstrumentType,
  IInstrument,
  IInstruments,
} from '../tracks-editor/tracks-editor.interface';

export function repeatToFillSequence(repeat: boolean[]): boolean[] {
  let sequence = [];
  while (sequence.length < 16) {
    sequence = sequence.concat(repeat);
  }
  return sequence.slice(0, 16);
}

export function createEmptySequence(): boolean[] {
  return new Array(16).fill(false);
}

export function createEmptyInstruments(): IInstruments {
  return {
    kick: {
      name: 'kick',
      type: InstrumentType.KICK,
      beats: createEmptySequence(),
    },
    snare: {
      name: 'snare',
      type: InstrumentType.SNARE,
      beats: createEmptySequence(),
    },
    openHat: {
      name: 'openHat',
      type: InstrumentType.OPEN_HAT,
      beats: createEmptySequence(),
    },
    closedHat: {
      name: 'closedHat',
      type: InstrumentType.CLOSED_HAT,
      beats: createEmptySequence(),
    },
  };
}

export function cloneInstruments(instruments: IInstruments): IInstruments {
  return Object.entries(instruments).reduce(
    (acc, [key, { name, type, beats }]) => {
      acc[key] = { name, type, beats: [...beats] };
      return acc;
    },
    {} as IInstruments
  );
}

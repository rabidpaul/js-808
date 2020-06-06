import { Synth } from 'tone';
export const mockSynthMap = new Map<string, any>([
  ['kick', new Synth()],
  ['snare', new Synth()],
  ['openHat', new Synth()],
  ['closedHat', new Synth()],
]);

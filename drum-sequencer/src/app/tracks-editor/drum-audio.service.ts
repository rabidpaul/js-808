import { Injectable } from '@angular/core';
import { Tone } from 'tone';
import { IBeatSequence, IInstrument } from './tracks-editor.interface';

@Injectable({
  providedIn: 'root',
})
export class DrumAudioService {
  bpm = 120;
  currentStep = 0;
  gain: any;
  instruments: { synth: any; instrument: IInstrument }[] = [];
  subdivision: string;

  onStep: () => any;

  constructor() {}

  /**
   * Sets the callback for each step in the sequence, creates a gain to control volume, connects it to master, and then
   * sets up the Transport to trigger playStep() on each note.
   * @param onStep callback function
   * @param subdivision notes within a measure
   */
  createNewAudioGraph(onStep: () => any, subdivision = '4n'): void {
    this.onStep = onStep;
    this.subdivision = subdivision;
    this.gain = new Tone.Gain(0.6);
    this.gain.toMaster();
    Tone.Transport(this.playStep, subdivision);
  }

  /**
   * Adds a new syth of the given IInstrument's type and connects it to the audio graph.
   * @param instrument to be connected to the current audio graph
   */
  connectInstrument(instrument: IInstrument): void {
    const synth = new Tone.Synth();
    synth.oscillator.type = instrument.type;
    this.instruments.push(synth);
    synth.connect(this.gain);
  }

  /**
   * Updates the current step, looping back to 0 when we reach the end of the sequence. On each step, we check each instrument, and play
   * a note from it's synth if it has a beat this step.
   */
  playStep = (time: any) => {
    this.currentStep = this.currentStep % 16;
    this.instruments.forEach(({ synth, instrument }) => {
      if (instrument.beats[this.currentStep]) {
        synth.triggerAttackRelease('C4', this.subdivision, time);
      }
    });
  };

  /**
   * Stops the current audio sequence.
   */
  stopSequenceRepeat(): void {
    Tone.Transport.stop();
  }

  /**
   * Updates the current beats per minute of the audio graph playback.
   * @param bpm beats per minute
   */
  updateBpm(bpm: number): void {
    this.bpm = bpm;
    Tone.Transport.bpm.value = bpm;
  }
}

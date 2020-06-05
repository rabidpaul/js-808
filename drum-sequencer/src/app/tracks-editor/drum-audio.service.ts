import { Injectable } from '@angular/core';
import { Gain, Synth, Transport } from 'tone';
import { IInstrument } from './tracks-editor.interface';

/**
 * DrumAudioService
 * This service manages the creation and manipulation of various audio sources with Tone.js. We create audio graphs, connected to audio
 * output. Instruments can then be attached to the graph and and beats from their sequences can be played according to the audio context's
 * timing.
 */
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
  createNewAudioGraph(onStep: () => any, subdivision = '8n'): void {
    this.onStep = onStep;
    this.subdivision = subdivision;
    this.gain = new Gain(0.6);
    this.gain.toMaster();
    Transport.scheduleRepeat(this.playStep, subdivision);
  }

  /**
   * Adds a new syth of the given IInstrument's type and connects it to the audio graph.
   * @param instrument to be connected to the current audio graph
   */
  connectInstrument(instrument: IInstrument): void {
    const synth = new Synth();
    synth.oscillator.type = instrument.type;
    this.instruments.push({ synth, instrument });
    synth.connect(this.gain);
  }

  clearInstruments(): void {
    this.instruments.forEach(({ synth }) => {
      synth.disconnect();
      synth.dispose();
      this.instruments = [];
    });
  }

  /**
   * Updates the current step, looping back to 0 when we reach the end of the sequence. On each step, we check each instrument, and play
   * a note from it's synth if it has a beat this step.
   */
  playStep = (time: any): void => {
    this.currentStep = this.currentStep % 16;
    this.instruments.forEach(({ synth, instrument }) => {
      if (instrument.beats[this.currentStep]) {
        synth.triggerAttackRelease('C4', this.subdivision, time);
      }
    });
    this.currentStep += 1;
  };

  /**
   * Starts the current audio sequence playback
   */
  startSequenceRepeat() {
    Transport.start();
  }

  /**
   * Stops the current audio sequence.
   */
  stopSequenceRepeat(): void {
    Transport.stop();
  }

  /**
   * Updates the current beats per minute of the audio graph playback.
   * @param bpm beats per minute
   */
  updateBpm(bpm: number): void {
    this.bpm = bpm;
    Transport.bpm.value = bpm;
  }
}

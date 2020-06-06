import { Injectable } from '@angular/core';
import { Gain, Sequence, Synth, Transport } from 'tone';
import {
  IInstrument,
  IBeatSequence,
  IInstruments,
  InstrumentType,
} from './tracks-editor.interface';

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
  gain = new Gain(0.6).toMaster();
  instruments: IInstruments;
  onStep: (step: number, time: any) => any;
  scheduledCallbackId: any;
  stepIndex = 0;
  synthsByInstrument = new Map<string, any>();

  constructor() {}

  /**
   * Schedules a repeated event on the Transport timeline, disposing of previous audio source nodes, and mapping new sources based on the
   * sequence's instruments passed in. The supplied callback will be invoked each time the event fires, which is every quarter note.
   * @param param0 beat sequence
   * @param callback invoked on each scheduled quarter note
   */
  scheduleAudioLoopFromSequence(
    { instruments }: IBeatSequence,
    callback: (step: number, time: any) => any
  ): void {
    if (this.scheduledCallbackId !== undefined) {
      this.disposePreviousSources();
    }
    this.synthsByInstrument = this.mapSynthsByInstrument(instruments);
    this.instruments = instruments;
    this.onStep = callback;
    this.scheduledCallbackId = Transport.scheduleRepeat(
      this.playBeats,
      '4n',
      0
    );
  }

  /**
   * Clears the transport of the recurring event previously created, and disposes of each node representing our instrument audio sources.
   * then clears the synth map.
   */
  disposePreviousSources(): void {
    Transport.clear(this.scheduledCallbackId);
    this.synthsByInstrument.forEach((synth, key) => {
      synth.dispose();
    });
    this.synthsByInstrument.clear();
  }

  /**
   * Creates a Synth object for each instrument, setting it's oscillator to the specified type, connecting it to the gain, and adding it to
   * the map.
   * @param instruments for which to create and map synth sources
   */
  mapSynthsByInstrument(instruments: IInstruments): Map<string, any> {
    return Object.values(instruments).reduce((map, { type, name }) => {
      const synth = new Synth();
      synth.oscillator.type = type;
      synth.volume.value = 1;
      synth.connect(this.gain);
      return map.set(name, synth.connect(this.gain));
    }, new Map<string, any>());
  }

  playBeats = (time: any) => {
    Object.entries(this.instruments).forEach(([k, { name, beats }]) => {
      if (beats[this.stepIndex]) {
        const synth = this.synthsByInstrument.get(name);
        synth.triggerAttackRelease('C4', '4n', time);
      }
    });
    this.onStep(this.stepIndex, time);
    this.stepIndex = (this.stepIndex + 1) % 16;
  };

  updateBpm(bpm: number): void {
    Transport.bpm.value = bpm;
  }

  startAudio(): void {
    Transport.start();
  }

  stopAudio(): void {
    Transport.stop();
  }
}

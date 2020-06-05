import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DRUM_SEQUENCES, EMPTY_SEQUENCE } from './drum-sequences.constant';
import {
  createEmptySequence,
  createEmptyInstruments,
  cloneInstruments,
} from '../utils/beats.utils';
import { IBeatSequence, InstrumentType } from './tracks-editor.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DrumAudioService } from './drum-audio.service';

@Component({
  selector: 'ds-tracks-editor',
  templateUrl: './tracks-editor.component.html',
  styleUrls: ['./tracks-editor.component.scss'],
})
export class TracksEditorComponent implements OnInit {
  isPlaying = false;
  fg: FormGroup;
  bpm = '120'; // TODO: Move BPM into the sequence itself so it's custom to each pattern.
  sequences: IBeatSequence[] = [...DRUM_SEQUENCES, { ...EMPTY_SEQUENCE }];
  sequence: IBeatSequence = DRUM_SEQUENCES[0];
  instruments = Object.keys(DRUM_SEQUENCES[0].instruments);
  beats = createEmptySequence().map((v, i) => i + 1);

  private destroy$ = new Subject<undefined>();

  constructor(private drumService: DrumAudioService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fg = this.initForm();
    this.initTrackSequence();
  }

  /**
   * Initializes the controls form and sets up the subscriptions
   */
  initForm(): FormGroup {
    const form = this.fb.group({
      bpm: this.fb.control(this.bpm, Validators.required),
      sequence: this.fb.control(this.sequences[0], Validators.required),
    });
    form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.onControlChanges);
    return form;
  }

  initTrackSequence(): void {
    this.drumService.createNewAudioGraph(this.onBeatTrigger);
    this.updateBpm(this.bpm);
    Object.entries(this.sequence.instruments).forEach(([name, instr]) => {
      this.drumService.connectInstrument(instr);
    });
  }

  onBeatTrigger = () => {};

  changeToSequence(sequence: IBeatSequence): void {
    this.drumService.clearInstruments();
    this.sequence = this.sequences.find(({ name }) => name === sequence.name);
    this.instruments = Object.keys(sequence.instruments);
    this.initTrackSequence();
  }

  /**
   * Convert a BPM-value string into an integer and update the current sequence in the drum audio service.
   * @param bpm beats per minute
   */
  updateBpm(bpm: string): void {
    this.bpm = bpm;
    this.drumService.updateBpm(parseInt(bpm, 10));
  }

  onControlChanges = ({ sequence, bpm }): void => {
    // Update sequence and instruments if changed
    if (sequence.name !== this.sequence.name) {
      this.changeToSequence(sequence);
    }
    // Update beats-per-minute if changed
    if (bpm !== this.bpm) {
      this.updateBpm(bpm);
    }
  };

  /**
   * Used by the sequence-select dropdown's compareWith function
   * @param one sequence
   * @param two sequence
   */
  compareSequenceByName(one: IBeatSequence, two: IBeatSequence): boolean {
    return one.name === two.name;
  }

  togglePlayback(start?: boolean): void {
    if (start !== undefined) {
      this.isPlaying = start;
    } else {
      this.isPlaying = !this.isPlaying;
    }
    this.isPlaying
      ? this.drumService.startSequenceRepeat()
      : this.drumService.stopSequenceRepeat();
  }

  /**
   * Toggles a beat at the specified index in the given instrument's beats array. Switches
   * @param instr instrument
   * @param index beat index
   */
  toggleBeat(instr: string, index: number): void {
    if (index !== undefined) {
      if (this.sequence.name !== EMPTY_SEQUENCE.name) {
        const i = this.sequences.findIndex(
          ({ name }) => name === EMPTY_SEQUENCE.name
        );
        const customSeq = this.sequences[i];
        this.sequences[i] = {
          ...customSeq,
          instruments: cloneInstruments(this.sequence.instruments),
        };
        this.changeToSequence(customSeq);
        this.fg.patchValue({ sequence: customSeq });
      }
      const beats = this.sequence.instruments[instr].beats;
      const beat = beats[index];
      beats[index] = !beat;
    }
  }
}

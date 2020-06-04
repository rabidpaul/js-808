import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DRUM_SEQUENCES } from './drum-sequences.constant';

interface BeatSequence {
  name: string; // We'll use name as a unique identifier, but if there were a lot, an id would be better.
  instruments: {
    [instrumentName: string]: boolean[];
  };
}

@Component({
  selector: 'ds-tracks-editor',
  templateUrl: './tracks-editor.component.html',
  styleUrls: ['./tracks-editor.component.scss'],
})
export class TracksEditorComponent implements OnInit {
  isPlaying = false;
  fg: FormGroup;
  bpm: number;
  sequences: BeatSequence[] = DRUM_SEQUENCES;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fg = this.initForm();
  }

  initForm(): FormGroup {
    return this.fb.group({
      bpm: this.fb.control('120', Validators.required),
      sequence: this.fb.control(this.sequences[0], Validators.required),
    });
  }

  compareSequenceByName(one: BeatSequence, two: BeatSequence): boolean {
    return one.name === two.name;
  }

  togglePlayback(start?: boolean): void {
    if (start !== undefined) {
      // TODO: Set play state to specific state
      this.isPlaying = start;
    } else {
      // TODO: Toggle play state
      this.isPlaying = !this.isPlaying;
    }
  }
}

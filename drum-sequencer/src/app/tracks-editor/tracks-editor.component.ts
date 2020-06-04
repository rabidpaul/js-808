import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ds-tracks-editor',
  templateUrl: './tracks-editor.component.html',
  styleUrls: ['./tracks-editor.component.scss'],
})
export class TracksEditorComponent implements OnInit {
  isPlaying = false;

  constructor() {}

  ngOnInit(): void {}

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

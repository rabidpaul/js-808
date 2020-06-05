import { TestBed } from '@angular/core/testing';

import { DrumAudioService } from './drum-audio.service';

describe('DrumAudioService', () => {
  let service: DrumAudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrumAudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

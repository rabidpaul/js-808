import {
  async,
  ComponentFixture,
  TestBed,
  inject,
} from '@angular/core/testing';

import { TracksEditorComponent } from './tracks-editor.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DrumAudioService } from './drum-audio.service';
import { DrumAudioServiceStub } from './drum-audio.service.stub';
import { PipeModule } from '../pipe/pipe.module';
import { DRUM_SEQUENCES } from './drum-sequences.constant';
import { InstrumentType } from './tracks-editor.interface';

describe('TracksEditorComponent', () => {
  let component: TracksEditorComponent;
  let fixture: ComponentFixture<TracksEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TracksEditorComponent],
      imports: [PipeModule],
      providers: [
        FormBuilder,
        { provide: DrumAudioService, useClass: DrumAudioServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracksEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initForm(), changeToSequence(), updateBpm', inject(
      [DrumAudioService],
      (ds: DrumAudioService) => {
        spyOn(component, 'initForm');
        spyOn(component, 'changeToSequence');
        spyOn(ds, 'updateBpm');
        component.ngOnInit();
        expect(component.initForm).toHaveBeenCalled();
        expect(component.changeToSequence).toHaveBeenCalled();
        expect(ds.updateBpm).toHaveBeenCalled();
      }
    ));
  });

  describe('initForm', () => {
    it('should return a FormGroup with bpm and sequence fields', () => {
      const fg = component.initForm();
      const fields = Object.keys(fg.value);
      expect(fields).toContain('bpm');
      expect(fields).toContain('sequence');
      expect(fg.value.bpm).toBe(component.bpm);
      expect(fg.value.sequence.name).toBe(component.sequence.name);
    });
  });

  describe('onBeatTrigger', () => {
    it('should next() stepIndex$', () => {
      const step = 6;
      spyOn(component.stepIndex$, 'next');
      component.onBeatTrigger(step);
      expect(component.stepIndex$.next).toHaveBeenCalledWith(step);
    });
  });

  describe('changeToSequence', () => {
    it('should call create a new audio graph with bpm and instruments for the current sequence', inject(
      [DrumAudioService],
      (ds: DrumAudioService) => {
        spyOn(ds, 'scheduleAudioLoopFromSequence');
        const [sequence] = DRUM_SEQUENCES;
        component.changeToSequence(sequence);
        Object.keys(sequence.instruments).forEach((k) => {
          expect(component.instruments).toContain(k);
        });
        expect(ds.scheduleAudioLoopFromSequence).toHaveBeenCalledWith(
          sequence,
          component.onBeatTrigger
        );
      }
    ));
  });

  describe('updateBpm', () => {
    it('should set the bpm and updated it in the service, too', inject(
      [DrumAudioService],
      (ds: DrumAudioService) => {
        const bpm = '160';
        spyOn(ds, 'updateBpm');
        component.updateBpm(bpm);
        expect(component.bpm).toBe(bpm);
        expect(ds.updateBpm).toHaveBeenCalledWith(parseInt(bpm, 10));
      }
    ));
  });

  describe('onControlChanges', () => {
    it('should update the sequence and instruments if sequence changes', () => {
      const sequence = component.sequences[1];
      component.onControlChanges({ sequence, bpm: component.bpm });
      expect(component.sequence.name).toBe(sequence.name);
    });

    it('should call updateBpm() when bpm changes', () => {
      const bpm = '190';
      spyOn(component, 'updateBpm');
      component.onControlChanges({ sequence: component.sequence, bpm });
      expect(component.updateBpm).toHaveBeenCalledWith(bpm);
    });
  });

  describe('compareSequenceByName', () => {
    it('should return false when the sequences are different', () => {
      const [one, two] = DRUM_SEQUENCES;
      const result = component.compareSequenceByName(one, two);
      expect(result).toBe(false);
    });

    it('should return true when the sequences are the same', () => {
      const [one] = DRUM_SEQUENCES;
      const result = component.compareSequenceByName(one, one);
      expect(result).toBe(true);
    });
  });

  describe('togglePlayback', () => {
    // TODO
  });

  describe('toggleBeat', () => {
    it('should update the sequenc select to Custom and copy the current sequence patterns', () => {
      // TODO
    });

    it('should set beat 3 on the sequence to true', () => {
      const index = 2;
      const instr = 'kick';
      component.sequence.instruments[instr].beats[index] = false;
      component.toggleBeat(instr, index);
      expect(component.sequence.instruments[instr].beats[index]).toBe(true);
    });

    it('should set beat 4 on the sequence to false', () => {
      const index = 3;
      const instr = 'kick';
      component.sequence.instruments[instr].beats[index] = true;
      component.toggleBeat(instr, index);
      expect(component.sequence.instruments[instr].beats[index]).toBe(false);
    });
  });
});

import { TestBed } from '@angular/core/testing';

import { DrumAudioService } from './drum-audio.service';
import { DRUM_SEQUENCES } from './drum-sequences.constant';
import { Transport } from 'tone';
import { createEmptySequence } from '../utils/beats.utils';
import { InstrumentType } from './tracks-editor.interface';
import { mockSynthMap } from './test-data';

describe('DrumAudioService', () => {
  let service: DrumAudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrumAudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('scheduleAudioLoopFromSequence', () => {
    const [sequence] = DRUM_SEQUENCES;
    const callback = () => {};

    it('should call disposePreviousSources() if scheduledCallbackId is defined', () => {
      service.scheduledCallbackId = 198;
      spyOn(service, 'disposePreviousSources');
      service.scheduleAudioLoopFromSequence(sequence, callback);
      expect(service.disposePreviousSources).toHaveBeenCalled();
    });

    it('should call mapSynthsByInstrument(), set instruments, set onStep, and call Transport.scheduleRepeat()', () => {
      spyOn(service, 'mapSynthsByInstrument');
      spyOn(Transport, 'scheduleRepeat');
      service.scheduleAudioLoopFromSequence(sequence, callback);
      expect(service.mapSynthsByInstrument).toHaveBeenCalledWith(
        sequence.instruments
      );
      expect(service.instruments).toEqual(sequence.instruments);
      expect(service.onStep).toBe(callback);
      expect(Transport.scheduleRepeat).toHaveBeenCalledWith(
        service.playBeats,
        '4n',
        0
      );
    });
  });

  describe('disposePreviousSources', () => {
    it('should call Transport.clear() and dispose all synths, clear the synths map', () => {
      const id = 999;
      service.scheduledCallbackId = id;
      spyOn(Transport, 'clear');
      const spies = Array.from(service.synthsByInstrument.values()).map(
        (synth) => {
          return spyOn(synth, 'dispose');
        }
      );
      spyOn(service.synthsByInstrument, 'clear');
      service.disposePreviousSources();
      expect(Transport.clear).toHaveBeenCalledWith(id);
      spies.forEach((spy) => {
        expect(spy).toHaveBeenCalled();
      });
      expect(service.synthsByInstrument.clear).toHaveBeenCalled();
    });
  });

  describe('mapSynthsByInstrument', () => {
    it('should create (for each instrument) a new synth with oscillator type', () => {
      const [sequence] = DRUM_SEQUENCES;
      const map = service.mapSynthsByInstrument(sequence.instruments);
      map.forEach((synth, key) => {
        expect(synth.oscillator.type).toEqual(sequence.instruments[key].type);
      });
      Array.from(map.keys()).forEach((k) => {
        expect(map.has(k));
      });
    });
  });

  describe('playBeats', () => {
    it('should call triggerAttackRelease() on only the first index of "kick"', () => {
      const instrument = 'kick';
      service.instruments = {
        ...DRUM_SEQUENCES[0].instruments,
        kick: {
          name: instrument,
          type: InstrumentType.KICK,
          beats: createEmptySequence().map((value, index) =>
            index === 0 ? true : false
          ),
        },
      };
      service.synthsByInstrument = mockSynthMap;
      service.onStep = () => {};
      service.stepIndex = 0;
      const kickSynth = service.synthsByInstrument.get(instrument);
      spyOn(kickSynth, 'triggerAttackRelease');
      const time = 1.0;
      service.playBeats(time);
      expect(kickSynth.triggerAttackRelease).toHaveBeenCalledWith(
        'C4',
        '4n',
        time
      );
    });
  });
});

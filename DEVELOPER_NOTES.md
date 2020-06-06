# Building a Drum Step Sequencer

I'm a JavaScript developer. And these are my notes about Splices coding challenge to create a drum machine.

Please refer to the [README.md](drum-sequencer/README.md) inside the Angular project folder for instructions on how to start the project.

## First Impressions:

1. This will be fun. I've wanted to play with web audio to add some atmospheric sound effects to a personal project, so this is a good excuse to build some new muscles.
2. I should have studied the music theory my guitar teacher assigned.
3. The interface seems straightforward. I'll use material for the form controls, but I'll play with some colors and layout to make this look decent.
4. The tricky part (I think) will be the timing and making the BPM dynamic.

## Tools I want to use:

- Angular/TypeScript
- Find out how to use the Web Audio API or a library to handle this.
  - [Tone.js](https://tonejs.github.io/) looks like it would help with sequence scheduling and synchronization. Plus I could likely simulate some drum sounds with it.

## Stretch Goals

- Get actual audio samples or synths of all drums (kick, snare, open hat, closed hat)
- Add a progress overlay/underlay to visually track playback.

### Inspiration

- Ableton's sequencers in their learning site: https://learningmusic.ableton.com/
- React Drum machine: https://medium.com/@gabrielyshay/creating-a-web-drum-machine-e24843e4392a

---

# Initial Engineering Design

## UX Considerations

- Playback controls: Click-response color states for all buttons, and active state for the play button.
  - Add a loop toggle button.
- Each instrument track consists of individual beat toggles. Highlight active beats in each column during playback.
  - Stick with the 4 bars for each track. Maybe indicate bar line after each 4th column, double-bar after the final one.

## Entities

- Each synth can be represented by it's own class

### Enums

- InstrumentType?

### Interfaces

- **BeatSequence:** Describes data about the 16-beat sequence, including a collection of Instrument types active during each beat.

I may need others.

## Custom Components

- Tracks Editor
- Instrument Track
- BMP Slider/Input
- Preset Select
- Play Head

## Services

- Playback Service

# Final Structure & Thoughts

I think this was fun, though my final structure ended up more monolithic than I'd like. It wasn't as simple as I'd set out thinking. I had several hard-to-track down bugs related to scheduling beats with Tone and had to start over with a new strategy them several times. Lots of ways to skin a rabbit in that library.

I thought the timing of beats with JavaScript would introduce accuracy problems down the line, which a library like Tone can help with. But even with Tone it was complex to decide how to compose audio sources and synchronize them.

The TracksEditorComponent is too large. It should be broken up into smaller components. Maybe one for each instrument track, and a small, reusable beat-toggle component would be a good step.

With more time, I'd also write more documentation for my classes.

# Final Evaluation

- How much time did you spend on the exercise, what parts took longer?

  > All considered, I think I ended up doing 5-6 hours on this. I'd stretched to include sound, and without it, I think I'd be under 4 hours. I probably would've been faster to complete this in one sitting, but kids and stuff delayed me.

  > I initially spent a bit of time showcasing how I setup global CSS in project. But then left it be to focus on the functional parts of the drum machine, which I assumed would take longer.

  > Tracking down a change-detection bug with Angular took me a second. I don't like manually triggering change detection, so I'm not proud of that solution. I'd move toward smaller components for pieces of the beats editor and switching to an on-push change-detection strategy if I had more time.

- What were the hard parts, what parts did you enjoy most?

  > I ended up having to nest the actual Angular project under another folder. The CLI didn't like having a kebab-case name with words staring in a digit.

  > I always love a blank slate when it comes to setting up a project, but the simple nature of a one-page project meant I could set aside routing and just work on controls and interactive elements, which is always more fun.

  > Figuring out how to make Tone.js work was fun with a few inspiration examples. I encountered some weird timing bugs. My lack of audio engineering concept knowledge hampered me here. Still, it was fun! I don't think I'm done with that library or the Web Audio API, for sure.

- Data modeling - How did you model the concepts of songs and
  tracks/patterns, can you explain why?

  > I created a `BeatSequence` that contained the instruments, and an array of booleans to represent the pattern for each track. Booleans are simple to flip and use as unambiguous values for control statements in JS.

  > Tone allows you to create arrays of notes and pass them in as `Sequences` or `Parts`, but I felt I lacked the music theory knowledge to make that work elegantly.

  > So I just created a scheduled `callback` and checked the current `step index` that was being highlited in the track sequencer during each callback invocation, then checked for a `beat` in each instrument track. If the value in the array at that step index was `true`, I triggered the audio source synth manually, and added highlighter classes to the active table cells.

  > This model is pretty heavily dependent on side effects, so I'd love to learn more about Tone's `Sequence` creation, and the notes, samples and `Parts` I could use to construct them. I'll bet that would turn out cleaner and more functional.

  > When a sequence changed, I simply wiped out the previous audio node synths created in the `DrumAudioService` and reinitialized with the new `BeatSequence`.

  > I miss type definitions when they're not there in a library like Tone. Made me wish I had more time to write some for the commonly used entities.

- Simplicity vs Flexibility - How flexible is your solution? Can a user
  define patterns of different lengths? Can they play at the same time?
  Can the patterns be changed in real time? Can the velocity be set?
  None of these features are expected, what is needed for you to add
  support for these?

  > It's not that flexible yet. You can only save one custom sequence, and that is in memory. Maybe I could use local storage to save sequences, other settings?

  > You CAN change the sequence and BPM during playback.

  > You can't adjust other features of the synth, subdivide notes or take advantage of the libraries other options. I need to add more sliders...

  > I'd like to add lots of Tone's default synths so you can replace sounds, or even record/upload a sample and use that. I tried to sequester most of the work with that API in the service, but there could be a cleaner set of functional flows between the component controls and the service, too. There's a lot of coupling there.

  > In retrospect, I'd create more and smaller components to make up the editor component (a beat-toggle, instrument sequence component, etc.) to encourage a more unidirectional data-flow, letting small pieces compose themselves (and their data) into a more elegant whole.

- Is your code tested? Why/why not? How would you test it (or test it better)?

  > Some. I was able to test most of the DrumAudioService and TracksEditorComponent, but not the pipe I created or the util functions for generating beat sequences. I simply ran out of time. I SHOULD write tests before each method and do more TDD. But I don't eat my veggies first either...

  > For production code, I generally achieve >90% test coverage in Angular code.

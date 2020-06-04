# Building a Drum Step Sequencer

I'm Paul Sanders, a JavaScript developer. And these are my notes about Splices coding challenge to create a drum machine.

## First Impressions:

1. This will be fun. I've wanted to play with web audio to add some atmospheric sound effects to a personal project, so this is a good excuse to build some new muscles.
2. I should have studied the music theory my guitar teacher assigned.
3. The interface seems straightforward. I'll use material for the form controls, but I'll play with some CSS animations for the playback.
4. The tricky part will be the timing and making the BPM dynamic.

## Tools I want to use:

- Angular/TypeScript
- Angular Material
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
- ***

## Custom Components

- Tracks Editor
- Instrument Track
- Beat Toggle
- BMP Slider/Input
- Preset Select
- Play Head

## Services

- Playback Service

# Final Structure & Thoughts

# Final Evaluation

- How much time did you spend on the exercise, what parts took longer?

  > I initially spent a bit of time showcasing how I setup global CSS in project. But then left it be to focus on the functional parts of the drum machine, which I assumed would take longer.

- What were the hard parts, what parts did you enjoy most?

  > I ended up having to nest the actual Angular project under another folder. The CLI didn't like having a kebab-case name with words staring in a digit.

  > I always love a blank slate when it comes to setting up a project, but the simple nature of a one-page project meant I could set aside routing and just work on controls and interactive elements, which is always more fun.

  > Figuring out how to make Tone.js work was surprisingly easy with a few inspiration examples. I don't think I'm done with that library or the Web Audio API, for sure.

- Data modeling - How did you model the concepts of songs and
  tracks/patterns, can you explain why?
  > Modeling my entities (interfaces, instruments, beat sequences) left me unsure if I had enough of a grasp on the audio engineering domain concepts to make good patterns here.
- Simplicity vs Flexibility - How flexible is your solution? Can a user
  define patterns of different lengths? Can they play at the same time?
  Can the patterns be changed in real time? Can the velocity be set?
  None of these features are expected, what is needed for you to add
  support for these?
- Is your code tested? Why/why not? How would you test it (or test it better)?

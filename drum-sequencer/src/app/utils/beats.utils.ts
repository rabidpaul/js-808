export function repeatToFillSequence(repeat: boolean[]): boolean[] {
  let sequence = [];
  while (sequence.length < 16) {
    sequence = sequence.concat(repeat);
  }
  return sequence.slice(0, 16);
}

export function createEmptySequence(): boolean[] {
  return new Array(16).fill(false);
}

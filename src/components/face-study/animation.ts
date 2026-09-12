export const STUDY_TRANSITION_MS = 2000;

export function studyEase(elapsed: number) {
  const t = Math.max(0, Math.min(1, elapsed / STUDY_TRANSITION_MS));
  return t * t * (3 - 2 * t);
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}


export const TARGET_DATE = "Dec 31, 2026";
export const EMPTY_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
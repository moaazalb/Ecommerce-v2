"use client";

import { useState, useEffect, JSX } from "react";
import "@/styles/clock.css";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TARGET_DATE = "Dec 31, 2026";
const EMPTY_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

/**
 * Clock component displaying a countdown timer to a target date.
 *
 * @returns {JSX.Element} The rendered Clock component.
 */
export default function Clock(): JSX.Element {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(EMPTY_TIME);

  useEffect(() => {
    const destination = new Date(TARGET_DATE).getTime();

    const interval = setInterval(() => {
      const difference = destination - new Date().getTime();

      if (difference < 0) {
        clearInterval(interval);
        setTimeLeft(EMPTY_TIME);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const units: { label: string; value: number }[] = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="clock_wrapper d-flex align-items-center gap-3">
      {units.map((unit, index) => (
        <div key={unit.label} className="d-flex align-items-center gap-3">
          <div className="clock__data text-center">
            <h1 className="text-white fs-3 mb-2">{unit.value}</h1>
            <h5 className="text-white fs-6">{unit.label}</h5>
          </div>
          {index < units.length - 1 && <span className="text-white fs-3">:</span>}
        </div>
      ))}
    </div>
  );
}
"use client";

import { useState, useEffect, JSX } from "react";
import { useTranslation } from "react-i18next";
import { EMPTY_TIME, TARGET_DATE, TimeLeft } from "@/types/clock";
import "@/styles/clock.css";


/**
 * Clock component displaying a countdown timer to a target date.
 *
 * @returns {JSX.Element} The rendered Clock component.
 */
export default function Clock(): JSX.Element {
  const { t } = useTranslation();
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
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const units: { label: string; value: number }[] = [
    { label: t("clock.days"), value: timeLeft.days },
    { label: t("clock.hours"), value: timeLeft.hours },
    { label: t("clock.minutes"), value: timeLeft.minutes },
    { label: t("clock.seconds"), value: timeLeft.seconds },
  ];

  return (
    <div className="clock_wrapper d-flex align-items-center gap-3">
      {units.map((unit, index) => (
        <div key={unit.label} className="d-flex align-items-center gap-3">
          <div className="clock__data text-center">
            <h1 className="text-white fs-3 mb-2">{unit.value}</h1>
            <h5 className="text-white fs-6">{unit.label}</h5>
          </div>
          {index < units.length - 1 && (
            <span className="text-white fs-3">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

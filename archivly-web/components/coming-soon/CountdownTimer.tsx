'use client';

import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-bold text-text-primary tabular-nums sm:text-4xl">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs text-text-secondary sm:text-sm">{label}</span>
    </div>
  );
}

export function CountdownTimer({ launchDate }: { launchDate: string }) {
  const target = new Date(launchDate);
  // Server-rendered pass has no clock to read, so start null and fill in
  // after mount -- avoids a hydration mismatch between server and client time.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(target));
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launchDate]);

  if (!timeLeft) {
    return <p className="text-sm text-text-secondary">We're live.</p>;
  }

  return (
    <div className="flex gap-6 sm:gap-10">
      <Unit value={timeLeft.days} label="days" />
      <Unit value={timeLeft.hours} label="hours" />
      <Unit value={timeLeft.minutes} label="min" />
      <Unit value={timeLeft.seconds} label="sec" />
    </div>
  );
}

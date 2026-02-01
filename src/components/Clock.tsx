import { useState, useEffect, useRef, memo } from 'react';

interface ClockProps {
  userName?: string;
}

export default memo(function Clock({ userName }: ClockProps) {
  const [time, setTime] = useState(new Date());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const scheduleNextMinute = () => {
      const now = new Date();
      const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

      timeoutRef.current = setTimeout(() => {
        setTime(new Date());
        scheduleNextMinute();
      }, msUntilNextMinute);
    };

    scheduleNextMinute();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getGreeting = (date: Date): string => {
    if (!userName) {
      return '오늘의 목표를 달성해보세요';
    }

    const hour = date.getHours();
    let greeting: string;

    if (hour >= 5 && hour < 12) {
      greeting = 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }

    return `${greeting}, ${userName}`;
  };

  return (
    <div className="flex flex-col items-center justify-center text-white">
      <div className="text-8xl md:text-9xl font-bold mb-4 drop-shadow-lg">
        {formatTime(time)}
      </div>
      <div className="text-xl md:text-4xl font-bold opacity-90">
        {getGreeting(time)}
      </div>
    </div>
  );
});

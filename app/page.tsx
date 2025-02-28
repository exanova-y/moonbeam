"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentHour, setCurrentHour] = useState<number>(0);
  const [randomIndex, setRandomIndex] = useState<number>(0);
  const [isNightTime, setIsNightTime] = useState<boolean>(false);
  
  // Night greetings and quotes arrays
  const nightGreetings = [
    "Hey moonbeam",
    "Hey starlight",
    "Still awake moonbeam?",
    "Good night moonbeam"
  ];

  const nightQuotes = [
    "You did well today. Time to rest up, don't forget I love you.",
    "You need to brush teeth take pills and pass out right now. ily,",
    "here's to tomorrow being a better day, ily.",
    "see you on the other side of the night, i love you."
  ];

  // Generate random index on component mount
  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * nightGreetings.length);
    setRandomIndex(randomIdx);
  }, []);

  useEffect(() => {
    // Function to update the time
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      
      setCurrentTime(now.toLocaleTimeString());
      setCurrentHour(hour);
      setIsNightTime(hour >= 22 || hour < 6); // Night time is 10pm to 6am
    };

    // Update time immediately
    updateTime();
    
    // Update time every second
    const intervalId = setInterval(updateTime, 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Full screen background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/min.jpeg"
          alt="Anime Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      
      {/* Time display overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-0 pb-40">
        <div className="text-center p-4 bg-black/50 rounded-xl backdrop-blur-sm">
          <div className="flex flex-col items-center mb-2">
            {isNightTime ? (
              <>
                <h1 className="text-3xl font-bold mb-2 text-white" style={{ fontFamily: "'Inria Serif', serif" }}>
                  {nightGreetings[randomIndex]}
                </h1>
                <p className="text-xl mb-4 text-white" style={{ fontFamily: "'Inria Serif', serif" }}>
                  {nightQuotes[randomIndex]}
                </p>
              </>
            ) : (
              <h1 className="text-3xl font-bold mb-2 text-white" style={{ fontFamily: "'Inria Serif', serif" }}>
                Current Time
              </h1>
            )}
          </div>
          <div className="text-2xl px-6 py-2 rounded-lg text-white" style={{ fontFamily: "'Inria Serif', serif" }}>
            {currentTime}
          </div>
        </div>
      </div>
    </div>
  );
}

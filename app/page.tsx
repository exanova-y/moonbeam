"use client";

import { useState, useEffect } from "react";
import axios from "axios";


// Default fallback messages in case API call fails
const fallbackMessages = {
  morning: [
    {
      greeting: "Hey sunbeam",
      quote: "Rise and shine! Today is full of possibilities."
    }
  ],
  afternoon: [
    {
      greeting: "Good afternoon skybeam",
      quote: "Hope your day is going well. Keep pushing forward."
    }
  ],
  evening: [
    {
      greeting: "Good evening moonbeam",
      quote: "The day is winding down. You've learned a lot."
    }
  ],
  night: [
    {
      greeting: "Hey starlight",
      quote: "You did well today. Time to rest up, don't forget I love you."
    }
  ]
};

// Function to call Deepseek API to get personalized messages
const fetchDeepseekMessage = async (timePeriod: string): Promise<{greeting: string, quote: string}> => {
  try {
    // Replace with your actual Deepseek API endpoint and key
    const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || "";
    const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
    
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a supportive entity who generates celestial greetings and inspirational quotes. " +
            "example: Goodnight moonbeam. Progress isn't progress if you don't get to see it tomorrow, I love you. " +
            "example 2: still awake moonbeam? you need to brush teeth take pills and pass out right now. ily <3 " +
            "example 3: good morning sunbeam let's see what we can achieve today! ily! " +
            "example 4: hey sunbeam, time to take your coffee and drink your pills and prime your brain to predict good things for today. I love you " +
            "example 5: Good evening moonbeam :) We r out watching the planets 🌌🌃🌒 " +
            "example 6: Gm sunbeam!" + 
            "example 7: hey starlight. affection is all you need." +
            "example 8: Good night moonbeam, here's to tomorrow being a better day, ily." +
            "The current local time is: " + timePeriod + ". (morning: 5:01am-12pm, afternoon: 12:01pm-5pm, " +
            "evening: 5:01pm-10pm, night: 10:01pm-5am). Output a short endearing greeting such as moonbeam, starlight, skybeam or similar, based on the time period, and a short quote of 1 sentence with linguistic conciseness and informality seen on the internet. Do not use quotation marks. Follow sub specie aeternitatis, using a gentle, kind, eternal tone."
          },
          {
            role: "user",
            content: "Generate a greeting and quote for " + timePeriod + " time."
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + DEEPSEEK_API_KEY
        }
      }
    );
    
    // Parse the response to extract greeting and quote
    const content = response.data.choices[0].message.content;
    const lines = content.split('\n').filter((line: string) => line.trim() !== '');
    
    return {
      greeting: lines[0] || "Good " + timePeriod + " moonbeam",
      quote: lines[1] || ""
    };
  } catch (error) {
    console.error("Error fetching from Deepseek API:", error);
    // Return a fallback message if API call fails
    const fallbackArray = fallbackMessages[timePeriod as keyof typeof fallbackMessages];
    return fallbackArray[Math.floor(Math.random() * fallbackArray.length)];
  }
};

// Function to determine the current time period based on the requirements:
// - 5:01 am - 12pm: morning
// - 12:01pm - 5pm: afternoon
// - 5:01pm - 10pm: evening
// - 10:01pm - 5 am: night
const getTimePeriod = (hour: number, minute: number): string => {
  // Morning: 5:01 AM - 12:00 PM
  if ((hour === 5 && minute > 0) || (hour > 5 && hour < 12)) {
    return "morning";
  } 
  // Afternoon: 12:01 PM - 5:00 PM
  else if ((hour === 12 && minute > 0) || (hour > 12 && hour < 17)) {
    return "afternoon";
  } 
  // Evening: 5:01 PM - 10:00 PM
  else if ((hour === 17 && minute > 0) || (hour > 17 && hour < 22)) {
    return "evening";
  } 
  // Night: 10:01 PM - 5:00 AM
  else {
    return "night";
  }
};

// Function to get a random video based on time period
const getRandomVideo = (timePeriod: string): string => {
  let folderPath = "";
  
  switch(timePeriod) {
    case "morning":
      folderPath = "/day";
      break;
    case "afternoon":
      folderPath = "/afternoon";
      break;
    case "evening":
      folderPath = "/evening";
      break;
    case "night":
    default:
      folderPath = "/night";
      break;
  }
  
  // Define available videos for each time period
  const videos = {
    morning: ["/day/coastal-moewalls-com.mp4"],
    afternoon: [
      "/afternoon/lofi-house-cloudy-day-moewalls-com.mp4",
      "/afternoon/luffy-on-the-beach-one-piece-moewalls-com.mp4"
    ],
    evening: [
      "/evening/alone-at-the-train-station-moewalls-com.mp4",
      "/evening/yukino-winter-snow-oregairu-moewalls-com.mp4"
    ],
    night: [
      "/night/night-1.mp4",
      "/night/village-winter-night-moewalls-com.mp4"
    ]
  };
  
  // Get videos for the current time period
  const timeVideos = videos[timePeriod as keyof typeof videos];
  
  // Return a random video from the array
  return timeVideos[Math.floor(Math.random() * timeVideos.length)];
};

// Time period symbols for loading animation
const timeSymbols = {
  morning: "☀︎",
  afternoon: "☁︎",
  evening: "☾",
  night: "⋆⁺₊"
};

export default function Home() {
  const [timeState, setTimeState] = useState({
    currentTime: "",
    timePeriod: "night"
  });
  const [message, setMessage] = useState({
    greeting: "Hello moonbeam",
    quote: "Loading your personalized message..."
  });
  const [isLoading, setIsLoading] = useState(true);
  const [symbolVisible, setSymbolVisible] = useState(true);
  const [videoSrc, setVideoSrc] = useState("");
  const [fadeIn, setFadeIn] = useState(false);
  
  // Animation effect for flashing symbol
  useEffect(() => {
    if (isLoading) {
      const flashInterval = setInterval(() => {
        setSymbolVisible(prev => !prev);
      }, 800);
      
      return () => clearInterval(flashInterval);
    } else {
      setSymbolVisible(true);
    }
  }, [isLoading]);
  
  // Fade-in effect when page loads
  useEffect(() => {
    // Start fade-in animation after a short delay
    const fadeTimer = setTimeout(() => {
      setFadeIn(true);
    }, 500);
    
    return () => clearInterval(fadeTimer);
  }, []);
  
  // Function to fetch a new message from Deepseek API
  const fetchNewMessage = async (timePeriod: string) => {
    setIsLoading(true);
    try {
      const newMessage = await fetchDeepseekMessage(timePeriod);
      setMessage(newMessage);
    } catch (error) {
      console.error("Error fetching message:", error);
      // Use fallback message if API call fails
      const fallbackArray = fallbackMessages[timePeriod as keyof typeof fallbackMessages];
      setMessage(fallbackArray[Math.floor(Math.random() * fallbackArray.length)]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Effect for initial message fetch and video selection - runs only once on component mount
  useEffect(() => {
    // Use India Standard Time (IST) for testing purposes
    const now = new Date();
    // Calculate IST hours and minutes (UTC+5:30)
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();
    
    // Add 5 hours and 30 minutes for IST
    let istHour = utcHour + 5;
    let istMinute = utcMinute + 30;
    
    // Adjust if minutes overflow
    if (istMinute >= 60) {
      istHour += 1;
      istMinute -= 60;
    }
    
    // Adjust if hours overflow
    if (istHour >= 24) {
      istHour -= 24;
    }
    
    const initialTimePeriod = getTimePeriod(istHour, istMinute);
    
    // Format IST time string
    const istTimeString = `IST: ${istHour.toString().padStart(2, '0')}:${istMinute.toString().padStart(2, '0')}`;
    
    // Set initial time state with IST time
    setTimeState({
      currentTime: istTimeString,
      timePeriod: initialTimePeriod
    });
    
    // Initial fetch and set initial video - only happens once
    fetchNewMessage(initialTimePeriod);
    setVideoSrc(getRandomVideo(initialTimePeriod));
  }, []);
  
  // Separate effect for time updates - runs continuously
  useEffect(() => {
    // Function to update just the time using IST
    const updateTime = () => {
      const now = new Date();
      // Calculate IST hours and minutes (UTC+5:30)
      const utcHour = now.getUTCHours();
      const utcMinute = now.getUTCMinutes();
      
      // Add 5 hours and 30 minutes for IST
      let istHour = utcHour + 5;
      let istMinute = utcMinute + 30;
      
      // Adjust if minutes overflow
      if (istMinute >= 60) {
        istHour += 1;
        istMinute -= 60;
      }
      
      // Adjust if hours overflow
      if (istHour >= 24) {
        istHour -= 24;
      }
      
      const newTimePeriod = getTimePeriod(istHour, istMinute);
      
      // Format IST time string
      const istTimeString = `IST: ${istHour.toString().padStart(2, '0')}:${istMinute.toString().padStart(2, '0')}`;
      
      // Update time state with IST time, but don't fetch new messages
      setTimeState({
        currentTime: istTimeString,
        timePeriod: newTimePeriod
      });
    };
    
    // Update time immediately and then every second for smooth time display
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Black overlay that fades out */}
      <div 
        className="absolute inset-0 bg-black z-20 transition-opacity duration-2000"
        style={{ 
          opacity: fadeIn ? 0 : 1,
          pointerEvents: 'none'
        }}
      />
      
      {/* Background video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {videoSrc && (
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full"
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              pointerEvents: 'none'
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/30 z-[1]"></div>
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center min-h-screen pt-0 pb-0">
        <div className="text-center p-4 bg-black/50 rounded-xl backdrop-blur-sm w-4/5 mx-auto" style={{ marginTop: 'calc(66vh - 100px)' }}>
          <div className="flex flex-col items-center mb-2">
            {isLoading ? (
              <span className="text-5xl mb-7 text-white" style={{ opacity: symbolVisible ? 1 : 0.3, transition: 'opacity 0.3s ease' }}>
                {timeSymbols[timeState.timePeriod as keyof typeof timeSymbols]}
              </span>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-2 text-white" style={{ fontFamily: "'Inria Serif', serif" }}>
                  {message.greeting}
                </h1>
                <p className="text-xl mb-4 text-white" style={{ fontFamily: "'Inria Serif', serif" }}>
                  {message.quote}
                </p>
              </>
            )}
          </div>
          <div className="text-2xl px-6 py-2 rounded-lg text-white" style={{ fontFamily: "'Inria Serif', serif" }}>
            {timeState.currentTime}
          </div>
        </div>
      </div>
    </div>
  );
}

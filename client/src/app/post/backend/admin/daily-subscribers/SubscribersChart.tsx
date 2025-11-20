"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TrendingUp, Clock, Zap } from 'lucide-react';

const INITIAL_SUBSCRIBER_COUNT: number = 100000;
const UPDATE_INTERVAL_MS: number = 1500; // 1.5 seconds

/**
 * SubscriberCounter: Component to simulate and display real-time subscriber count.
 */
const SubscriberCounter: React.FC = () => {
  const [subscribers, setSubscribers] = useState<number>(INITIAL_SUBSCRIBER_COUNT);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Simulation logic
  const simulateUpdate = useCallback(() => {
    setIsUpdating(true);
    // Randomly increase subscribers by 1 to 7
    const increaseAmount = Math.floor(Math.random() * 7) + 1;
    
    setSubscribers(prevSubscribers => prevSubscribers + increaseAmount);
    setLastUpdateTime(new Date());
    
    // Briefly show the update animation
    setTimeout(() => setIsUpdating(false), 500);
  }, []);

  // Set up the interval timer
  useEffect(() => {
    const intervalId = setInterval(simulateUpdate, UPDATE_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [simulateUpdate]);

  // Format the subscriber count (e.g., 100,000)
  const formattedSubscribers: string = useMemo(() => {
    return subscribers.toLocaleString('en-US');
  }, [subscribers]);
  
  // Format the last update time
  const formattedTime: string = useMemo(() => {
    return lastUpdateTime.toLocaleTimeString('en-US');
  }, [lastUpdateTime]);

  return (
    <div className="
        max-w-2xl w-full mx-auto p-8 lg:p-12 
        bg-gray-900 text-white 
        rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] 
        border border-gray-700
        transition-all duration-300
    ">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-red-700 pb-4 mb-8">
        <h1 className="text-3xl font-bold text-red-500 flex items-center">
          <TrendingUp className="w-7 h-7 mr-3 text-red-500 animate-pulse-slow" />
          Real-Time Channel Stats
        </h1>
      </div>
      
      {/* Main Display Card */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-2xl shadow-xl mb-8">
        <p className="text-lg font-medium opacity-80 mb-2">
          Current Subscriber Count
        </p>

        <div className="flex items-center justify-center">
          <span className="text-4xl font-extrabold mr-4">$</span>
          {/* Subscriber Number with Animation */}
          <p className={`
              text-7xl lg:text-9xl font-black font-mono 
              leading-none tracking-tighter transition-all duration-300
              ${isUpdating ? 'text-red-300 scale-105' : 'text-white scale-100'}
          `}>
            {formattedSubscribers}
          </p>
        </div>
      </div>

      {/* Status Footer */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 pt-4">
        {/* Update Frequency */}
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <p>
            Status: <span className="font-semibold text-green-400">Live Simulation</span> 
          </p>
        </div>
        
        {/* Last Update Time */}
        <div className="flex items-center space-x-2 justify-end">
          <Clock className="w-4 h-4 text-blue-400" />
          <p>
            Last Update: <span className="font-semibold text-white">{formattedTime}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriberCounter;
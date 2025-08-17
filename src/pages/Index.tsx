import React, { useState } from 'react';
import { WeeklyCalendar } from '@/components/WeeklyCalendar';
import { QuickInput } from '@/components/QuickInput';
import { ReminderBox } from '@/components/ReminderBox';
import { OptimizationSuggestions } from '@/components/OptimizationSuggestions';
import { Header } from '@/components/Header';

const Index = () => {
  // Sample reminders data - in real app this would come from state/API
  const [todayReminders, setTodayReminders] = useState([
    {
      id: '1',
      title: 'Morning Focus Block',
      time: '9:00 AM',
      category: 'Deep Work',
      categoryColor: 'category-1'
    },
    {
      id: '2',
      title: 'Team Standup',
      time: '2:00 PM',
      category: 'Meetings',
      categoryColor: 'category-2'
    }
  ]);

  // Time blocks state for the weekly calendar
  const [timeBlocks, setTimeBlocks] = useState([]);

  const handleDismissReminder = (reminderId: string) => {
    setTodayReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
  };

  // Function to add new time blocks from Quick Schedule
  const handleAddTimeBlock = (input: string) => {
    // Simple natural language parsing
    const newTimeBlock = parseNaturalLanguageInput(input);
    if (newTimeBlock) {
      setTimeBlocks(prev => [...prev, newTimeBlock]);
    }
  };

  // Enhanced natural language parser
  const parseNaturalLanguageInput = (input: string) => {
    const lowercaseInput = input.toLowerCase();
    let title = input.trim();
    
    // Default values - use current time + 1 hour as default
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();
    
    // Convert Sunday=0 to our Monday=0 system
    let day = currentDay === 0 ? 6 : currentDay - 1;
    
    // Default to next hour
    let defaultStartHour = currentHour + 1;
    let defaultPeriod = defaultStartHour >= 12 ? 'PM' : 'AM';
    let displayHour = defaultStartHour > 12 ? defaultStartHour - 12 : defaultStartHour;
    if (displayHour === 0) displayHour = 12;
    
    let startTime = `${displayHour}:00 ${defaultPeriod}`;
    let endTime = `${displayHour + 1 > 12 ? displayHour + 1 - 12 : displayHour + 1}:00 ${defaultStartHour + 1 >= 12 ? 'PM' : 'AM'}`;
    let category = 'General';
    let categoryColor = 'category-1';
    
    // Extract day of week
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayMatch = days.find(d => lowercaseInput.includes(d));
    if (dayMatch) {
      day = days.indexOf(dayMatch);
      title = title.replace(new RegExp(dayMatch, 'gi'), '').trim();
    } else {
      // Check for relative days
      if (lowercaseInput.includes('tomorrow')) {
        day = currentDay === 0 ? 0 : currentDay; // Tomorrow in our Monday=0 system
        title = title.replace(/tomorrow/gi, '').trim();
      } else if (lowercaseInput.includes('today')) {
        day = currentDay === 0 ? 6 : currentDay - 1; // Today in our Monday=0 system
        title = title.replace(/today/gi, '').trim();
      }
    }
    
    // Handle time phrases first
    const timeWords = {
      'morning': { start: '9:00 AM', end: '10:00 AM' },
      'afternoon': { start: '2:00 PM', end: '3:00 PM' },
      'evening': { start: '6:00 PM', end: '7:00 PM' },
      'noon': { start: '12:00 PM', end: '1:00 PM' },
      'midnight': { start: '12:00 AM', end: '1:00 AM' }
    };
    
    Object.entries(timeWords).forEach(([word, times]) => {
      if (lowercaseInput.includes(word)) {
        startTime = times.start;
        endTime = times.end;
        title = title.replace(new RegExp(word, 'gi'), '').trim();
      }
    });
    
    // Extract specific time patterns - improved regex
    const timePattern = /(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)/gi;
    const timeMatches = [...input.matchAll(timePattern)];
    
    if (timeMatches.length > 0) {
      const [, hours, minutes = '00', period] = timeMatches[0];
      const cleanPeriod = period.replace(/\./g, '').toUpperCase();
      startTime = `${hours}:${minutes} ${cleanPeriod}`;
      
      // Remove time from title
      title = title.replace(timePattern, '').trim();
      
      // Calculate end time (1 hour later)
      const startHour24 = parseInt(hours) + (cleanPeriod === 'PM' && hours !== '12' ? 12 : 0);
      const endHour24 = startHour24 + 1;
      const endHour12 = endHour24 > 12 ? endHour24 - 12 : endHour24;
      const endPeriod = endHour24 >= 12 ? 'PM' : 'AM';
      
      endTime = `${endHour12 === 0 ? 12 : endHour12}:${minutes} ${endPeriod}`;
      
      // If there's a second time, use it as end time
      if (timeMatches.length > 1) {
        const [, endHours, endMinutes = '00', endPeriodRaw] = timeMatches[1];
        const cleanEndPeriod = endPeriodRaw.replace(/\./g, '').toUpperCase();
        endTime = `${endHours}:${endMinutes} ${cleanEndPeriod}`;
      }
    }
    
    // Extract duration if specified
    const durationPattern = /(\d+)\s*(hour|hr|minute|min)s?/gi;
    const durationMatch = input.match(durationPattern);
    if (durationMatch) {
      title = title.replace(durationPattern, '').trim();
      
      const [, amount, unit] = durationMatch[0].match(/(\d+)\s*(hour|hr|minute|min)s?/i) || [];
      if (unit.startsWith('hour') || unit === 'hr') {
        // Parse start time to calculate proper end time
        const [, startHours, startMinutes = '00', startPeriod] = startTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i) || [];
        let startHour24 = parseInt(startHours);
        if (startPeriod === 'PM' && startHours !== '12') startHour24 += 12;
        if (startPeriod === 'AM' && startHours === '12') startHour24 = 0;
        
        const endHour24 = startHour24 + parseInt(amount);
        const endHour12 = endHour24 > 12 ? endHour24 - 12 : endHour24;
        const endPeriod = endHour24 >= 12 ? 'PM' : 'AM';
        
        endTime = `${endHour12 === 0 ? 12 : endHour12}:${startMinutes} ${endPeriod}`;
      }
    }
    
    // Determine category based on keywords
    if (lowercaseInput.includes('meeting') || lowercaseInput.includes('standup') || lowercaseInput.includes('call') || lowercaseInput.includes('sync')) {
      category = 'Meetings';
      categoryColor = 'category-2';
    } else if (lowercaseInput.includes('focus') || lowercaseInput.includes('work') || lowercaseInput.includes('code') || lowercaseInput.includes('dev') || lowercaseInput.includes('deep')) {
      category = 'Deep Work';
      categoryColor = 'category-1';
    } else if (lowercaseInput.includes('break') || lowercaseInput.includes('lunch') || lowercaseInput.includes('eat') || lowercaseInput.includes('coffee')) {
      category = 'Breaks';
      categoryColor = 'category-3';
    } else if (lowercaseInput.includes('exercise') || lowercaseInput.includes('gym') || lowercaseInput.includes('workout') || lowercaseInput.includes('run')) {
      category = 'Health';
      categoryColor = 'category-4';
    }
    
    // Clean up title more carefully
    title = title
      .replace(/\s+/g, ' ')
      .replace(/^(for|at|on|from|to|the|a|an)\s+/gi, '')
      .replace(/\s+(for|at|on|from|to)$/gi, '')
      .trim();
    
    if (!title || title.length < 2) {
      title = 'New Event';
    }
    
    return {
      id: Date.now().toString(),
      title,
      startTime,
      endTime,
      day,
      category,
      categoryColor,
      hasReminder: false,
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Reminders Box - Conditional Display */}
        {todayReminders.length > 0 && (
          <div className="mb-6 animate-fade-in">
            <ReminderBox 
              reminders={todayReminders} 
              onDismiss={handleDismissReminder}
            />
          </div>
        )}


        {/* Weekly Schedule - Modified Display */}
        <div className="mb-6">
          <WeeklyCalendar timeBlocks={timeBlocks} />
        </div>

        {/* Quick Schedule Box - Moved to Bottom */}
        <div className="mb-6">
          <QuickInput onAddTimeBlock={handleAddTimeBlock} />
        </div>
      </div>
    </div>
  );
};

export default Index;

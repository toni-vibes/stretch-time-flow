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

  // Basic natural language parser
  const parseNaturalLanguageInput = (input: string) => {
    const lowercaseInput = input.toLowerCase();
    
    // Extract title (everything before time-related words)
    let title = input.trim();
    
    // Default values
    let day = 0; // Monday
    let startTime = '9:00 AM';
    let endTime = '10:00 AM';
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
        const today = new Date().getDay();
        day = today === 0 ? 1 : (today === 6 ? 0 : today); // Tomorrow
        title = title.replace(/tomorrow/gi, '').trim();
      } else if (lowercaseInput.includes('today')) {
        const today = new Date().getDay();
        day = today === 0 ? 6 : today - 1; // Convert Sunday=0 to Saturday=6, others -1
        title = title.replace(/today/gi, '').trim();
      }
    }
    
    // Extract time patterns
    const timePattern = /(\d{1,2}):?(\d{0,2})\s*(am|pm)/gi;
    const timeMatches = input.match(timePattern);
    
    if (timeMatches && timeMatches.length > 0) {
      startTime = timeMatches[0];
      title = title.replace(timePattern, '').trim();
      
      // If only one time provided, assume 1 hour duration
      if (timeMatches.length === 1) {
        const [, hours, minutes = '00', period] = startTime.match(/(\d{1,2}):?(\d{0,2})\s*(am|pm)/i) || [];
        let endHour = parseInt(hours) + 1;
        let endPeriod = period;
        
        if (endHour > 12) {
          endHour = endHour - 12;
          endPeriod = period === 'am' ? 'pm' : 'am';
        }
        if (endHour === 12 && period === 'am') {
          endPeriod = 'pm';
        }
        
        endTime = `${endHour}:${minutes} ${endPeriod}`;
      } else {
        endTime = timeMatches[1];
      }
    }
    
    // Extract duration if specified
    const durationPattern = /(\d+)\s*(hour|hr|minute|min)/gi;
    const durationMatch = input.match(durationPattern);
    if (durationMatch) {
      title = title.replace(durationPattern, '').trim();
      // Calculate end time based on duration (simplified)
      const [, amount, unit] = durationMatch[0].match(/(\d+)\s*(hour|hr|minute|min)/i) || [];
      if (unit.startsWith('hour') || unit === 'hr') {
        const [, hours, minutes = '00', period] = startTime.match(/(\d{1,2}):?(\d{0,2})\s*(am|pm)/i) || [];
        let endHour = parseInt(hours) + parseInt(amount);
        let endPeriod = period;
        
        if (endHour > 12) {
          endHour = endHour - 12;
          endPeriod = period === 'am' ? 'pm' : 'am';
        }
        if (endHour === 12 && period === 'am') {
          endPeriod = 'pm';
        }
        
        endTime = `${endHour}:${minutes} ${endPeriod}`;
      }
    }
    
    // Determine category based on keywords
    if (lowercaseInput.includes('meeting') || lowercaseInput.includes('standup') || lowercaseInput.includes('call')) {
      category = 'Meetings';
      categoryColor = 'category-2';
    } else if (lowercaseInput.includes('focus') || lowercaseInput.includes('work') || lowercaseInput.includes('code') || lowercaseInput.includes('dev')) {
      category = 'Deep Work';
      categoryColor = 'category-1';
    } else if (lowercaseInput.includes('break') || lowercaseInput.includes('lunch') || lowercaseInput.includes('eat')) {
      category = 'Breaks';
      categoryColor = 'category-3';
    } else if (lowercaseInput.includes('exercise') || lowercaseInput.includes('gym') || lowercaseInput.includes('workout')) {
      category = 'Health';
      categoryColor = 'category-4';
    }
    
    // Clean up title
    title = title.replace(/\s+/g, ' ').replace(/^(for|at|on)\s+/gi, '').trim();
    
    if (!title) {
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

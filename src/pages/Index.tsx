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

  const handleDismissReminder = (reminderId: string) => {
    setTodayReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
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
          <WeeklyCalendar />
        </div>

        {/* Quick Schedule Box - Moved to Bottom */}
        <div className="mb-6">
          <QuickInput />
        </div>
      </div>
    </div>
  );
};

export default Index;

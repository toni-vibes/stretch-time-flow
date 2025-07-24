import React, { useState } from 'react';
import { Bell, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Reminder {
  id: string;
  title: string;
  time: string;
  category: string;
  categoryColor: string;
}

interface ReminderBoxProps {
  reminders: Reminder[];
  onDismiss: (reminderId: string) => void;
}

export const ReminderBox = ({ reminders, onDismiss }: ReminderBoxProps) => {
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set());

  const handleDismiss = (reminderId: string) => {
    setDismissingIds(prev => new Set([...prev, reminderId]));
    // Delay the actual removal to allow fade animation
    setTimeout(() => {
      onDismiss(reminderId);
      // TODO: When Analytics feature is added, store dismissed reminder data here
      // This should save: { reminderId, dismissedAt: new Date(), ...reminderData }
      // so it can be retrieved and restored to main screen later
    }, 300);
  };

  if (!reminders || reminders.length === 0) {
    return null; // Conditional display - only show when reminders exist
  }

  return (
    <Card className="p-4 shadow-soft">
      <div className="flex items-center gap-3 mb-3">
        <Bell className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-medium text-foreground">Reminders</h2>
      </div>
      
      <div className="space-y-2">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className={`flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:bg-muted/50 transition-all duration-300 ${
              dismissingIds.has(reminder.id) ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full bg-${reminder.categoryColor}`} />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {reminder.title}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {reminder.time}
                  <span className="mx-1">•</span>
                  {reminder.category}
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-3 text-xs"
              onClick={() => handleDismiss(reminder.id)}
              disabled={dismissingIds.has(reminder.id)}
            >
              Dismiss
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, MoreHorizontal, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  day: number; // 0-6 for Monday-Sunday
  category: string;
  categoryColor: string;
  hasReminder?: boolean;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const period = hour < 12 ? 'AM' : 'PM';
  return `${displayHour}:00 ${period}`;
});

const sampleBlocks: TimeBlock[] = [
  {
    id: '1',
    title: 'Morning Focus Block',
    startTime: '9:00 AM',
    endTime: '11:00 AM',
    day: 0, // Monday
    category: 'Deep Work',
    categoryColor: 'category-1',
    hasReminder: true,
  },
  {
    id: '2',
    title: 'Team Standup',
    startTime: '2:00 PM',
    endTime: '2:30 PM',
    day: 1, // Tuesday
    category: 'Meetings',
    categoryColor: 'category-2',
  },
  {
    id: '3',
    title: 'Lunch Break',
    startTime: '12:00 PM',
    endTime: '1:00 PM',
    day: 2, // Wednesday
    category: 'Breaks',
    categoryColor: 'category-3',
  },
];

export const WeeklyCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(sampleBlocks);
  const [selectedSlot, setSelectedSlot] = useState<{day: number, hour: number} | null>(null);

  const getCurrentWeekDates = () => {
    const startOfWeek = new Date(currentWeek);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    startOfWeek.setDate(diff);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const weekDates = getCurrentWeekDates();
  const today = new Date();
  const currentDayIndex = weekDates.findIndex(date => 
    date.toDateString() === today.toDateString()
  );

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  // Get dynamic time slots - only show times that have scheduled blocks
  const dynamicTimeSlots = useMemo(() => {
    const occupiedHours = new Set<number>();
    
    timeBlocks.forEach(block => {
      // Parse start and end times to get hour ranges
      const startHour = parseInt(block.startTime.split(':')[0]);
      const endHour = parseInt(block.endTime.split(':')[0]);
      
      // Add hours for this block
      for (let hour = startHour; hour <= endHour; hour++) {
        occupiedHours.add(hour);
      }
    });

    // Convert to array and sort, then map to time slot format
    return Array.from(occupiedHours)
      .sort((a, b) => a - b)
      .map(hour => {
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour < 12 ? 'AM' : 'PM';
        return {
          hour,
          display: `${displayHour}:00 ${period}`
        };
      });
  }, [timeBlocks]);

  const handleSlotClick = (day: number, hour: number) => {
    setSelectedSlot({ day, hour });
    // TODO: Open time block creation modal
  };

  const renderTimeBlock = (block: TimeBlock) => {
    const dayColumn = block.day + 1; // +1 for the time column
    return (
      <div
        key={block.id}
        className={cn(
          'absolute left-0 right-0 mx-1 p-2 rounded-md shadow-subtle cursor-pointer group transition-all duration-200',
          `bg-${block.categoryColor}/10 border border-${block.categoryColor}/20 hover:bg-${block.categoryColor}/20`
        )}
        style={{
          gridColumn: dayColumn + 1,
          top: '0',
          height: '80px', // Adjust based on time span
          zIndex: 10,
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">
              {block.title}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {block.startTime} - {block.endTime}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className={`w-2 h-2 rounded-full bg-${block.categoryColor}`} />
              <span className="text-xs text-muted-foreground">{block.category}</span>
            </div>
          </div>
          {block.hasReminder && (
            <Clock className="w-3 h-3 text-primary mt-1" />
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1"
        >
          <MoreHorizontal className="w-3 h-3" />
        </Button>
      </div>
    );
  };

  return (
    <Card className="p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-foreground">Weekly View</h2>
          <div className="text-sm text-muted-foreground">
            {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {' '}
            {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Optimization Suggestions Bar */}
      <div className="mb-6 p-3 rounded-lg bg-muted/30 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              <span className="font-medium">Stretch suggests:</span> Add a 15-minute break after your focus block
            </span>
          </div>
          <Button variant="outline" size="sm">
            Apply Suggestion
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Days Header */}
          <div className="grid grid-cols-8 gap-px bg-grid-line mb-px">
            <div className="bg-grid-header p-3">
              <span className="text-sm font-medium text-muted-foreground">Time</span>
            </div>
            {weekDates.map((date, index) => (
              <div 
                key={index} 
                className={cn(
                  "bg-grid-header p-3 text-center",
                  currentDayIndex === index && "bg-primary/10"
                )}
              >
                <div className="text-sm font-medium text-foreground">
                  {daysOfWeek[index]}
                </div>
                <div className="text-lg font-semibold text-foreground mt-1">
                  {date.getDate()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {date.getDate()}.{date.getMonth() + 1}.
                </div>
              </div>
            ))}
          </div>

          {/* Time Grid - Dynamic Time Slots */}
          <div className="relative">
            {dynamicTimeSlots.length > 0 ? (
              dynamicTimeSlots.map((timeSlot, index) => (
                <div key={index} className="grid grid-cols-8 gap-px bg-grid-line mb-px">
                  {/* Time Label */}
                  <div className="bg-card p-3 border-r border-grid-line">
                    <span className="text-xs text-muted-foreground">{timeSlot.display}</span>
                  </div>
                  
                   {/* Day Columns */}
                   {Array.from({ length: 7 }, (_, dayIndex) => (
                     <div
                       key={dayIndex}
                       className={cn(
                         'bg-card p-3 min-h-[60px] border-r border-grid-line cursor-pointer transition-colors relative',
                         'hover:bg-grid-hover',
                         selectedSlot?.day === dayIndex && selectedSlot?.hour === timeSlot.hour && 'bg-primary-light',
                         currentDayIndex === dayIndex && 'bg-primary/5'
                       )}
                       onClick={() => handleSlotClick(dayIndex, timeSlot.hour)}
                     >
                       {/* Time blocks will be positioned absolutely over these cells */}
                     </div>
                   ))}
                </div>
              ))
            ) : (
              // Show message when no blocks are scheduled
              <div className="grid grid-cols-8 gap-px bg-grid-line mb-px">
                <div className="bg-card p-3 border-r border-grid-line">
                  <span className="text-xs text-muted-foreground">--</span>
                </div>
                {Array.from({ length: 7 }, (_, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={cn(
                      "bg-card p-8 border-r border-grid-line text-center",
                      currentDayIndex === dayIndex && 'bg-primary/5'
                    )}
                  >
                    <span className="text-sm text-muted-foreground">No scheduled blocks</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Render time blocks */}
            {timeBlocks.map(renderTimeBlock)}
          </div>
        </div>
      </div>

    </Card>
  );
};
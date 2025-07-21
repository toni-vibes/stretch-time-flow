import { WeeklyCalendar } from '@/components/WeeklyCalendar';
import { QuickInput } from '@/components/QuickInput';
import { ReminderBox } from '@/components/ReminderBox';
import { OptimizationSuggestions } from '@/components/OptimizationSuggestions';
import { Header } from '@/components/Header';

const Index = () => {
  // Sample reminders data - in real app this would come from state/API
  const todayReminders = [
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
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Reminders Box - Conditional Display */}
        <div className="mb-6">
          <ReminderBox reminders={todayReminders} />
        </div>


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

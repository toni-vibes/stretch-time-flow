import { WeeklyCalendar } from '@/components/WeeklyCalendar';
import { QuickInput } from '@/components/QuickInput';
import { CategoryManager } from '@/components/CategoryManager';
import { Header } from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Quick Input Section */}
        <div className="mb-6">
          <QuickInput />
        </div>

        {/* Category Management */}
        <div className="mb-6">
          <CategoryManager />
        </div>

        {/* Main Calendar View */}
        <WeeklyCalendar />
      </div>
    </div>
  );
};

export default Index;

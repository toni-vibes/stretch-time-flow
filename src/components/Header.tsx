import React, { useState } from 'react';
import { Calendar, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileMenu } from '@/components/ProfileMenu';

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Stretch</h1>
              <p className="text-sm text-muted-foreground">Your AI scheduling assistant</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Bell className="w-4 h-4" />
              Reminders
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={() => setIsProfileOpen(true)}
            >
              <User className="w-4 h-4" />
              Profile
            </Button>
          </div>
        </div>
      </div>
      
      <ProfileMenu 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </header>
  );
};
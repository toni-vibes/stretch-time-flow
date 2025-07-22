import React, { useState } from 'react';
import { User, Settings, Upload, Eye, EyeOff, Trash2, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileMenu = ({ isOpen, onClose }: ProfileMenuProps) => {
  const [activeTab, setActiveTab] = useState<'account' | 'display'>('account');
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: 'John Doe',
    email: 'john@example.com',
    password: '',
    newPassword: '',
  });

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleThemeToggle = (checked: boolean) => {
    setDarkMode(checked);
    // In a real app, this would update the theme context/localStorage
    document.documentElement.classList.toggle('dark', checked);
  };

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    console.log('Logging out...');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Profile Menu Modal - Centered Rectangle */}
      <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[640px] h-[480px] p-0 shadow-2xl z-50 bg-card border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Profile Settings</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Main Content Area */}
        <div className="flex h-[calc(100%-64px)]">
          {/* Left Sidebar Menu */}
          <div className="w-32 border-r border-border bg-muted/20">
            <div className="p-2">
              <Button
                variant={activeTab === 'account' ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start mb-1 text-sm"
                onClick={() => setActiveTab('account')}
              >
                <User className="w-4 h-4 mr-2" />
                Account
              </Button>
              <Button
                variant={activeTab === 'display' ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => setActiveTab('display')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Display
              </Button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'account' && (
              <div className="space-y-4 h-full flex flex-col">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                  />
                </div>

                {/* Profile Photo */}
                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="w-3 h-3" />
                      Upload
                    </Button>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>

                {/* Change Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      placeholder="Enter new password"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-6 w-6 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>

                {/* Save Changes */}
                <Button className="w-full" size="sm">Save Changes</Button>

                {/* Spacer to push logout and delete to bottom */}
                <div className="flex-1" />

                {/* Bottom Actions */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <Button 
                    variant="outline" 
                    className="w-full gap-2" 
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </Button>
                  <Button variant="destructive" className="w-full gap-2" size="sm">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'display' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Theme Preferences</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-xs text-muted-foreground">
                        Switch between light and dark themes
                      </p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={handleThemeToggle}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};
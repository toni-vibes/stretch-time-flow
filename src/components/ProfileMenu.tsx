import React, { useState } from 'react';
import { User, Settings, Upload, Eye, EyeOff, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileMenu = ({ isOpen, onClose }: ProfileMenuProps) => {
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

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Profile Menu Modal */}
      <Card className="fixed top-16 right-6 w-96 p-0 shadow-lg z-50 bg-card border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Profile Settings</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="w-full grid grid-cols-2 m-4 mb-0">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="p-4 space-y-4">
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
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Photo
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
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Save Changes */}
            <Button className="w-full">Save Changes</Button>

            {/* Delete Account */}
            <div className="pt-4 border-t border-border">
              <Button variant="destructive" className="w-full gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="display" className="p-4 space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Theme Preferences</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
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
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
};
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogOut } from 'lucide-react';

const Logout = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <LogOut className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">You are logged out</h1>
            <p className="text-muted-foreground">Thank you for using our application.</p>
          </div>
          
          <Button 
            onClick={handleLoginRedirect}
            className="w-full"
          >
            Log in again
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Logout;
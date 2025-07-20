import React, { useState } from 'react';
import { Mic, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export const QuickInput = () => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // TODO: Process the natural language input
      console.log('Processing:', input);
      setInput('');
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // TODO: Implement voice recognition
  };

  return (
    <Card className="p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-medium text-foreground">Quick Schedule</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Try: 'Block 2 hours for deep work tomorrow morning' or 'Meeting with Sarah Friday 3pm'"
            className="text-base h-12"
          />
        </div>
        
        <Button 
          type="button"
          variant={isListening ? "default" : "outline"}
          size="icon"
          className="h-12 w-12"
          onClick={toggleVoiceInput}
        >
          <Mic className={`w-5 h-5 ${isListening ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
        </Button>
        
        <Button 
          type="submit" 
          className="h-12 px-6 gap-2"
          disabled={!input.trim()}
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </form>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2 mt-4">
        {[
          'Morning focus block',
          'Lunch break',
          'Team meeting',
          'Exercise',
          'Review session'
        ].map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setInput(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </Card>
  );
};
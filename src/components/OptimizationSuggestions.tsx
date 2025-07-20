import React from 'react';
import { Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Suggestion {
  id: string;
  text: string;
  action?: string;
}

interface OptimizationSuggestionsProps {
  suggestions?: Suggestion[];
}

export const OptimizationSuggestions = ({ suggestions }: OptimizationSuggestionsProps) => {
  // Default suggestion if none provided
  const defaultSuggestions: Suggestion[] = [
    {
      id: '1',
      text: 'Add a 15-minute break after your focus block',
      action: 'Apply Suggestion'
    }
  ];

  const currentSuggestions = suggestions || defaultSuggestions;

  return (
    <Card className="p-4 shadow-soft">
      <div className="flex items-center gap-3 mb-3">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-medium text-foreground">Optimization Suggestions</h2>
      </div>
      
      <div className="space-y-3">
        {currentSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
          >
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Stretch suggests:</span> {suggestion.text}
            </div>
            {suggestion.action && (
              <Button variant="outline" size="sm" className="ml-4">
                {suggestion.action}
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
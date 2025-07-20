import React, { useState } from 'react';
import { Plus, Palette, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  color: string;
  colorIndex: number;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Deep Work', color: 'category-1', colorIndex: 1 },
  { id: '2', name: 'Meetings', color: 'category-2', colorIndex: 2 },
  { id: '3', name: 'Breaks', color: 'category-3', colorIndex: 3 },
  { id: '4', name: 'Personal', color: 'category-4', colorIndex: 4 },
];

export const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addCategory = () => {
    if (newCategory.trim()) {
      const nextColorIndex = (categories.length % 8) + 1;
      const category: Category = {
        id: Date.now().toString(),
        name: newCategory.trim(),
        color: `category-${nextColorIndex}`,
        colorIndex: nextColorIndex,
      };
      setCategories([...categories, category]);
      setNewCategory('');
      setIsAdding(false);
    }
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  return (
    <Card className="p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-medium text-foreground">Categories</h2>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant="secondary"
            className={`bg-category-${category.colorIndex}/10 text-category-${category.colorIndex} border-category-${category.colorIndex}/20 hover:bg-category-${category.colorIndex}/20 transition-colors group cursor-pointer`}
          >
            <div className={`w-2 h-2 rounded-full bg-category-${category.colorIndex} mr-2`} />
            {category.name}
            <Button
              variant="ghost"
              size="icon"
              className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeCategory(category.id)}
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        ))}

        {isAdding && (
          <div className="flex items-center gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category name"
              className="h-8 w-32 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') addCategory();
                if (e.key === 'Escape') setIsAdding(false);
              }}
              autoFocus
            />
            <Button size="sm" onClick={addCategory} disabled={!newCategory.trim()}>
              Add
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

import React from 'react';
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

// Predefined colors that match the app's dark theme aesthetic
const colorOptions = [
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#f97316', // orange
  '#84cc16', // lime
  '#14b8a6', // teal
  '#6366f1', // indigo
  '#d946ef', // fuchsia
];

export function ColorPicker({ selectedColor, onSelectColor }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {colorOptions.map((color) => (
        <Button
          key={color}
          type="button"
          className={`w-8 h-8 rounded-full p-0 border-2 transition-transform hover:scale-110 ${
            selectedColor === color ? 'border-white' : 'border-transparent'
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onSelectColor(color)}
        />
      ))}
    </div>
  );
}

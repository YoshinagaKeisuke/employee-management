import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, X } from 'lucide-react'
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  color: string | null
  onChange: (color: string | null) => void
}

const predefinedColors = [
  '#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3',
  '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF'
]

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(color || '')

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value)
    onChange(e.target.value)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-10 h-10 p-0 rounded-full relative aspect-square"
          style={{ 
            backgroundColor: color || 'transparent',
            border: color ? '2px solid #e2e8f0' : '2px dashed #cbd5e0'
          }}
        >
          {color === null && (
            <X className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px]">
        <div className="grid grid-cols-5 gap-2 mb-4">
          <Button
            key="no-color"
            className="w-10 h-10 p-0 rounded-full relative border-2 border-dashed border-gray-300"
            style={{ backgroundColor: 'transparent' }}
            onClick={() => onChange(null)}
          >
            <X className="h-4 w-4 text-gray-400" />
            {color === null && <Check className="absolute right-0 bottom-0 w-3 h-3 text-green-500" />}
          </Button>
          {predefinedColors.map((c) => (
            <Button
              key={c}
              className={cn(
                "w-10 h-10 p-0 rounded-full relative",
                color === c && "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-950 ring-black"
              )}
              style={{ backgroundColor: c }}
              onClick={() => onChange(c)}
            />
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className="w-10 h-10 p-0 rounded-full border-2 border-gray-300"
          />
          <input
            type="text"
            value={customColor}
            onChange={handleCustomColorChange}
            placeholder="#RRGGBB"
            className="flex-1 px-2 py-1 text-sm border rounded"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}


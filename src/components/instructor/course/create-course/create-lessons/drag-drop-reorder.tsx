'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronUp, ChevronDown, GripVertical } from 'lucide-react';

interface DragDropReorderProps<T extends { id: string; orderIndex: number }> {
  items: T[];
  onReorder: ((items: T[]) => void) | null;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function DragDropReorder<T extends { id: string; orderIndex: number }>({
  items,
  onReorder,
  renderItem,
  className,
}: DragDropReorderProps<T>) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);

  const moveUp = (index: number) => {
    if (onReorder) {
      if (index > 0) {
        const newItems = [...items];
        [newItems[index], newItems[index - 1]] = [
          newItems[index - 1],
          newItems[index],
        ];
        // Update order numbers
        newItems.forEach((item, idx) => {
          item.orderIndex = idx;
        });
        onReorder(newItems);
      }
    }
  };

  const moveDown = (index: number) => {
    if (onReorder) {
      if (index < items.length - 1) {
        const newItems = [...items];
        [newItems[index], newItems[index + 1]] = [
          newItems[index + 1],
          newItems[index],
        ];
        // Update order numbers
        newItems.forEach((item, idx) => {
          item.orderIndex = idx;
        });
        onReorder(newItems);
      }
    }
  };

  const handleOrderChange = (itemId: string, newOrder: number) => {
    if (onReorder) {
      const currentIndex = items.findIndex((item) => item.id === itemId);
      const targetIndex = Math.max(0, Math.min(newOrder - 1, items.length - 1));

      if (currentIndex !== targetIndex) {
        const newItems = [...items];
        const [movedItem] = newItems.splice(currentIndex, 1);
        newItems.splice(targetIndex, 0, movedItem);

        // Update order numbers
        newItems.forEach((item, idx) => {
          item.orderIndex = idx;
        });

        onReorder(newItems);
      }
      setEditingOrder(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';    
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {    
    e.preventDefault();
    e.stopPropagation();  
    if (onReorder) {
      if (!draggedItem || draggedItem === targetId) {   
        return;
      };      
      const draggedIndex = items.findIndex((item) => item.id === draggedItem);
      const targetIndex = items.findIndex((item) => item.id === targetId);
      
      const newItems = [...items];
      const [movedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, movedItem);

      // Update order numbers
      newItems.forEach((item, idx) => {
        item.orderIndex = idx;
      });      

      onReorder(newItems);
      setDraggedItem(null);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedItem(null);
  };

  return (
    <div className={className}>
      {items.map((item, index) => (        
        <div
          key={item.id}
          className={`relative group ${
            draggedItem === item.id ? 'opacity-50' : ''
          }`}
          draggable
          onDragStart={(e) => handleDragStart(e, item.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item.id)}
          onDragEnd={(e) => handleDragEnd(e)}
        >
          {onReorder && (
            <div className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="flex flex-col items-center gap-1">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                <div className="flex flex-col gap-1">
                  {/* Move up button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>

                  {/* Move down button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => moveDown(index)}
                    disabled={index === items.length - 1}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>

                {/* Edit order button */}
                <div className="flex items-center gap-1">
                  {editingOrder === item.id ? (
                    <Input
                      type="number"
                      min="1"
                      max={items.length}
                      defaultValue={item.orderIndex + 1}
                      className="h-6 w-12 text-xs"
                      onBlur={(e) =>
                        handleOrderChange(
                          item.id,
                          Number.parseInt(e.target.value) || item.orderIndex
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleOrderChange(
                            item.id,
                            Number.parseInt(e.currentTarget.value) || item.orderIndex
                          );
                        }
                        if (e.key === 'Escape') {
                          setEditingOrder(null);
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-8 p-0 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingOrder(item.id);
                      }}
                    >
                      {item.orderIndex + 1}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="pl-16">{renderItem(item, index)}</div>
        </div>
      ))}
    </div>
  );
}
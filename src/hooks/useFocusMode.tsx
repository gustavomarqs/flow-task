
import { useState } from 'react';
import { Task } from '@/types/task';
import { RecurringTask, RecurringTaskEntry } from '@/types/recurring-task';

export function useFocusMode(
  onCompleteTask: (id: string) => void,
  onCompleteRecurringTask: (entry: RecurringTaskEntry) => void
) {
  const [focusTask, setFocusTask] = useState<{
    type: 'regular' | 'recurring';
    task: Task | RecurringTask;
  } | null>(null);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  
  // Start focus mode
  const handleStartFocus = (taskType: 'regular' | 'recurring', task: Task | RecurringTask) => {
    setFocusTask({ type: taskType, task });
    setIsFocusModeOpen(true);
  };
  
  return {
    focusTask,
    isFocusModeOpen,
    setIsFocusModeOpen,
    handleStartFocus,
    onCompleteTask,
    onCompleteRecurringTask
  };
}

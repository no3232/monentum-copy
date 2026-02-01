import { useState, memo, useCallback } from 'react';
import { Plus, X } from 'lucide-react';
import { DateTimePicker } from '../ui/date-time-picker';

interface TaskFormProps {
  onAddTask: (title: string, options?: { notes?: string; due?: string }) => void;
}

export default memo(function TaskForm({ onAddTask }: TaskFormProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newTaskDue, setNewTaskDue] = useState<Date | undefined>(undefined);
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  
  const handleCancelForm = useCallback(() => {
    setNewTaskTitle('');
    setNewTaskNotes('');
    setNewTaskTime('');
    setNewTaskDue(undefined);
    setIsFormExpanded(false);
  }, []);
  
  const handleAddTask = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (newTaskTitle.trim()) {
        const options: { notes?: string; due?: string } = {};

        // 시간이 있으면 메모 앞에 [HH:MM] 형식으로 추가
        let finalNotes = newTaskNotes.trim();
        if (newTaskTime) {
          finalNotes = `[${newTaskTime}] ${finalNotes}`.trim();
        }

        if (finalNotes) options.notes = finalNotes;
        if (newTaskDue) options.due = newTaskDue.toISOString();

        onAddTask(newTaskTitle, options);
        handleCancelForm();
      }
    },
    [newTaskTitle, newTaskNotes, newTaskTime, newTaskDue, onAddTask, handleCancelForm]
  );

  return (
    <form onSubmit={handleAddTask} className="mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onFocus={() => setIsFormExpanded(true)}
          placeholder="새 태스크 추가..."
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
        />
      </div>

      {isFormExpanded && (
        <div className="mt-3 space-y-3">
          <DateTimePicker
            date={newTaskDue}
            time={newTaskTime}
            onDateChange={setNewTaskDue}
            onTimeChange={setNewTaskTime}
          />

          <textarea
            value={newTaskNotes}
            onChange={(e) => setNewTaskNotes(e.target.value)}
            placeholder="메모 (링크 등 추가 정보)..."
            rows={2}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 resize-none custom-scrollbar"
          />

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancelForm}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white/70 px-3 py-1.5 rounded-lg transition-colors text-sm cursor-pointer"
            >
              <X className="w-4 h-4" />
              취소
            </button>
            <button
              type="submit"
              className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-lg transition-colors text-sm font-medium cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              추가
            </button>
          </div>
        </div>
      )}
    </form>
  );
});

import { memo } from 'react';
import type { Task } from '../../types';
import TaskItem from './TaskItem';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  isFormExpanded?: boolean;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onPlayYoutube?: (videoId: string) => void;
}

export default memo(function TaskList({
  tasks,
  isLoading,
  isFormExpanded = false,
  onToggle,
  onDelete,
  onPlayYoutube,
}: TaskListProps) {
  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar',
        isFormExpanded ? 'max-h-[20vh]' : 'max-h-[45vh]'
      )}
    >
      {isLoading ? (
        <div className="text-white/70 text-center py-4">로딩 중...</div>
      ) : tasks.length === 0 ? (
        <div className="text-white/70 text-center py-8">
          태스크가 없습니다. 새로운 태스크를 추가해보세요!
        </div>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onPlayYoutube={onPlayYoutube}
          />
        ))
      )}
    </div>
  );
});

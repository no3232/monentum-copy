import { memo } from 'react';
import { Target } from 'lucide-react';
import type { Task } from '../types';
import { parseNotesForUrls } from '../utils/urlParser';

interface GoalButtonsProps {
  tasks: Task[];
  onGoalClick: (task: Task) => void;
}

export default memo(function GoalButtons({ tasks, onGoalClick }: GoalButtonsProps) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 mt-8 max-h-[40vh] overflow-y-auto overflow-x-visible p-2 -m-2 pr-4 custom-scrollbar">
      {tasks.map((task) => {
        const parsedUrls = parseNotesForUrls(task.notes);
        const hasUrl = parsedUrls.length > 0;

        // URL이 없는 태스크는 버튼 표시 안 함
        if (!hasUrl) {
          return null;
        }

        return (
          <button
            key={task.id}
            onClick={() => onGoalClick(task)}
            className="flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-2xl border border-white/30 cursor-pointer"
          >
            <Target className="w-6 h-6" />
            <span className="text-lg">{task.title} 달성하기</span>
          </button>
        );
      })}
    </div>
  );
})

import { memo } from 'react';
import { Trash2, Check, Youtube, ExternalLink, AppWindowIcon } from 'lucide-react';
import type { Task } from '../../types';
import { parseNotesForUrls } from '../../utils/urlParser';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export default memo(function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const isCompleted = task.status === 'completed';
  const parsedUrls = parseNotesForUrls(task.notes);

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
      <button
        onClick={() => onToggle(task.id)}
        className={cn("shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
          isCompleted
            ? 'bg-green-500 border-green-500'
            : 'border-white/50 hover:border-white'
        )}
      >
        {isCompleted && <Check className="w-3 h-3 text-white" />}
      </button>

      <span
        className={cn("flex-1 text-sm",
          isCompleted ? 'line-through text-white/50' : 'text-white'
        )}
      >
        {task.title}
      </span>

      {/* URL 액션 버튼들 - 항상 공간 확보 */}
      <div className="flex items-center gap-1 shrink-0">
        {parsedUrls.map((parsedUrl, index) => {
          if (parsedUrl.type === 'youtube' && parsedUrl.videoId) {
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(parsedUrl.url, '_blank', 'noopener,noreferrer');
                }}
                className="p-1 hover:bg-red-500/20 rounded transition-colors cursor-pointer"
                title="YouTube 재생"
              >
                <Youtube className="w-4 h-4 text-red-400" />
              </button>
            );
          } else if (parsedUrl.type === 'external') {
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(parsedUrl.url, '_blank', 'noopener,noreferrer');
                }}
                className="p-1 hover:bg-blue-500/20 rounded transition-colors cursor-pointer"
                title="외부 링크 열기"
              >
                <ExternalLink className="w-4 h-4 text-blue-400" />
              </button>
            );
          } else if (parsedUrl.type === 'app') {
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(parsedUrl.url, '_blank', 'noopener,noreferrer');
                }}
                className="p-1 hover:bg-green-500/20 rounded transition-colors cursor-pointer"
                title="앱 딥링크 열기"
              >
                <AppWindowIcon className="w-4 h-4 text-green-400" />
              </button>
            );
          }
          return null;
        })}
      </div>

      {/* 삭제 버튼 - 항상 렌더링, opacity로 제어 */}
      <button
        onClick={() => onDelete(task.id)}
        className="shrink-0 p-1 hover:bg-red-500/20 rounded transition-all opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto cursor-pointer"
      >
        <Trash2 className="w-4 h-4 text-red-400" />
      </button>
    </div>
  );
})

import { memo } from 'react';
import { ListTodo, ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TasksHeaderProps {
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  onLogout: () => void;
}

export default memo(function TasksHeader({
  isCollapsed,
  onToggleCollapsed,
  onLogout,
}: TasksHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', isCollapsed ? 'mb-0' : 'mb-4')}>
      <div className="flex items-center gap-3">
        <ListTodo className="w-6 h-6 text-white" />
        <h2 className="text-xl font-semibold text-white">Tasks</h2>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleCollapsed}
          className="p-2 hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
          title={isCollapsed ? '펼치기' : '접기'}
        >
          {isCollapsed ? (
            <ChevronUp className="w-5 h-5 text-white/70" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/70" />
          )}
        </button>
        <button
          onClick={onLogout}
          className="p-2 hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
          title="로그아웃"
        >
          <LogOut className="w-5 h-5 text-white/70" />
        </button>
      </div>
    </div>
  );
});

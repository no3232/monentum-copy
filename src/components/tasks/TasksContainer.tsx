import { memo, useState, useCallback } from 'react';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { useGoogleTasks } from '../../hooks/useGoogleTasks';
import { useAppStore } from '../../stores/useAppStore';
import { cn } from '@/lib/utils';
import TasksHeader from './TasksHeader';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import LoginPrompt from '../auth/LoginPrompt';


export default memo(function TasksContainer() {
  const { isAuthenticated, isLoading: authLoading, login, logout } = useGoogleAuth();
  const { tasks, isLoading: tasksLoading, addTask, toggleTask, deleteTask } = useGoogleTasks(isAuthenticated);
  
  const isCollapsed = useAppStore((state) => state.isTasksCollapsed);
  const toggleCollapsed = useAppStore((state) => state.toggleTasksCollapsed);
  
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  const handleAddTask = useCallback((title: string, options?: { notes?: string; due?: string }) => {
    addTask(title, options);
    setIsFormExpanded(false);
  }, [addTask]);

  if (authLoading) {
    return (
      <div className="fixed bottom-8 right-8 w-96 backdrop-blur-xl bg-black/40 rounded-2xl p-6 shadow-2xl border border-white/10">
        <div className="text-white text-center">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt onLogin={login} />;
  }

  return (
    <div className="fixed bottom-8 right-8 w-96 backdrop-blur-xl bg-black/40 rounded-2xl p-6 shadow-2xl border border-white/10 max-h-[70vh] flex flex-col z-10">
      <TasksHeader
        isCollapsed={isCollapsed}
        onToggleCollapsed={toggleCollapsed}
        onLogout={logout}
      />

      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          isCollapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
        )}
      >
        <div className="overflow-hidden p-2 -m-2 pr-4">
          <TaskForm onAddTask={handleAddTask} />
          <TaskList
            tasks={tasks}
            isLoading={tasksLoading}
            isFormExpanded={isFormExpanded}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        </div>
      </div>
    </div>
  );
});

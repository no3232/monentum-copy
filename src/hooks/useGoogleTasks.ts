import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '../types';
import { tasksApi, type GoogleTask } from '../lib/googleApi';
import { useAppStore } from '../stores/useAppStore';
import { useEffect } from 'react';

const TASKS_QUERY_KEY = ['tasks'];

export function useGoogleTasks(isAuthenticated: boolean) {
  const queryClient = useQueryClient();
  const setTasks = useAppStore((state) => state.setTasks);

  // Tasks 조회
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: async (): Promise<Task[]> => {
      const result = await tasksApi.list();
      const tasksList = result.items || [];
      return tasksList
        .filter((task: GoogleTask): task is GoogleTask & { id: string; title: string } => 
          !!task.id && !!task.title
        )
        .map((task) => ({
          id: task.id,
          title: task.title,
          status: (task.status as Task['status']) || 'needsAction',
          updated: task.updated,
          notes: task.notes,
          due: task.due,
        }));
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2분
  });

  // tasks 변경 시 전역 스토어에 동기화
  useEffect(() => {
    setTasks(tasks);
  }, [tasks, setTasks]);

  // Task 추가
  const addTaskMutation = useMutation({
    mutationFn: async ({
      title,
      options,
    }: {
      title: string;
      options?: { notes?: string; due?: string };
    }) => {
      const newTask = await tasksApi.insert(title, options);
      return {
        id: newTask.id!,
        title: newTask.title!,
        status: newTask.status as 'needsAction' | 'completed',
        updated: newTask.updated,
        notes: newTask.notes,
        due: newTask.due,
      };
    },
    onSuccess: (newTask) => {
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old = []) => [
        newTask,
        ...old,
      ]);
    },
  });

  // Task 토글
  const toggleTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const currentTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY) || [];
      const task = currentTasks.find((t) => t.id === taskId);
      if (!task) throw new Error('Task not found');

      const newStatus: Task['status'] = task.status === 'completed' ? 'needsAction' : 'completed';
      await tasksApi.update(taskId, { status: newStatus });
      return { taskId, newStatus };
    },
    onSuccess: ({ taskId, newStatus }) => {
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old = []) =>
        old.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    },
  });

  // Task 삭제
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await tasksApi.delete(taskId);
      return taskId;
    },
    onSuccess: (taskId) => {
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old = []) =>
        old.filter((t) => t.id !== taskId)
      );
    },
  });

  const addTask = (title: string, options?: { notes?: string; due?: string }) => {
    if (!title.trim()) return;
    addTaskMutation.mutate({ title, options });
  };

  const toggleTask = (taskId: string) => {
    toggleTaskMutation.mutate(taskId);
  };

  const deleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  const refreshTasks = () => {
    queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
  };

  return {
    tasks,
    isLoading,
    error: error ? '태스크를 불러오는데 실패했습니다.' : null,
    addTask,
    toggleTask,
    deleteTask,
    refreshTasks,
  };
}

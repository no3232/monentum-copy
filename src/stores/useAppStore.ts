import { create } from 'zustand';
import type { Task, UserProfile } from '../types';

interface AppState {
  // Tasks
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  
  // Triggered Tasks (시간 기반 트리거)
  triggeredTasks: Task[];
  setTriggeredTasks: (tasks: Task[]) => void;
  
  // User Profile
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  
  // Tasks Panel Collapsed
  isTasksCollapsed: boolean;
  setTasksCollapsed: (collapsed: boolean) => void;
  toggleTasksCollapsed: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Tasks
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  
  // Triggered Tasks
  triggeredTasks: [],
  setTriggeredTasks: (triggeredTasks) => set({ triggeredTasks }),
  
  // User Profile
  userProfile: null,
  setUserProfile: (userProfile) => set({ userProfile }),
  
  // Tasks Panel Collapsed
  isTasksCollapsed: false,
  setTasksCollapsed: (isTasksCollapsed) => set({ isTasksCollapsed }),
  toggleTasksCollapsed: () => set((state) => ({ isTasksCollapsed: !state.isTasksCollapsed })),
}));

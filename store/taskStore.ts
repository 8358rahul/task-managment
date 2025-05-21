import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: string;       // ISO string format
  priority: number;
  completed: boolean; 
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (updated: Task) => void;
  deleteTask: (id: number) => void;
  toggleTask: (id: number) => void; 
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [], 
      addTask: (task: Task) =>
        set((state:any) => ({ tasks: [...state.tasks, task] })),
      updateTask: (updated: Task) =>
        set((state:any) => ({
          tasks: state.tasks.map((t: Task) => t.id === updated.id ? updated : t),
        })),
      deleteTask: (id: number) =>
        set((state:any) => ({
          tasks: state.tasks.filter((t: Task) => t.id !== id),
        })),
      toggleTask: (id: number) =>
        set((state:any) => ({
          tasks: state.tasks.map((t:Task)=>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),
    }),
    {
      name: 'tasks-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

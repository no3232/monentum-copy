import { useState, useEffect, useRef, useMemo } from 'react';
import type { Task } from '../types';
import { parseTimeFromNotes } from '../utils/urlParser';

interface TaskTriggerInfo {
  task: Task;
  triggerTime: number; // timestamp (ms)
}

// 태스크의 트리거 시간 계산 (오늘 기준)
function getTaskTriggerTime(task: Task): number | null {
  // 완료된 태스크는 건너뛰기
  if (task.status === 'completed') return null;

  // due 날짜가 있는지 확인
  if (!task.due) return null;

  // due 날짜가 오늘보다 미래면 건너뛰기
  const dueDate = new Date(task.due);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate > today) return null;

  // notes에서 알림 시간 추출
  const taskTime = parseTimeFromNotes(task.notes);
  if (!taskTime) return null;

  const [taskHour, taskMinute] = taskTime.split(':').map(Number);
  
  // 오늘 날짜의 트리거 시간 (5분 전)
  const triggerDate = new Date();
  triggerDate.setHours(taskHour, taskMinute - 5, 0, 0);
  
  return triggerDate.getTime();
}

// 태스크 ID 배열 비교 (순서 무관)
function areTaskIdsEqual(a: Task[], b: Task[]): boolean {
  if (a.length !== b.length) return false;
  const aIds = new Set(a.map(t => t.id));
  return b.every(t => aIds.has(t.id));
}

export function useTimeTrigger(tasks: Task[]): Task[] {
  const [triggeredTasks, setTriggeredTasks] = useState<Task[]>([]);
  const prevTriggeredRef = useRef<Task[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 태스크별 트리거 정보 계산 (tasks가 변경될 때만 재계산)
  const taskTriggerInfos = useMemo(() => {
    const infos: TaskTriggerInfo[] = [];
    for (const task of tasks) {
      const triggerTime = getTaskTriggerTime(task);
      if (triggerTime !== null) {
        infos.push({ task, triggerTime });
      }
    }
    return infos.sort((a, b) => a.triggerTime - b.triggerTime);
  }, [tasks]);

  useEffect(() => {
    const scheduleNextCheck = () => {
      // 기존 타이머 정리
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const now = Date.now();
      
      // 현재 트리거되어야 할 태스크들
      const currentlyTriggered = taskTriggerInfos
        .filter(info => now >= info.triggerTime)
        .map(info => info.task);

      // 변경된 경우에만 상태 업데이트
      if (!areTaskIdsEqual(currentlyTriggered, prevTriggeredRef.current)) {
        prevTriggeredRef.current = currentlyTriggered;
        setTriggeredTasks(currentlyTriggered);
      }

      // 아직 트리거되지 않은 가장 가까운 태스크 찾기
      const nextTrigger = taskTriggerInfos.find(info => info.triggerTime > now);
      
      if (nextTrigger) {
        // 다음 트리거 시간까지 대기 (최소 1초, 최대 1시간)
        const delay = Math.min(
          Math.max(nextTrigger.triggerTime - now, 1000),
          3600000
        );
        
        timeoutRef.current = setTimeout(scheduleNextCheck, delay);
      }
    };

    scheduleNextCheck();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [taskTriggerInfos]);

  return triggeredTasks;
}

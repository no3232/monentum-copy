import { useCallback, useEffect } from 'react';
import Background from './components/Background';
import Clock from './components/Clock';
import Tasks from './components/Tasks';
import YouTubeModal from './components/YouTubeModal';
import GoalButtons from './components/GoalButtons';
import { useTimeTrigger } from './hooks/useTimeTrigger';
import { parseNotesForUrls } from './utils/urlParser';
import { useAppStore } from './stores/useAppStore';
import type { Task } from './types';

function App() {
  const tasks = useAppStore((state) => state.tasks);
  const userProfile = useAppStore((state) => state.userProfile);
  const activeVideoId = useAppStore((state) => state.activeVideoId);
  const openYoutubeModal = useAppStore((state) => state.openYoutubeModal);
  const closeYoutubeModal = useAppStore((state) => state.closeYoutubeModal);
  const setTriggeredTasks = useAppStore((state) => state.setTriggeredTasks);

  // 시간 트리거로 활성화된 태스크들
  const triggeredTasks = useTimeTrigger(tasks);

  // triggeredTasks를 전역 스토어에 동기화
  useEffect(() => {
    setTriggeredTasks(triggeredTasks);
  }, [triggeredTasks, setTriggeredTasks]);

  // 목표 달성 버튼 클릭 핸들러
  const handleGoalClick = useCallback((task: Task) => {
    const parsedUrls = parseNotesForUrls(task.notes);
    const firstUrl = parsedUrls[0];

    if (!firstUrl) return;

    if (firstUrl.type === 'youtube' && firstUrl.videoId) {
      openYoutubeModal(firstUrl.videoId);
    } else if (firstUrl.type === 'external' || firstUrl.type === 'app') {
      window.open(firstUrl.url, '_blank', 'noopener,noreferrer');
    }
  }, [openYoutubeModal]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Clock userName={userProfile?.name} />
          <GoalButtons tasks={triggeredTasks} onGoalClick={handleGoalClick} />
        </div>
      </div>

      <Tasks onPlayYoutube={openYoutubeModal} />

      {activeVideoId && (
        <YouTubeModal videoId={activeVideoId} onClose={closeYoutubeModal} />
      )}
    </div>
  );
}

export default App;

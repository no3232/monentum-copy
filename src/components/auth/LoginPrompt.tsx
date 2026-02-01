import { memo } from 'react';
import { ListTodo, LogIn } from 'lucide-react';

interface LoginPromptProps {
  onLogin: () => void;
}

export default memo(function LoginPrompt({ onLogin }: LoginPromptProps) {
  return (
    <div className="fixed bottom-8 right-8 w-96 backdrop-blur-xl bg-black/40 rounded-2xl p-6 shadow-2xl border border-white/10 z-10">
      <div className="flex items-center gap-3 mb-4">
        <ListTodo className="w-6 h-6 text-white" />
        <h2 className="text-xl font-semibold text-white">Tasks</h2>
      </div>
      <p className="text-white/70 text-sm mb-4">
        Google Tasks와 연동하여 할 일을 관리하세요
      </p>
      <button
        onClick={onLogin}
        className="w-full flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-medium py-3 px-4 rounded-lg transition-colors cursor-pointer"
      >
        <LogIn className="w-5 h-5" />
        Google 로그인
      </button>
    </div>
  );
});

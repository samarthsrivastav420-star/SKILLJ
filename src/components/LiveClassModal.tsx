import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Users, 
  MessageSquare, 
  Radio, 
  Send, 
  Heart, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  ScreenShare, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { LiveSession } from '../types';

interface LiveClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: LiveSession | null;
  isTeacherHost?: boolean;
}

export const LiveClassModal: React.FC<LiveClassModalProps> = ({
  isOpen,
  onClose,
  session,
  isTeacherHost = false,
}) => {
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string; isTeacher?: boolean }>>([
    { sender: 'System', text: 'Welcome to SKILLJ Authorized Live Classroom. Chat is monitored by UNIVERSE AI.', time: '10:00' },
    { sender: 'Aarav (@aarav_learner)', text: 'Good morning Professor! Ready for today’s session.', time: '10:02' },
    { sender: 'Priya Sharma', text: 'Can you please explain the system design question from the syllabus?', time: '10:03' },
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [viewers, setViewers] = useState(session?.viewersCount || 42);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [durationSecs, setDurationSecs] = useState(1520);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setDurationSecs(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !session) return null;

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        sender: isTeacherHost ? `${session.teacherName} (Faculty)` : 'You (Student)',
        text: inputMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isTeacher: isTeacherHost,
      },
    ]);
    setInputMsg('');
  };

  const handleSendReaction = (emoji: string) => {
    setMessages(prev => [
      ...prev,
      {
        sender: 'You',
        text: `reacted ${emoji}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-5xl h-[92vh] bg-slate-900 rounded-2xl shadow-2xl border border-red-900/40 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              LIVE
            </span>
            <div className="truncate">
              <h3 className="text-sm font-bold truncate text-white">{session.title}</h3>
              <p className="text-[11px] text-slate-400">
                Instructor: {session.teacherName} • Category: {session.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-200">
              <Users className="w-3.5 h-3.5 text-red-400" />
              <span>{viewers} Viewers</span>
            </div>
            <div className="text-xs font-mono bg-slate-800 text-rose-300 px-2.5 py-1 rounded-lg">
              {formatDuration(durationSecs)}
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content: Video Screen + Interactive Chat */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-950">
          {/* Video Studio Area */}
          <div className="flex-1 relative flex flex-col justify-between bg-black">
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                src={session.streamUrl || 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-90"
              />

              {/* Live Overlay Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10">
                  UNIVERSE WebRTC Real-Time Stream • 1080p 60fps
                </span>
                <span className="bg-red-600/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md w-fit">
                  AUTHORIZED ENCRYPTED SESSION
                </span>
              </div>

              {/* Floating Instructor Cam PIP */}
              <div className="absolute bottom-16 right-4 w-36 sm:w-44 aspect-video rounded-xl overflow-hidden border-2 border-red-500 shadow-2xl bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                  alt="Instructor"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 left-1.5 bg-black/70 text-[9px] font-bold text-white px-1.5 py-0.5 rounded">
                  {session.teacherName} (Cam)
                </span>
              </div>
            </div>

            {/* Bottom Stream Controls */}
            <div className="bg-slate-950/90 backdrop-blur-md px-4 py-3 border-t border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                {isTeacherHost ? (
                  <>
                    <button
                      onClick={() => setIsMicOn(!isMicOn)}
                      className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white'
                      }`}
                    >
                      {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setIsVideoOn(!isVideoOn)}
                      className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isVideoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white'
                      }`}
                    >
                      {isVideoOn ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setIsSharingScreen(!isSharingScreen)}
                      className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSharingScreen ? 'bg-red-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
                      }`}
                    >
                      <ScreenShare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onClose}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      End Live Broadcast
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Synchronized with Instructor's Live Canvas</span>
                  </div>
                )}
              </div>

              {/* Reaction Emojis */}
              <div className="flex items-center gap-1">
                {['👏', '🔥', '💡', '❤️', '🚀'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleSendReaction(emoji)}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-sm transition-transform hover:scale-125 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Chat Panel */}
          <div className="w-full lg:w-80 h-64 lg:h-auto bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-red-500" />
                Live Classroom Chat
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Q&amp;A OPEN</span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl ${
                    m.isTeacher
                      ? 'bg-red-950/60 border border-red-800/50 text-rose-100'
                      : 'bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`font-bold text-[11px] ${m.isTeacher ? 'text-rose-400' : 'text-slate-400'}`}>
                      {m.sender}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">{m.time}</span>
                  </div>
                  <p className="text-xs">{m.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask a question in class..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-800 text-white rounded-xl border border-slate-700 focus:border-red-500 focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

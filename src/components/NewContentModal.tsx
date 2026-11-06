import React, { useState } from 'react';
import { 
  X, 
  Video, 
  Radio, 
  FileImage, 
  Megaphone, 
  Upload, 
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { TeacherProfile } from '../types';

interface NewContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile | null;
  onContentCreated: () => void;
}

export const NewContentModal: React.FC<NewContentModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onContentCreated,
}) => {
  const [activeTab, setActiveTab] = useState<'VIDEO' | 'LIVE' | 'POST' | 'HEADLINE'>('VIDEO');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoTags, setVideoTags] = useState('react, typescript, system-design');
  const [videoCategory, setVideoCategory] = useState<'SKILL' | 'COURSE' | 'EDUCATION'>(teacher?.category || 'SKILL');
  const [videoDuration, setVideoDuration] = useState('32:15');

  const [liveTitle, setLiveTitle] = useState('');
  const [liveDesc, setLiveDesc] = useState('');

  const [postTitle, setPostTitle] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [postType, setPostType] = useState<'UPCOMING_EXAM' | 'NOTICE' | 'TEST_INFO' | 'CLASS_UPDATE' | 'ANNOUNCEMENT'>('UPCOMING_EXAM');

  const [headlineText, setHeadlineText] = useState('');

  if (!isOpen || !teacher) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      let endpoint = '';
      let payload = {};

      if (activeTab === 'VIDEO') {
        endpoint = '/api/content/upload-video';
        payload = {
          teacherId: teacher.id,
          title: videoTitle || 'Mastering Applied Engineering & Real-World Projects',
          description: videoDesc || 'Key principles and code patterns for professional practice.',
          category: videoCategory,
          tags: videoTags,
          duration: videoDuration,
        };
      } else if (activeTab === 'LIVE') {
        endpoint = '/api/content/create-live';
        payload = {
          teacherId: teacher.id,
          title: liveTitle || `🔴 LIVE: ${teacher.firstName}'s Interactive Masterclass`,
          description: liveDesc || 'Live coding and doubts clearing session with enrolled students.',
          category: videoCategory,
        };
      } else if (activeTab === 'POST') {
        endpoint = '/api/content/create-post';
        payload = {
          teacherId: teacher.id,
          title: postTitle || 'Important Academic Update for Enrolled Scholars',
          description: postDesc || 'Please ensure you complete previous modules before this week’s evaluation.',
          category: videoCategory,
          type: postType,
        };
      } else {
        endpoint = '/api/content/create-headline';
        payload = {
          teacherId: teacher.id,
          text: headlineText || '⚡ Breaking Notice: Class syllabus updated for this month’s examination.',
          category: videoCategory,
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Your ${activeTab.toLowerCase()} has been officially published and distributed to student dashboards!`);
        setTimeout(() => {
          onContentCreated();
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-tight">SKILLJ</span>
              <span className="text-[10px] bg-white/20 uppercase font-bold px-2 py-0.5 rounded">STUDIO</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">Publish Educational Content</h2>
            <p className="text-xs text-rose-100">Select content format to broadcast across SKILLJ</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Tabs */}
        <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveTab('VIDEO'); setSuccessMsg(''); }}
            className={`py-3 text-center flex flex-col items-center gap-1 border-b-2 cursor-pointer ${
              activeTab === 'VIDEO' ? 'border-red-600 text-red-600 bg-white' : 'border-transparent text-slate-500'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>1. VIDEO</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('LIVE'); setSuccessMsg(''); }}
            className={`py-3 text-center flex flex-col items-center gap-1 border-b-2 cursor-pointer ${
              activeTab === 'LIVE' ? 'border-red-600 text-red-600 bg-white' : 'border-transparent text-slate-500'
            }`}
          >
            <Radio className="w-4 h-4 text-red-600" />
            <span>2. LIVE</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('POST'); setSuccessMsg(''); }}
            className={`py-3 text-center flex flex-col items-center gap-1 border-b-2 cursor-pointer ${
              activeTab === 'POST' ? 'border-red-600 text-red-600 bg-white' : 'border-transparent text-slate-500'
            }`}
          >
            <FileImage className="w-4 h-4" />
            <span>3. POST</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('HEADLINE'); setSuccessMsg(''); }}
            className={`py-3 text-center flex flex-col items-center gap-1 border-b-2 cursor-pointer ${
              activeTab === 'HEADLINE' ? 'border-red-600 text-red-600 bg-white' : 'border-transparent text-slate-500'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>4. HEADLINE</span>
          </button>
        </div>

        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {activeTab === 'VIDEO' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Video Title *</label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="e.g. Masterclass 04: Advanced API Security & Token Architecture"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Video Description</label>
                <textarea
                  rows={2}
                  value={videoDesc}
                  onChange={(e) => setVideoDesc(e.target.value)}
                  placeholder="Summarize key learning objectives and prerequisites..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                  <select
                    value={videoCategory}
                    onChange={(e) => setVideoCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="SKILL">SKILL</option>
                    <option value="COURSE">COURSE</option>
                    <option value="EDUCATION">EDUCATION</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Video Duration</label>
                  <input
                    type="text"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    placeholder="e.g. 28:30"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'LIVE' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Live Broadcast Title *</label>
                <input
                  type="text"
                  value={liveTitle}
                  onChange={(e) => setLiveTitle(e.target.value)}
                  placeholder="e.g. 🔴 LIVE: Exam Revision & Code Review Marathon"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Session Agenda &amp; Description</label>
                <textarea
                  rows={3}
                  value={liveDesc}
                  onChange={(e) => setLiveDesc(e.target.value)}
                  placeholder="Describe topics to be live-streamed to subscribed students..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {activeTab === 'POST' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Notice / Post Title *</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Important Announcement Regarding Monthly Exam Syllabus"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Post Type</label>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="UPCOMING_EXAM">Upcoming Exam Notice</option>
                    <option value="NOTICE">General Notice</option>
                    <option value="TEST_INFO">Test Information</option>
                    <option value="CLASS_UPDATE">Class Update</option>
                    <option value="ANNOUNCEMENT">Educational Announcement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                  <select
                    value={videoCategory}
                    onChange={(e) => setVideoCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="SKILL">SKILL</option>
                    <option value="COURSE">COURSE</option>
                    <option value="EDUCATION">EDUCATION</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Post Details &amp; Body</label>
                <textarea
                  rows={3}
                  value={postDesc}
                  onChange={(e) => setPostDesc(e.target.value)}
                  placeholder="Write clear instructions, test dates, and syllabus checkpoints..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>
            </>
          )}

          {activeTab === 'HEADLINE' && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Text-Based Ticker Headline (No image required) *
              </label>
              <textarea
                rows={3}
                value={headlineText}
                onChange={(e) => setHeadlineText(e.target.value)}
                placeholder="e.g. 📢 New problem set uploaded in eBooks. Solve before Friday 5 PM."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Appears instantly in top notification banners on relevant student dashboards.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Broadcasting Content...' : `Publish ${activeTab} across SKILLJ`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

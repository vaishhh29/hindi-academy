// pages/CoursePlayer.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Play, CheckCircle } from 'lucide-react';

type CourseVideo = { id: number; title: string; description?: string; url: string; duration?: string; };
type CourseModule = { id: number; title: string; videos: CourseVideo[]; };
type Course = {
  id: number;
  title: string;
  description: string;
  outcome: string;
  level: 'Beginner'|'Intermediate'|'Advanced';
  duration: string;
  createdAt: string;
  modules: CourseModule[];
};

const CoursePlayer: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [expandedModuleIds, setExpandedModuleIds] = useState<number[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [autoPlayNext, setAutoPlayNext] = useState(true);

  useEffect(() => {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]') as Course[];
    const found = courses.find(c => String(c.id) === id);
    if (!found) return navigate('/courses');
    setCourse(found);
    // expand first module by default
    if (found.modules.length) setExpandedModuleIds([found.modules[0].id]);
    // load course progress object
    const store = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    setProgress(store[String(id)] || {});
  }, [id, navigate]);

  useEffect(() => {
    // persist progress on change
    const all = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    all[String(id)] = progress;
    localStorage.setItem('courseProgress', JSON.stringify(all));
  }, [progress, id]);

  if (!course) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const currentModule = course.modules[currentModuleIndex] || course.modules[0];
  const currentVideo = currentModule?.videos[currentVideoIndex];

  const toggleModule = (moduleId:number, index:number) => {
    if (expandedModuleIds.includes(moduleId)) {
      setExpandedModuleIds(expandedModuleIds.filter(x=>x!==moduleId));
    } else {
      setExpandedModuleIds([...expandedModuleIds, moduleId]);
      // optionally set the module & video index so that the right video loads when user expands & clicks
    }
  };

  const selectVideo = (mIndex:number, vIndex:number) => {
    setCurrentModuleIndex(mIndex);
    setCurrentVideoIndex(vIndex);
    // ensure module is expanded
    const mid = course.modules[mIndex].id;
    if (!expandedModuleIds.includes(mid)) setExpandedModuleIds([...expandedModuleIds, mid]);
    // optional autoplay
    setTimeout(()=> {
      videoRef.current?.play().catch(()=>{});
    }, 50);
  };

  const markVideoComplete = (videoId: number) => {
    setProgress(prev => ({ ...prev, [String(videoId)]: true }));
  };

  const allVideosCount = course.modules.reduce((a,m) => a + m.videos.length, 0);
  const completedCount = Object.values(progress).filter(Boolean).length;
  const overallProgress = Math.round((completedCount / Math.max(1, allVideosCount)) * 100);

  const handleVideoEnded = () => {
    // mark completed
    const vid = currentVideo?.id;
    if (vid) markVideoComplete(vid);
    // auto next video or module if enabled
    if (!autoPlayNext) return;
    const m = currentModuleIndex;
    const v = currentVideoIndex;
    const module = course.modules[m];
    if (v + 1 < module.videos.length) {
      setCurrentVideoIndex(v + 1);
      setTimeout(()=> videoRef.current?.play().catch(()=>{}), 50);
    } else {
      // completed module
      if (m + 1 < course.modules.length) {
        setCurrentModuleIndex(m + 1);
        setCurrentVideoIndex(0);
        const nextMid = course.modules[m+1].id;
        if (!expandedModuleIds.includes(nextMid)) setExpandedModuleIds([...expandedModuleIds, nextMid]);
        setTimeout(()=> videoRef.current?.play().catch(()=>{}), 50);
      } else {
        // finished course
        // keep at last video
      }
    }
  };

  const handlePlayNext = () => {
    const m = currentModuleIndex;
    const v = currentVideoIndex;
    const module = course.modules[m];
    if (v + 1 < module.videos.length) {
      setCurrentVideoIndex(v + 1);
    } else if (m + 1 < course.modules.length) {
      setCurrentModuleIndex(m + 1);
      setCurrentVideoIndex(0);
      const nextMid = course.modules[m+1].id;
      if (!expandedModuleIds.includes(nextMid)) setExpandedModuleIds([...expandedModuleIds, nextMid]);
    }
    setTimeout(()=> videoRef.current?.play().catch(()=>{}), 100);
  };

  const isVideoComplete = (videoId:number) => !!progress[String(videoId)];
  const isModuleComplete = (module:CourseModule) => {
    return module.videos.every(v => !!progress[String(v.id)]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-4 gap-6">
        {/* Left sidebar */}
        <div className="lg:col-span-1 bg-white border rounded-lg overflow-auto max-h-[80vh] p-4">
          <div className="mb-4">
            <div className="font-bold">{course.title}</div>
            <div className="text-xs text-gray-500">{overallProgress}% completed</div>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div style={{ width: `${overallProgress}%` }} className="h-full bg-green-500" />
            </div>
          </div>

          <div className="divide-y">
            {course.modules.map((m, mi) => (
              <div key={m.id} className="py-2">
                <button onClick={()=>toggleModule(m.id, mi)} className="w-full flex items-center justify-between gap-2 py-2">
                  <div className="text-sm font-medium">{m.title}</div>
                  <div className="flex items-center gap-2">
                    {isModuleComplete(m) && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {expandedModuleIds.includes(m.id) ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </button>
                {expandedModuleIds.includes(m.id) && (
                  <div className="mt-2 pl-3">
                    {m.videos.map((v, vi) => {
                      const active = mi === currentModuleIndex && vi === currentVideoIndex;
                      return (
                        <button key={v.id} onClick={()=>selectVideo(mi, vi)} className={`w-full text-left flex items-center justify-between gap-2 py-2 px-2 rounded ${active ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isVideoComplete(v.id) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                              {isVideoComplete(v.id) ? <CheckCircle className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                            </div>
                            <div className="text-sm">{v.title}</div>
                          </div>
                          <div className="text-xs text-gray-400">{v.duration ?? '—'}</div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right player area */}
        <div className="lg:col-span-3 bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">{currentModule?.title} — {currentVideo?.title}</h2>
              <div className="text-sm text-gray-500">{course.level} • {course.duration}</div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={autoPlayNext} onChange={()=>setAutoPlayNext(s=>!s)} />
                Auto-next
              </label>
              <Link to={`/courses/${course.id}`} className="text-sm px-3 py-1 border rounded">Course details</Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {currentVideo?.url ? (
                <div className="bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    src={currentVideo.url}
                    controls
                    onEnded={handleVideoEnded}
                    className="w-full h-[420px] object-contain bg-black"
                  />
                </div>
              ) : (
                <div className="w-full h-[420px] bg-gray-200 rounded-lg flex items-center justify-center">No video source</div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={()=> {
                    // mark completed manually (if user clicks)
                    if (currentVideo?.id) markVideoComplete(currentVideo.id);
                  }} className="px-3 py-2 border rounded">Mark complete</button>
                  <button onClick={handlePlayNext} className="bg-orange-500 text-white px-4 py-2 rounded flex items-center gap-2">
                    Next
                  </button>
                </div>
                <div className="text-sm text-gray-500">{completedCount}/{allVideosCount} videos completed</div>
              </div>
            </div>

            {/* Live notes */}
            <aside className="md:col-span-1 bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Live Notes</h4>
              <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Take notes while watching..." className="w-full h-60 p-2 border rounded"></textarea>
              <div className="mt-2 flex items-center gap-2">
                <button className="px-3 py-1 border rounded" onClick={() => {
                  // export notes to localStorage per course+video
                  const key = `notes_course_${course.id}_video_${currentVideo?.id}`;
                  if (currentVideo?.id) localStorage.setItem(key, notes);
                }}>Save</button>
                <button className="px-3 py-1 border rounded" onClick={()=>{
                  const key = `notes_course_${course.id}_video_${currentVideo?.id}`;
                  if (currentVideo?.id) {
                    const n = localStorage.getItem(key) || '';
                    setNotes(n);
                  }
                }}>Load</button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;

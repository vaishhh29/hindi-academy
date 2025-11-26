// pages/CourseList.tsx
import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ChevronDown } from 'lucide-react';

type CourseVideo = { id: number; title: string; description?: string; url: string; duration?: string; };
type CourseModule = { id: number; title: string; videos: CourseVideo[]; };
type Course = {
  id: number;
  title: string;
  description: string;
  outcome: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  createdAt: string;
  modules: CourseModule[];
};

const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<'All'|'Beginner'|'Intermediate'|'Advanced'>('All');
  const [sortBy, setSortBy] = useState<'recent'|'oldest'|'title'>('recent');
  const [enrollments, setEnrollments] = useState<number[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('courses') || '[]') as Course[];
    setCourses(stored);
    const enr = JSON.parse(localStorage.getItem('enrollments') || '[]') as number[];
    setEnrollments(enr);
  }, []);

  useEffect(() => {
    localStorage.setItem('enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  const filtered = useMemo(() => {
    let list = [...courses];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    if (levelFilter !== 'All') list = list.filter(c => c.level === levelFilter);
    if (sortBy === 'recent') list.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sortBy === 'oldest') list.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    if (sortBy === 'title') list.sort((a,b) => a.title.localeCompare(b.title));
    return list;
  }, [courses, search, levelFilter, sortBy]);

  // compute enrolled progress summary
  const progressMap = useMemo(() => {
    const map: Record<number, number> = {};
    const store = JSON.parse(localStorage.getItem('courseProgress') || '{}') as Record<string, Record<string, boolean>>;
    // structure: { "<courseId>": { "<videoId>": true, ... }, ... }
    for (const course of courses) {
      const totalVideos = course.modules.reduce((acc,m) => acc + m.videos.length, 0);
      const completed = store[course.id]?.length ? Object.values(store[course.id]).filter(Boolean).length : (function(){ let c=0; if(store[course.id]) for(const k in store[course.id]) if(store[course.id][k]) c++; return c; })();
      // The above is robust but localStorage stores nested objects — we'll compute properly below
    }
    // Recompute cleanly:
    for (const course of courses) {
      const key = String(course.id);
      const per = JSON.parse(localStorage.getItem('courseProgress') || '{}')[key] || {};
      const total = course.modules.reduce((acc,m) => acc + m.videos.length, 0) || 1;
      const comp = Object.values(per).filter(Boolean).length || 0;
      map[course.id] = Math.round((comp / total) * 100);
    }
    return map;
  }, [courses]);

  const handleEnroll = (courseId: number) => {
    if (!enrollments.includes(courseId)) {
      const n = [...enrollments, courseId];
      setEnrollments(n);
      localStorage.setItem('enrollments', JSON.stringify(n));
      // initialize progress structure for that course (if not exists)
      const cp = JSON.parse(localStorage.getItem('courseProgress') || '{}');
      if (!cp[courseId]) cp[courseId] = {};
      localStorage.setItem('courseProgress', JSON.stringify(cp));
      navigate(`/courses/${courseId}/play`);
    } else {
      navigate(`/courses/${courseId}/play`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Courses</h1>
            <p className="text-gray-600">Explore courses uploaded by admins</p>
          </div>
          <div className="flex items-center gap-3">
            <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search courses..." className="px-4 py-2 border rounded-lg" />
            <select value={levelFilter} onChange={(e)=>setLevelFilter(e.target.value as any)} className="px-3 py-2 border rounded-lg">
              <option value="All">All levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <select value={sortBy} onChange={(e)=>setSortBy(e.target.value as any)} className="px-3 py-2 border rounded-lg">
              <option value="recent">Recent</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {filtered.length === 0 && <div className="p-8 bg-white rounded-lg border">No courses found.</div>}
            {filtered.map(course => (
              <div key={course.id} className="bg-white p-6 rounded-lg border flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-56 h-36 bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg flex items-end p-4 text-white">
                  <div>
                    <h3 className="text-lg font-bold">{course.title}</h3>
                    <div className="text-sm opacity-90">{course.level} • {course.duration}</div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 mb-4 line-clamp-3">{course.description}</p>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-500">Modules: {course.modules.length}</div>
                      <div className="text-sm text-gray-500">Videos: {course.modules.reduce((a,m)=>a+m.videos.length,0)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/courses/${course.id}`} className="px-3 py-2 border rounded-lg text-sm">View</Link>
                      <button onClick={()=>handleEnroll(course.id)} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm">
                        {enrollments.includes(course.id) ? 'Go to course' : 'Enroll'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-32 flex flex-col items-end justify-between">
                  <div className="text-right text-xs text-gray-500">Enrolled</div>
                  <div className="text-2xl font-bold text-gray-800">{progressMap[course.id] || 0}%</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right column: enrolled courses progress */}
          <aside className="bg-white p-6 rounded-lg border h-fit">
            <h4 className="font-bold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Your Enrolled Courses</h4>
            {enrollments.length === 0 && <p className="text-gray-500">No enrolled courses yet.</p>}
            {enrollments.map(id => {
              const c = courses.find(x=>x.id===id);
              if (!c) return null;
              const percent = progressMap[id] ?? 0;
              return (
                <div key={id} className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{c.title}</div>
                      <div className="text-xs text-gray-500">{c.modules.length} modules</div>
                    </div>
                    <div className="text-sm font-bold">{percent}%</div>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded mt-2 overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="mt-2">
                    <button onClick={()=>navigate(`/courses/${id}/play`)} className="text-sm px-3 py-1 border rounded">Go to course</button>
                  </div>
                </div>
              );
            })}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseList;

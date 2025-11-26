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
    for (const course of courses) {
      const key = String(course.id);
      // Retrieve progress for the current course
      const courseProgressStore = JSON.parse(localStorage.getItem('courseProgress') || '{}');
      const per = courseProgressStore[key] || {};
      
      // Calculate total videos
      const total = course.modules.reduce((acc,m) => acc + m.videos.length, 0) || 1;
      
      // Calculate completed videos (count entries that are truthy)
      const comp = Object.values(per).filter(Boolean).length || 0;
      
      // Calculate percentage
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header and Filters: Stack title/filters on mobile */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            {/* Title block */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
              <p className="text-gray-600">Explore courses uploaded by admins</p>
            </div>
            {/* Filters/Sort block - now uses flex-wrap on small screens */}
            <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
              <input 
                value={search} 
                onChange={(e)=>setSearch(e.target.value)} 
                placeholder="Search courses..." 
                className="px-4 py-2 border rounded-lg w-full sm:w-auto" 
              />
              <select 
                value={levelFilter} 
                onChange={(e)=>setLevelFilter(e.target.value as any)} 
                className="px-3 py-2 border rounded-lg w-1/3 sm:w-auto min-w-[120px]"
              >
                <option value="All">All levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <select 
                value={sortBy} 
                onChange={(e)=>setSortBy(e.target.value as any)} 
                className="px-3 py-2 border rounded-lg w-1/3 sm:w-auto min-w-[120px]"
              >
                <option value="recent">Recent</option>
                <option value="oldest">Oldest</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Single column on mobile, 3 columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Main Course List) */}
          <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
            {filtered.length === 0 && <div className="p-8 bg-white rounded-lg border shadow-sm">No courses found matching your criteria.</div>}
            {filtered.map(course => (
              <div key={course.id} className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border flex flex-col md:flex-row gap-4 sm:gap-6 transition hover:shadow-xl">
                
                {/* 1. Course Banner/Title (Fixed size on desktop, full width on mobile) */}
                <div className="w-full md:w-56 h-36 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-end p-4 text-white shadow-md flex-shrink-0">
                  <div>
                    <h3 className="text-lg font-bold">{course.title}</h3>
                    <div className="text-sm opacity-90">{course.level} • {course.duration}</div>
                  </div>
                </div>
                
                {/* 2. Course Details & Actions */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <p className="text-gray-700 mb-4 line-clamp-3">{course.description}</p>
                  
                  {/* Metadata and Buttons container */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-gray-100">
                    
                    {/* Metadata (Modules/Videos) */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div>Modules: <span className='font-medium text-gray-700'>{course.modules.length}</span></div>
                      <div>Videos: <span className='font-medium text-gray-700'>{course.modules.reduce((a,m)=>a+m.videos.length,0)}</span></div>
                    </div>
                    
                    {/* Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link 
                        to={`/courses/${course.id}`} 
                        className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition duration-150"
                      >
                        View Details
                      </Link>
                      <button 
                        onClick={()=>handleEnroll(course.id)} 
                        className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition duration-150"
                      >
                        {enrollments.includes(course.id) ? 'Go to course' : 'Enroll'}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* 3. Progress Section (Moves to bottom-right of content on mobile) */}
                <div className="w-full md:w-32 flex flex-row md:flex-col items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 mt-4 md:mt-0 flex-shrink-0">
                  <div className="text-right text-xs text-gray-500">Your Progress</div>
                  <div className="text-3xl font-extrabold text-blue-600">{progressMap[course.id] || 0}%</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column (Enrolled Progress Sidebar) */}
          <aside className="bg-white p-6 rounded-xl border h-fit shadow-lg order-1 lg:order-2">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800"><BookOpen className="w-5 h-5 text-blue-500" /> Your Enrolled Courses</h4>
            {enrollments.length === 0 && <p className="text-gray-500 text-sm">You haven't enrolled in any courses yet. Start exploring above!</p>}
            {enrollments.map(id => {
              const c = courses.find(x=>x.id===id);
              if (!c) return null;
              const percent = progressMap[id] ?? 0;
              return (
                <div key={id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm line-clamp-1">{c.title}</div>
                      <div className="text-xs text-gray-500">{c.modules.length} modules</div>
                    </div>
                    <div className="text-sm font-bold text-blue-600">{percent}%</div>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="mt-3 text-right">
                    <button onClick={()=>navigate(`/courses/${id}/play`)} className="text-xs text-blue-600 hover:underline">Continue</button>
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
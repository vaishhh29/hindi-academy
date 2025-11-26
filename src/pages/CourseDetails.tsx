import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// --- Type Definitions ---
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

const CourseDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    // Fetches course data and enrollment status from localStorage
    const courses = JSON.parse(localStorage.getItem('courses') || '[]') as Course[];
    const found = courses.find(c => String(c.id) === id);
    setCourse(found || null);
    
    const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]') as number[];
    setEnrolled(enrollments.includes(Number(id)));
  }, [id]);

  const handleEnroll = () => {
    const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]') as number[];
    if (!enrollments.includes(Number(id))) {
      enrollments.push(Number(id));
      localStorage.setItem('enrollments', JSON.stringify(enrollments));
      
      // Initialize progress for the newly enrolled course
      const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
      if (!progress[id]) progress[id] = {};
      localStorage.setItem('courseProgress', JSON.stringify(progress));
    }
    // Navigate to the course player page
    navigate(`/courses/${id}/play`);
  };

  if (!course) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">Course not found.</div>;

  // Placeholder for enrolled students count
  const totalEnrolled = (Math.floor(Math.random() * 2000) + 20);

  return (
    // Responsive padding for container
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-100">
        
        {/* Main layout container: Stack on mobile, side-by-side on desktop */}
        <div className="flex flex-col md:flex-row items-start gap-8">
          
          {/* Aside/Sidebar: Full width on mobile, fixed width on desktop. order-first puts it above the content on mobile for better CTA visibility */}
          <aside className="w-full md:w-64 order-first md:order-last">
            <div className="sticky top-6 bg-white p-6 rounded-xl border border-gray-200 shadow-xl text-center">
              <div className="text-sm text-gray-500">Course Rating</div>
              <div className="text-3xl font-extrabold text-yellow-500 my-2 flex items-center justify-center">
                4.5 <span className="ml-1 text-2xl">★</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">{totalEnrolled} students</div>
              <button 
                onClick={handleEnroll} 
                className="bg-blue-600 hover:bg-blue-700 transition duration-150 text-white font-semibold px-6 py-3 rounded-full w-full shadow-lg transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                {enrolled ? 'Continue Learning' : 'Enroll Now'}
              </button>
            </div>
          </aside>

          {/* Main Content: Takes remaining space */}
          <div className="flex-1 order-last md:order-first w-full">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">{course.title}</h1>
            
            {/* Metadata Badges */}
            <div className="text-base text-gray-500 mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{course.level}</span>
              <span className="text-gray-600 text-sm">{course.duration}</span>
              <span className="text-gray-600 text-sm">{totalEnrolled} students enrolled</span>
            </div>

            {/* Course Description */}
            <h2 className="text-2xl font-semibold mt-8 mb-2 border-b pb-1 text-gray-800">Course Overview</h2>
            {/* Added whitespace-pre-wrap to respect line breaks in the description text */}
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{course.description}</p> 

            {/* Learning Outcomes */}
            <h3 className="text-2xl font-semibold mt-8 mb-2 border-b pb-1 text-gray-800">What You'll Achieve</h3>
            {/* Added whitespace-pre-wrap to respect line breaks in the outcome text */}
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{course.outcome}</p> 

            {/* Curriculum Modules Section */}
            <div className="mt-10 p-4 bg-gray-50 rounded-xl border">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Curriculum ({course.modules.length} Modules)</h4>
              <ul className="space-y-3">
                {course.modules.map(m => (
                  <li key={m.id} className="p-4 bg-white rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center transition duration-150 hover:shadow-md border border-gray-100">
                    <div className='flex items-center gap-3'>
                        {/* Module Icon (Book/Folder) */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 2v-2H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.001l-2.999 2.999V11h-2A2 2 0 015 9V7a2 2 0 012-2h2.247c.606 0 1.18.232 1.603.66l2.35 2.35A2 2 0 0115 9.75V7z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="font-medium text-gray-800">{m.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{m.videos.length} lessons</div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 flex-shrink-0 mt-2 sm:mt-0">
                        {/* Calculate total duration for the module */}
                        {`~${m.videos.reduce((a,b)=>a+(b.duration?parseFloat(b.duration):5),0).toFixed(0)} mins`}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
// pages/CourseDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
      // init progress for course
      const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
      if (!progress[id]) progress[id] = {};
      localStorage.setItem('courseProgress', JSON.stringify(progress));
    }
    navigate(`/courses/${id}/play`);
  };

  if (!course) return <div className="min-h-screen flex items-center justify-center">Course not found.</div>;

  const totalEnrolled = (Math.floor(Math.random() * 2000) + 20); // placeholder. You may track real numbers later.

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg border">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <div className="text-sm text-gray-500 mb-4">{course.level} • {course.duration} • {totalEnrolled} enrolled</div>
            <p className="text-gray-700 mb-4">{course.description}</p>

            <h3 className="font-semibold mt-6">What you'll learn</h3>
            <p className="text-gray-700 mb-4">{course.outcome}</p>

            <div className="mt-6">
              <h4 className="font-semibold">Modules ({course.modules.length})</h4>
              <ul className="mt-2 space-y-2">
                {course.modules.map(m => (
                  <li key={m.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{m.title}</div>
                      <div className="text-xs text-gray-500">{m.videos.length} videos</div>
                    </div>
                    <div className="text-sm text-gray-500">~{m.videos.reduce((a,b)=>a+(b.duration?parseFloat(b.duration):5),0)} mins</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="w-64">
            <div className="bg-gray-50 p-4 rounded-lg border text-center">
              <div className="text-sm text-gray-500">Rating</div>
              <div className="text-2xl font-bold my-2">4.5 ★</div>
              <div className="text-sm text-gray-500 mb-4">{totalEnrolled} students</div>
              <button onClick={handleEnroll} className="bg-orange-500 text-white px-4 py-2 rounded-lg w-full">
                {enrolled ? 'Go to course' : 'Enroll now'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

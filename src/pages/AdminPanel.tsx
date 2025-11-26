import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Phone,
  Eye,
  Trash2,
  Video, 
  Plus,
  ArrowLeft,
  Save, 
  BookOpen,
  Layers,
  FileVideo,
  ChevronDown,
  ChevronUp,
  MoreVertical
} from 'lucide-react';

// --- Interface Definitions (Unchanged) ---

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  occupation: string;
  experience: string;
  goals: string;
  preferredTime: string;
  courseType: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Appointment {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  appointmentType: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  bookedAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface CourseVideo {
  id: number;
  title: string;
  description: string;
  url: string;
  duration?: string;
}

interface CourseModule {
  id: number;
  title: string;
  videos: CourseVideo[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  outcome: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  createdAt: string;
  modules: CourseModule[];
}

// --- Component: Course Builder ---
// Optimized for mobile by ensuring grid layouts collapse on small screens
const CourseBuilder = ({ 
  onSave, 
  onCancel, 
  initialData 
}: { 
  onSave: (course: Course) => void; 
  onCancel: () => void;
  initialData?: Course | null;
}) => {
  // Course Metadata State
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [outcome, setOutcome] = useState(initialData?.outcome || '');
  const [level, setLevel] = useState<Course['level']>(initialData?.level || 'Beginner');
  const [duration, setDuration] = useState(initialData?.duration || '');
  
  // Modules State
  const [modules, setModules] = useState<CourseModule[]>(initialData?.modules || []);

  // Temporary state for adding a video
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const addModule = () => {
    const newModule: CourseModule = {
      id: Date.now(),
      title: `Module ${modules.length + 1}: New Module`,
      videos: []
    };
    setModules([...modules, newModule]);
  };

  const updateModuleTitle = (id: number, newTitle: string) => {
    setModules(modules.map(m => m.id === id ? { ...m, title: newTitle } : m));
  };

  const removeModule = (id: number) => {
    setModules(modules.filter(m => m.id !== id));
  };

  const handleVideoUpload = (moduleId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newVideo: CourseVideo = {
        id: Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: '',
        url: reader.result as string 
      };

      setModules(prevModules => prevModules.map(m => {
        if (m.id === moduleId) {
          return { ...m, videos: [...m.videos, newVideo] };
        }
        return m;
      }));
    };

    reader.readAsDataURL(file); 
  };

  const updateVideoDetails = (moduleId: number, videoId: number, field: keyof CourseVideo, value: string) => {
    setModules(prevModules => prevModules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          videos: m.videos.map(v => v.id === videoId ? { ...v, [field]: value } : v)
        };
      }
      return m;
    }));
  };

  const removeVideo = (moduleId: number, videoId: number) => {
    setModules(prevModules => prevModules.map(m => {
      if (m.id === moduleId) {
        return { ...m, videos: m.videos.filter(v => v.id !== videoId) };
      }
      return m;
    }));
  };

  const handleSaveCourse = () => {
    if (!title.trim()) {
      alert("Course title is required");
      return;
    }

    const courseData: Course = {
      id: initialData?.id || Date.now(),
      title,
      description,
      outcome,
      level,
      duration,
      createdAt: initialData?.createdAt || new Date().toLocaleDateString(),
      modules
    };
    onSave(courseData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Builder Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <h2 className="text-lg font-bold text-gray-800 sm:text-xl truncate">
            {initialData ? 'Edit Course' : 'Create New Course'}
          </h2>
        </div>
        <button 
          onClick={handleSaveCourse}
          className="bg-green-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-green-700 flex items-center gap-1 sm:px-6 sm:py-2 sm:text-base"
        >
          <Save className="w-4 h-4" /> <span className='hidden sm:inline'>Save Course</span>
        </button>
      </div>

      <div className="p-4 space-y-6 sm:p-8 sm:space-y-8">
        {/* 1. Course Cover Details */}
        <section className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200 sm:p-6 sm:space-y-6">
          <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2 sm:text-lg">
            <BookOpen className="w-5 h-5" /> Course Overview
          </h3>
          
          {/* The grid becomes single column on mobile, then 2 columns on medium+ screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="col-span-1 md:col-span-2"> {/* Title spans 2 columns on all sizes, but explicitly for MD+ it spans 2 */}
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. Master Hindi Speaking"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Level</label>
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Duration (Approx)</label>
              <input 
                type="text" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. 12 Hours"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">About this Course</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Brief summary of the course content..."
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Learning Outcomes</label>
              <textarea 
                value={outcome} 
                onChange={(e) => setOutcome(e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="What will students achieve?"
              />
            </div>
          </div>
        </section>

        {/* 2. Modules Builder */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2 sm:text-lg">
              <Layers className="w-5 h-5" /> Course Content
            </h3>
            <button 
              onClick={addModule}
              className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 text-sm"
            >
              <Plus className="w-4 h-4" /> Add Module
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {modules.map((module, mIndex) => (
              <div key={module.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                {/* Module Header */}
                <div className="bg-gray-100 p-3 sm:p-4 flex items-center gap-3">
                  <Layers className="w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={module.title}
                    onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                    className="bg-transparent border-none font-semibold text-gray-700 flex-grow focus:ring-0 text-sm sm:text-base"
                    placeholder="Module Title"
                  />
                  <button 
                    onClick={() => removeModule(module.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Videos in Module */}
                <div className="p-3 sm:p-4 bg-gray-50/50 space-y-3">
                  {module.videos.length === 0 && (
                    <p className="text-xs text-gray-400 italic text-center py-2 sm:text-sm">No videos in this module yet.</p>
                  )}
                  
                  {module.videos.map((video, vIndex) => (
                    <div key={video.id} className="flex gap-3 p-3 bg-white border border-gray-200 rounded-lg items-start">
                      {/* Video Thumbnail (Adjusted size for mobile) */}
                      <div className="w-20 h-12 sm:w-32 sm:h-20 bg-black rounded flex-shrink-0 flex items-center justify-center">
                        {/* The video tag here relies on the base64/blob URL which can be performance intensive in a real app */}
                        <video src={video.url} className="w-full h-full object-cover rounded" />
                      </div>
                      <div className="flex-grow space-y-1 sm:space-y-2">
                        <input 
                          type="text" 
                          value={video.title}
                          onChange={(e) => updateVideoDetails(module.id, video.id, 'title', e.target.value)}
                          className="w-full text-sm font-medium border-b border-transparent hover:border-gray-300 focus:border-orange-500 focus:outline-none bg-transparent"
                          placeholder="Video Title"
                        />
                        <input 
                          type="text" 
                          value={video.description}
                          onChange={(e) => updateVideoDetails(module.id, video.id, 'description', e.target.value)}
                          className="w-full text-xs text-gray-500 border-b border-transparent hover:border-gray-300 focus:border-orange-500 focus:outline-none bg-transparent"
                          placeholder="Video Description"
                        />
                      </div>
                      <button 
                        onClick={() => removeVideo(module.id, video.id)}
                        className="text-gray-400 hover:text-red-500 flex-shrink-0"
                      >
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  ))}

                  {/* Add Video Button */}
                  <div className="mt-4 flex justify-center">
                    <input 
                      type="file" 
                      ref={(el) => (fileInputRefs.current[module.id] = el)}
                      className="hidden" 
                      accept="video/*"
                      onChange={(e) => handleVideoUpload(module.id, e)}
                    />
                    <button 
                      onClick={() => fileInputRefs.current[module.id]?.click()}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 border border-dashed border-blue-300 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 w-full justify-center"
                    >
                      <FileVideo className="w-4 h-4" /> Add Video to Module
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Main AdminPanel Component ---
const AdminPanel = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  
  const [activeTab, setActiveTab] = useState<'users' | 'appointments' | 'courses'>('users');
  const [selectedItem, setSelectedItem] = useState<User | Appointment | null>(null);
  
  // Course View State: 'list' | 'create' | 'edit'
  const [courseViewMode, setCourseViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Initialization
  useEffect(() => {
    setUsers(JSON.parse(localStorage.getItem('signupUsers') || '[]'));
    setAppointments(JSON.parse(localStorage.getItem('appointments') || '[]'));
    setCourses(JSON.parse(localStorage.getItem('courses') || '[]'));
  }, []);

  // Handlers for Users/Appointments (Condensed for brevity)
  const updateUserStatus = (id: number, status: any) => {
    const updated = users.map(u => u.id === id ? { ...u, status } : u);
    setUsers(updated);
    localStorage.setItem('signupUsers', JSON.stringify(updated));
  };
  const deleteUser = (id: number) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    localStorage.setItem('signupUsers', JSON.stringify(updated));
  };
  const updateAppointmentStatus = (id: number, status: any) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status } : a);
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
  };
  const deleteAppointment = (id: number) => {
    const updated = appointments.filter(a => a.id !== id);
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
  };

  // --- Course Logic ---
  const handleSaveCourse = (course: Course) => {
    let updatedCourses;
    if (courseViewMode === 'create') {
      updatedCourses = [...courses, course];
    } else {
      updatedCourses = courses.map(c => c.id === course.id ? course : c);
    }
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    setCourseViewMode('list');
    setEditingCourse(null);
  };

  const deleteCourse = (id: number) => {
    if(confirm("Are you sure you want to delete this course?")) {
      const updated = courses.filter(c => c.id !== id);
      setCourses(updated);
      localStorage.setItem('courses', JSON.stringify(updated));
    }
  };

 const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'approved':
    case 'confirmed':
      return 'text-green-600 bg-green-100';
    case 'rejected':
    case 'cancelled':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};


  const renderCourses = () => {
    if (courseViewMode === 'create' || courseViewMode === 'edit') {
      return (
        <CourseBuilder 
          initialData={editingCourse}
          onSave={handleSaveCourse}
          onCancel={() => { setCourseViewMode('list'); setEditingCourse(null); }}
        />
      );
    }

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">Course Management</h2>
            <p className="text-gray-500 text-sm">Create and manage your video courses</p>
          </div>
          <button 
            onClick={() => { setEditingCourse(null); setCourseViewMode('create'); }}
            className="mt-3 sm:mt-0 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2 font-medium text-sm"
          >
            <Plus className="w-5 h-5" /> Create New Course
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-10 sm:py-20 bg-white rounded-lg border border-dashed border-gray-300">
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">No courses created yet. Click above to start.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {courses.map(course => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col"
              >
                <div className="h-24 sm:h-32 bg-gradient-to-r from-orange-400 to-pink-500 p-4 sm:p-6 flex flex-col justify-end text-white">
                  <h3 className="text-lg font-bold sm:text-xl">{course.title}</h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm opacity-90">
                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{course.level}</span>
                    <span>• {course.duration}</span>
                  </div>
                </div>
                <div className="p-4 sm:p-6 flex-grow">
                   <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">
                     <Layers className="w-4 h-4" /> {course.modules.length} Modules
                     <span>•</span>
                     <Video className="w-4 h-4" /> {course.modules.reduce((acc, m) => acc + m.videos.length, 0)} Videos
                   </div>
                   <p className="text-gray-600 text-sm line-clamp-3 mb-4">{course.description}</p>
                   
                   <div className="flex gap-2 pt-3 sm:pt-4 border-t border-gray-100 mt-auto">
                     <button 
                       onClick={() => { setEditingCourse(course); setCourseViewMode('edit'); }}
                       className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2"
                     >
                       <Layers className="w-4 h-4" /> <span className='hidden sm:inline'>Manage Content</span><span className='sm:hidden'>Manage</span>
                     </button>
                     <button 
                       onClick={() => deleteCourse(course.id)}
                       className="p-2 text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center"
                     >
                       <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                     </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-6 bg-gray-50 sm:py-12">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 to-green-500 text-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <h1 className="text-3xl font-bold mb-3 sm:text-5xl">Admin Panel</h1>
            <p className="text-base sm:text-xl">Manage student registrations, appointments, and courses</p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section: Uses grid-cols-2 on small screens, and grid-cols-4 on medium+ screens */}
      <section className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-4 rounded-lg shadow-lg text-center sm:p-6">
              <Users className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500 mx-auto mb-2 sm:mb-4" />
              <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">{users.length}</h3>
              <p className="text-gray-600 text-sm">Registrations</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg text-center sm:p-6">
              <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-purple-500 mx-auto mb-2 sm:mb-4" />
              <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">{appointments.length}</h3>
              <p className="text-gray-600 text-sm">Appointments</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg text-center sm:p-6">
              <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-500 mx-auto mb-2 sm:mb-4" />
              <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">{users.filter(u => u.status === 'pending').length + appointments.filter(a => a.status === 'pending').length}</h3>
              <p className="text-gray-600 text-sm">Pending</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg text-center sm:p-6">
              <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-orange-500 mx-auto mb-2 sm:mb-4" />
              <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">{courses.length}</h3>
              <p className="text-gray-600 text-sm">Courses</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg min-h-[600px]">
            <div className="border-b border-gray-200 overflow-x-auto"> {/* Added overflow-x-auto for horizontal scroll on tabs */}
              <nav className="flex min-w-max">
                <button onClick={() => setActiveTab('users')} className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium ${activeTab === 'users' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  <Users className="w-4 h-4 inline mr-2" /> Registrations
                </button>
                <button onClick={() => setActiveTab('appointments')} className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium ${activeTab === 'appointments' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  <Calendar className="w-4 h-4 inline mr-2" /> Appointments
                </button>
                <button onClick={() => setActiveTab('courses')} className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium ${activeTab === 'courses' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  <BookOpen className="w-4 h-4 inline mr-2" /> Courses
                </button>
              </nav>
            </div>

            <div className="p-4 bg-gray-50 min-h-[600px] sm:p-6">
              {activeTab === 'users' && (
                 <div className="space-y-3 sm:space-y-4">
                 {users.length === 0 ? <p className="text-gray-500 text-center py-8">No student registrations yet.</p> : users.map((user) => (
                   <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border bg-white border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                     <div className="flex justify-between items-start">
                       <div className="flex-1 min-w-0"> {/* Added min-w-0 for proper overflow/flex behavior */}
                         <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2">
                           <h3 className="text-base font-semibold text-gray-800 sm:text-lg truncate">{user.fullName}</h3>
                           <span className={`px-2 py-0.5 mt-1 sm:mt-0 rounded-full text-xs font-medium ${getStatusColor(user.status)} flex-shrink-0`}>{user.status}</span>
                         </div>
                         {/* Stacks details vertically on mobile */}
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-gray-600">
                           <div className="flex items-center truncate"><Mail className="w-4 h-4 mr-2 flex-shrink-0" />{user.email}</div>
                           <div className="flex items-center truncate"><Phone className="w-4 h-4 mr-2 flex-shrink-0" />{user.phone}</div>
                           <div className='truncate'>Course: {user.courseType}</div>
                         </div>
                       </div>
                       <div className="flex space-x-1 sm:space-x-2 flex-shrink-0 ml-2"> {/* Condensed action buttons */}
                         <button onClick={() => setSelectedItem(user)} className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                         {user.status === 'pending' && (
                           <>
                             <button onClick={() => updateUserStatus(user.id, 'approved')} className="p-1 sm:p-2 text-green-600 hover:bg-green-50 rounded"><CheckCircle className="w-4 h-4" /></button>
                             <button onClick={() => updateUserStatus(user.id, 'rejected')} className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded"><XCircle className="w-4 h-4" /></button>
                           </>
                         )}
                         <button onClick={() => deleteUser(user.id)} className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                       </div>
                     </div>
                   </motion.div>
                 ))}
               </div>
              )}
              
              {activeTab === 'appointments' && (
                <div className="space-y-3 sm:space-y-4">
                  {appointments.length === 0 ? <p className="text-gray-500 text-center py-8">No appointments yet.</p> : appointments.map((app) => (
                    <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border bg-white border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2">
                            <h3 className="text-base font-semibold text-gray-800 sm:text-lg truncate">{app.fullName}</h3>
                            <span className={`px-2 py-0.5 mt-1 sm:mt-0 rounded-full text-xs font-medium ${getStatusColor(app.status)} flex-shrink-0`}>{app.status}</span>
                          </div>
                          {/* Stacks details vertically on mobile */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center truncate"><Mail className="w-4 h-4 mr-2 flex-shrink-0" />{app.email}</div>
                            <div className="flex items-center truncate"><Phone className="w-4 h-4 mr-2 flex-shrink-0" />{app.phone}</div>
                            <div className='truncate'>Date: {app.preferredDate}</div>
                          </div>
                        </div>
                        <div className="flex space-x-1 sm:space-x-2 flex-shrink-0 ml-2">
                         <button onClick={() => setSelectedItem(app)} className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                         {app.status === 'pending' && (
                           <>
                             <button onClick={() => updateAppointmentStatus(app.id, 'confirmed')} className="p-1 sm:p-2 text-green-600 hover:bg-green-50 rounded"><CheckCircle className="w-4 h-4" /></button>
                             <button onClick={() => updateAppointmentStatus(app.id, 'cancelled')} className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded"><XCircle className="w-4 h-4" /></button>
                           </>
                         )}
                         <button onClick={() => deleteAppointment(app.id)} className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                       </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'courses' && renderCourses()}
            </div>
          </div>
        </div>
      </section>

      {/* Details Modal (For Users/Appointments) - Minor size adjustments */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-lg shadow-xl max-w-lg sm:max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">Details</h3>
                <button onClick={() => setSelectedItem(null)} className="text-gray-500 hover:text-gray-700"><XCircle className="w-6 h-6" /></button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {Object.entries(selectedItem).map(([key, value]) => {
                  if (key === 'id') return null;
                  return (
                    <div key={key} className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 border-b border-gray-100 pb-1"> 
                      <dt className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</dt>
                      <dd className="text-sm text-gray-900 sm:col-span-2 break-words">{value}</dd>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
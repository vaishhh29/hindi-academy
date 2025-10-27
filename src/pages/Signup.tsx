import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, CheckCircle, Sparkles, GraduationCap, ArrowRight } from 'lucide-react';
import * as THREE from 'three';

// --- Interface for form data ---
interface SignupFormData {
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
}

const Signup = () => {
  // --- Component State ---
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    occupation: '',
    experience: '',
    goals: '',
    preferredTime: '',
    courseType: ''
  });
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- 3D Background Effect ---
  useEffect(() => {
    // Ensure this only runs on the client
    if (typeof window === 'undefined' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    // Get dimensions from parent container, not window
    const container = canvas.parentElement; 
    if (!container) return; // Exit if parent is not found

    const scene = new THREE.Scene();
    // Use container dimensions for camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    // Use container dimensions for renderer
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.position.z = 5;

    // Create multiple 3D shapes
    const shapes: THREE.Mesh[] = [];
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xff6b35, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0x4ecdc4, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0x95e1d3, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0xf38181, wireframe: true })
    ];

    const geometries = [
      new THREE.TorusGeometry(0.6, 0.2, 16, 100),
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.OctahedronGeometry(0.5),
      new THREE.IcosahedronGeometry(0.4)
    ];

    const positions = [
      new THREE.Vector3(-2.5, 1.5, -1),
      new THREE.Vector3(2.5, -1.5, -1),
      new THREE.Vector3(0, -2, -2),
      new THREE.Vector3(-1.5, -0.5, -1.5)
    ];

    for (let i = 0; i < 4; i++) {
      const mesh = new THREE.Mesh(geometries[i], materials[i]);
      mesh.position.copy(positions[i]);
      shapes.push(mesh);
      scene.add(mesh);
    }

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 150; 
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.025,
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    let time = 0;
    const mouse = new THREE.Vector2();
    
    const handleMouseMove = (event: MouseEvent) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      shapes[0].rotation.x += 0.005;
      shapes[0].rotation.y += 0.005;
      shapes[1].rotation.y += 0.003;
      shapes[2].rotation.x += 0.006;
      shapes[2].rotation.z += 0.006;
      shapes[3].rotation.y += 0.004;
      shapes[3].rotation.z += 0.004;

      // Mouse interaction
      particlesMesh.rotation.y += (mouse.x * 0.0001);
      camera.position.x += (mouse.x * 0.01 - camera.position.x) * 0.02;
      camera.position.y += (-mouse.y * 0.01 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      // Floating
      shapes.forEach((shape, i) => {
        shape.position.y += Math.sin(time + i) * 0.001;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize based on container
    const handleResize = () => {
      if (container) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      materials.forEach(m => m.dispose());
      geometries.forEach(g => g.dispose());
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  // --- Form Validation ---
  const validate = () => {
    const newErrors: Partial<SignupFormData> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
    if (!formData.courseType) newErrors.courseType = 'Please select a course type';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Form Submission ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      console.log('Form submitted:', formData); // In a real app, you'd send this to a server
      setIsSubmitted(true);
      // Reset form
      setFormData({
        fullName: '', email: '', phone: '', address: '', dateOfBirth: '',
        occupation: '', experience: '', goals: '', preferredTime: '', courseType: ''
      });
    }
  };

  // --- Form Input Change Handler ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof SignupFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // --- Success Screen View ---
  if (isSubmitted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-x-hidden bg-gradient-to-br from-green-50 to-orange-50 p-4">
        <canvas ref={canvasRef} className="absolute inset-0" style={{ opacity: 0.20 }} />
        
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Success Card */}
        <div className="relative bg-white/90 backdrop-blur-2xl p-6 md:p-12 rounded-3xl shadow-2xl text-center max-w-md mx-auto border border-green-200/50">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-green-500 rounded-full blur-lg opacity-50 motion-safe:animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-orange-500 to-green-500 rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-white motion-safe:animate-bounce" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent mb-4">
            Registration Successful!
          </h2>
          <p className="text-gray-700 mb-8 text-base md:text-lg">
            Thank you for registering. We will contact you soon to confirm your enrollment.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="relative overflow-hidden group bg-gradient-to-r from-orange-500 to-green-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 motion-safe:animate-pulse"
          >
            <span className="relative z-10 text-sm md:text-base">Register Another Student</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    );
  }

  // --- Main Registration Form View ---
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-green-50">
      <canvas ref={canvasRef} className="absolute inset-0 -z-10" style={{ opacity: 0.15 }} />
      
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 md:w-96 md:h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 md:w-96 md:h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 md:w-96 md:h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Icons (subtle on mobile) */}
      <div className="absolute top-10 right-10 text-orange-400 opacity-10 md:opacity-30 motion-safe:animate-pulse -z-10" style={{ animationDuration: '3s' }}>
        <Sparkles className="w-6 h-6" />
      </div>
      <div className="absolute bottom-40 left-20 text-green-400 opacity-10 md:opacity-30 motion-safe:animate-pulse -z-10" style={{ animationDuration: '4s', animationDelay: '1s' }}>
        <GraduationCap className="w-8 h-8" />
      </div>
      <div className="absolute top-1/3 left-10 text-amber-400 opacity-10 md:opacity-30 motion-safe:animate-pulse -z-10" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
        <BookOpen className="w-6 h-6" />
      </div>
      
      {/* Hero Section */}
      <section className="relative">
        {/* Responsive padding */}
        <div className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-green-500 text-white py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          ></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <GraduationCap className="w-4 h-4" />
                <span className="font-semibold text-sm">Premium Hindi Learning</span>
              </div>
              {/* Responsive text */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg transition-transform duration-300 hover:scale-105">
                Join Our Academy
              </h1>
              <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto drop-shadow">
                Start your Hindi learning journey with us. Fill out the form below.
              </p>
              {/* Responsive stats */}
              <div className="mt-8 flex justify-center gap-4 md:gap-12 flex-wrap">
                <div className="text-center transition-transform duration-300 hover:scale-110 px-2">
                  <div className="text-2xl md:text-4xl font-bold">500+</div>
                  <div className="text-xs md:text-sm opacity-90">Students</div>
                </div>
                <div className="text-center transition-transform duration-300 hover:scale-110 px-2">
                  <div className="text-2xl md:text-4xl font-bold">15+</div>
                  <div className="text-xs md:text-sm opacity-90">Years Experience</div>
                </div>
                <div className="text-center transition-transform duration-300 hover:scale-110 px-2">
                  <div className="text-2xl md:text-4xl font-bold">98%</div>
                  <div className="text-xs md:text-sm opacity-90">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-12 md:py-16 relative group">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Responsive padding */}
          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10 border border-white/30">
            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16 border-t-4 border-l-4 border-orange-500 rounded-tl-3xl transition-all duration-300 group-hover:w-20 group-hover:h-20 md:group-hover:w-24 md:group-hover:h-24"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 md:w-16 md:h-16 border-b-4 border-r-4 border-green-500 rounded-br-3xl transition-all duration-300 group-hover:w-20 group-hover:h-20 md:group-hover:w-24 md:group-hover:h-24"></div>
            
            <div className="text-center mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-green-100 px-4 py-2 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-gray-700">Quick & Easy Registration</span>
              </div>
              {/* Responsive text */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent mb-3">
                Student Registration Form
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                Please provide your details to complete the registration.
              </p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2 text-orange-500" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 group-hover:border-orange-300 focus:shadow-lg"
                    placeholder="Enter your full name"
                    aria-required="true"
                    aria-invalid={!!errors.fullName}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span className="inline-block motion-safe:animate-bounce">⚠</span> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 mr-2 text-green-500" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 group-hover:border-green-300 focus:shadow-lg"
                    placeholder="Enter your email"
                    aria-required="true"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span className="inline-block motion-safe:animate-bounce">⚠</span> {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 mr-2 text-orange-500" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 group-hover:border-orange-300 focus:shadow-lg"
                    placeholder="Enter your 10-digit phone number"
                    aria-required="true"
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span className="inline-block motion-safe:animate-bounce">⚠</span> {errors.phone}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-green-500" />
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 group-hover:border-green-300 focus:shadow-lg"
                    aria-required="true"
                    aria-invalid={!!errors.dateOfBirth}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span className="inline-block motion-safe:animate-bounce">⚠</span> {errors.dateOfBirth}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="group">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 group-hover:border-orange-300 focus:shadow-lg"
                  placeholder="Enter your complete address"
                  aria-required="true"
                  aria-invalid={!!errors.address}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span className="inline-block motion-safe:animate-bounce">⚠</span> {errors.address}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Occupation */}
                <div className="group">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="w-4 h-4 mr-2 text-green-500" />
                    Occupation *
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 group-hover:border-green-300 focus:shadow-lg"
                    placeholder="Your current occupation"
                    aria-required="true"
                    aria-invalid={!!errors.occupation}
                  />
                  {errors.occupation && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span className="inline-block motion-safe:animate-bounce">⚠</span> {errors.occupation}
                    </p>
                  )}
                </div>

                {/* Course Type */}
                <div className="group">
                  <label htmlFor="courseType" className="text-sm font-medium text-gray-700 mb-2 block">
                    Course Type *
                  </label>
                  <select
                    id="courseType"
                    name="courseType"
                    value={formData.courseType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 group-hover:border-orange-300 focus:shadow-lg"
                    aria-required="true"
                    aria-invalid={!!errors.courseType}
                  >
                    <option value="">Select course type</option>
                    <option value="basic">Basic Hindi Speaking</option>
                    <option value="intermediate">Intermediate Hindi</option>
                    <option value="advanced">Advanced Hindi</option>
                    <option value="business">Business Hindi</option>
                  </select>
                  {errors.courseType && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span className="inline-block motion-safe:animate-bounce">⚠</span> {errors.courseType}
                    </p>
                  )}
                </div>
              </div>

              {/* Hindi Experience */}
              <div className="group">
                <label htmlFor="experience" className="text-sm font-medium text-gray-700 mb-2 block">
                  Previous Hindi Experience
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 group-hover:border-green-300 focus:shadow-lg"
                >
                  <option value="">Select your experience level</option>
                  <option value="none">No previous experience</option>
                  <option value="basic">Basic understanding</option>
                  <option value="intermediate">Can understand but can't speak</option>
                  <option value="advanced">Can speak but need improvement</option>
                </select>
              </div>

              {/* Learning Goals */}
              <div className="group">
                <label htmlFor="goals" className="text-sm font-medium text-gray-700 mb-2 block">
                  Learning Goals
                </label>
                <textarea
                  id="goals"
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 group-hover:border-green-300 focus:shadow-lg"
                  placeholder="What do you want to achieve? (e.g., business, travel)"
                />
              </div>

              {/* Preferred Time */}
              <div className="group">
                <label htmlFor="preferredTime" className="text-sm font-medium text-gray-700 mb-2 block">
                  Preferred Class Time
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 group-hover:border-orange-300 focus:shadow-lg"
                >
                  <option value="">Select preferred time</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (1 PM - 4 PM)</option>
                  <option value="evening">Evening (5 PM - 8 PM)</option>
                  <option value="weekend">Weekend Only</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <button
  type="submit"
  className="relative overflow-hidden w-auto group bg-gradient-to-r from-orange-500 via-amber-500 to-green-500 
             text-white px-5 md:px-7 py-2.5 md:py-3 rounded-full font-semibold text-sm md:text-base 
             shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 
             motion-safe:animate-pulse"
>
                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    Complete Registration
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
                <p className="text-xs sm:text-sm text-gray-500 mt-4">🔒 Your information is secure and confidential</p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer section */}
      <footer className="relative py-12 text-center text-gray-600">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Online Classes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Offline Classes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Hybrid Learning</span>
          </div>
        </div>
        </footer>
    </div>
  );
};

export default Signup;


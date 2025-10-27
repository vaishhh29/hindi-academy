import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle, Sparkles, Send } from 'lucide-react'; // Added Send icon
import * as THREE from 'three';

// Interface remains the same
interface AppointmentFormData {
  fullName: string;
  email: string;
  phone: string;
  appointmentType: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

const BookAppointment = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormData>({
    fullName: '',
    email: '',
    phone: '',
    appointmentType: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<AppointmentFormData>>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- 3D Background Effect (Functionality Unchanged) ---
  useEffect(() => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.position.z = 5;

    // Shapes
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
    const particlesCount = 80; // Increased particles
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10; // Wider spread
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.025, // Slightly smaller
      color: 0xffffff,
      transparent: true,
      opacity: 0.5 // Slightly more visible
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

    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Shape rotation (slightly slower)
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
        shape.position.y += Math.sin(time + i) * 0.0015; // Slightly more float
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (container) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      materials.forEach(m => m.dispose());
      geometries.forEach(g => g.dispose());
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  // --- Core Logic (Validation, Submit, Change) Unchanged ---
   const validate = () => {
    const newErrors: Partial<AppointmentFormData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/i.test(formData.email)) { // Slightly stricter email validation
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) { // Regex for exactly 10 digits
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.appointmentType) newErrors.appointmentType = 'Please select appointment type';
    if (!formData.preferredDate) newErrors.preferredDate = 'Please select a date';
    if (!formData.preferredTime) newErrors.preferredTime = 'Please select a time';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Appointment booked:', formData);
      setIsSubmitted(true);
      setFormData({
        fullName: '', email: '', phone: '', appointmentType: '',
        preferredDate: '', preferredTime: '', message: ''
      });
      setErrors({}); // Clear errors on successful submission
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof AppointmentFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // --- Framer Motion Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    },
  };

  const inputFocusVariants = {
    rest: { scale: 1, boxShadow: '0 0 0px rgba(0,0,0,0)' },
    focus: {
      scale: 1.01,
      boxShadow: '0 0 15px rgba(249, 115, 22, 0.3)', // Orange glow
      transition: { duration: 0.2 }
    }
  };


  // --- Enhanced Success Screen ---
  if (isSubmitted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-x-hidden bg-gradient-to-br from-green-50 to-orange-50 p-4">
        <canvas ref={canvasRef} className="absolute inset-0 -z-10" style={{ opacity: 0.20 }} />

        {/* Background blobs */}
        <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          className="relative bg-white/90 backdrop-blur-2xl p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-md mx-auto border border-green-200/50"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-green-500 rounded-full blur-lg opacity-50 motion-safe:animate-pulse"></div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="relative bg-gradient-to-r from-orange-500 to-green-500 rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </motion.div>
          </div>
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent mb-4"
          >
            Appointment Booked!
          </motion.h2>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-700 mb-6 text-base md:text-lg"
          >
            Your appointment is confirmed. We'll contact you shortly with details.
          </motion.p>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-orange-50 to-green-50 p-5 rounded-xl mb-6 border border-orange-200 shadow-inner"
          >
            <p className="text-sm text-orange-800">
              <strong>Contact:</strong> 6397255377<br />
              Expect a confirmation call within 24 hours.
            </p>
          </motion.div>
         <motion.button
  initial={{ y: 10, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.6 }}
  onClick={() => setIsSubmitted(false)}
  className="relative overflow-hidden group bg-gradient-to-r from-orange-500 to-green-500 text-white 
             px-4 md:px-6 py-2.5 md:py-3 rounded-full font-medium shadow-md hover:shadow-lg 
             transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
            <span className="relative z-10 text-sm md:text-base">Book Another Appointment</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // --- Enhanced Main Form ---
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-green-50">
      <canvas ref={canvasRef} className="absolute inset-0 -z-10" style={{ opacity: 0.18 }} /> {/* Adjusted opacity */}

      {/* Background blobs */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
         <div className="absolute top-20 left-20 w-72 h-72 md:w-96 md:h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
         <div className="absolute top-40 right-20 w-72 h-72 md:w-96 md:h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
         <div className="absolute bottom-20 left-1/3 w-72 h-72 md:w-96 md:h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

       {/* Floating sparkles */}
       <div className="absolute top-10 right-10 text-orange-400 opacity-10 md:opacity-30 motion-safe:animate-pulse -z-10" style={{ animationDuration: '3s' }}>
         <Sparkles className="w-6 h-6" />
       </div>
       <div className="absolute bottom-40 left-20 text-green-400 opacity-10 md:opacity-30 motion-safe:animate-pulse -z-10" style={{ animationDuration: '4s', animationDelay: '1s' }}>
         <Sparkles className="w-6 h-6" />
       </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-green-500 text-white py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 1px, transparent 1px)', // Subtler pattern
              backgroundSize: '40px 40px'
            }}
          ></div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="text-center">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full mb-6">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold text-sm">Book Your Slot</span>
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                Book an Appointment
              </motion.h1>
              <motion.p variants={itemVariants} className="text-lg md:text-xl max-w-3xl mx-auto drop-shadow">
                Schedule a consultation or demo class with our expert Hindi instructor.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Appointment Form Section */}
      <section className="py-12 md:py-16 relative">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="relative bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border border-orange-100/50" // Adjusted border
          >
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16 border-t-4 border-l-4 border-orange-500 rounded-tl-3xl transition-all duration-300"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 md:w-16 md:h-16 border-b-4 border-r-4 border-green-500 rounded-br-3xl transition-all duration-300"></div>

            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-green-100 px-4 py-2 rounded-full mb-4">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-gray-700">Quick Booking</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent mb-4">
                Schedule Your Appointment
              </h2>
              <p className="text-gray-600 text-base md:text-lg">
                Fill out the form below and we'll be in touch soon!
              </p>
            </div>

            {/* Form Fields with Motion */}
            <motion.form
              onSubmit={handleSubmit}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <motion.div variants={itemVariants} className="group relative">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2 text-orange-500" />
                    Full Name *
                  </label>
                  <motion.input
                    type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 group-hover:border-orange-300 focus:shadow-lg"
                    placeholder="Enter your full name"
                    aria-required="true" aria-invalid={!!errors.fullName}
                    variants={inputFocusVariants} whileFocus="focus" initial="rest"
                  />
                  <AnimatePresence>
                    {errors.fullName && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <span>⚠</span> {errors.fullName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Email */}
                 <motion.div variants={itemVariants} className="group relative">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 mr-2 text-green-500" />
                    Email Address *
                  </label>
                  <motion.input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 group-hover:border-green-300 focus:shadow-lg"
                    placeholder="Enter your email"
                    aria-required="true" aria-invalid={!!errors.email}
                    variants={inputFocusVariants} whileFocus="focus" initial="rest"
                  />
                   <AnimatePresence>
                    {errors.email && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <span>⚠</span> {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                 {/* Phone */}
                 <motion.div variants={itemVariants} className="group relative">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 mr-2 text-orange-500" />
                    Phone Number *
                  </label>
                  <motion.input
                    type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 group-hover:border-orange-300 focus:shadow-lg"
                    placeholder="Enter 10-digit number"
                    aria-required="true" aria-invalid={!!errors.phone}
                    variants={inputFocusVariants} whileFocus="focus" initial="rest"
                  />
                  <AnimatePresence>
                    {errors.phone && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <span>⚠</span> {errors.phone}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Appointment Type */}
                 <motion.div variants={itemVariants} className="group relative">
                  <label htmlFor="appointmentType" className="text-sm font-medium text-gray-700 mb-2 block">
                    Appointment Type *
                  </label>
                  <motion.select
                    id="appointmentType" name="appointmentType" value={formData.appointmentType} onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 group-hover:border-green-300 focus:shadow-lg appearance-none bg-white bg-no-repeat bg-right pr-8" // Added appearance-none for custom arrow styling if needed
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                    aria-required="true" aria-invalid={!!errors.appointmentType}
                    variants={inputFocusVariants} whileFocus="focus" initial="rest"
                  >
                    <option value="">Select appointment type</option>
                    <option value="demo-class">Free Demo Class</option>
                    <option value="consultation">Course Consultation</option>
                    <option value="assessment">Hindi Level Assessment</option>
                    <option value="enrollment">Course Enrollment</option>
                    <option value="manpower">Man Power Supply Discussion</option>
                  </motion.select>
                  <AnimatePresence>
                    {errors.appointmentType && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <span>⚠</span> {errors.appointmentType}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Preferred Date */}
                <motion.div variants={itemVariants} className="group relative">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                    Preferred Date *
                  </label>
                  <motion.input
                    type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 group-hover:border-orange-300 focus:shadow-lg"
                    aria-required="true" aria-invalid={!!errors.preferredDate}
                    variants={inputFocusVariants} whileFocus="focus" initial="rest"
                  />
                  <AnimatePresence>
                    {errors.preferredDate && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <span>⚠</span> {errors.preferredDate}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Preferred Time */}
                 <motion.div variants={itemVariants} className="group relative">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 mr-2 text-green-500" />
                    Preferred Time *
                  </label>
                  <motion.select
                    name="preferredTime" value={formData.preferredTime} onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 group-hover:border-green-300 focus:shadow-lg appearance-none bg-white bg-no-repeat bg-right pr-8"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                    aria-required="true" aria-invalid={!!errors.preferredTime}
                     variants={inputFocusVariants} whileFocus="focus" initial="rest"
                  >
                    <option value="">Select preferred time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="19:00">7:00 PM</option>
                  </motion.select>
                   <AnimatePresence>
                    {errors.preferredTime && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <span>⚠</span> {errors.preferredTime}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Message */}
              <motion.div variants={itemVariants} className="group relative">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 mr-2 text-orange-500" />
                  Additional Message (Optional)
                </label>
                <motion.textarea
                  name="message" value={formData.message} onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 group-hover:border-orange-300 focus:shadow-lg"
                  placeholder="Any specific questions or topics..."
                  variants={inputFocusVariants} whileFocus="focus" initial="rest"
                />
              </motion.div>

              {/* Submit Button - Adjusted Size */}
              <motion.div variants={itemVariants} className="text-center pt-6">
                <motion.button
                  type="submit"
                  className="relative overflow-hidden group bg-gradient-to-r from-orange-500 via-amber-500 to-green-500 text-white px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 rounded-full font-bold text-sm sm:text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 w-full sm:w-auto" // Adjusted padding and text size
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    Book Appointment
                    <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  {/* Enhanced hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150 blur-xl"></div>
                   <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.button>
                <p className="text-xs sm:text-sm text-gray-500 mt-4">🔒 Your information is secure</p>
              </motion.div>
            </motion.form>

            {/* Contact Info Box */}
            <motion.div
              variants={itemVariants}
              className="relative bg-gradient-to-r from-gray-50 to-green-50 p-6 rounded-2xl text-center border-2 border-green-200 mt-8 shadow-inner overflow-hidden" // Added overflow-hidden
            >
              <div className="absolute -top-4 -right-4 text-green-100 opacity-80 z-0">
                <Phone className="w-20 h-20" />
              </div>
              <p className="text-gray-700 mb-3 font-medium relative z-10">
                Need immediate assistance? Call or WhatsApp:
              </p>
              <motion.a
                href="tel:6397255377"
                className="text-3xl font-bold text-green-600 hover:text-green-700 relative z-10 inline-block transition-transform duration-300"
                whileHover={{ scale: 1.05, color: '#15803d' }} // Darker green on hover
                whileTap={{ scale: 0.98 }}
              >
                6397255377
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BookAppointment;


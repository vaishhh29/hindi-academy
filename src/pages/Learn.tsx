import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import {
 Play, Volume2, BookOpen, Users, Clock, Award, CheckCircle,
ArrowRight, Lock, Sparkles, Video, Star, ChevronRight, ChevronLeft,
  ArrowDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Learn = () => {
  const navigate = useNavigate();
 const [activeLesson, setActiveLesson] = useState(0);
 const mountRef = useRef(null);

  // --- Data (Unchanged) ---
  const lessons = [
    {
      title: "Basic Greetings",
      hindi: "नमस्ते",
      hindiTrans: "Namaste",
      tamil: "வணக்கம்",
      tamilTrans: "நமஸ்தே",
      english: "Hello",
      englishTrans: "Namaste",
      level: "Beginner"
    },
    {
      title: "How are you?",
      hindi: "आप कैसे हैं?",
      hindiTrans: "Aap kaise hain?",
      tamil: "நீங்கள் எப்படி இருக்கிறீர்கள்?",
      tamilTrans: "ஆப் கைஸே ஹைன்?",
      english: "How are you?",
      englishTrans: "Aap kaise hain?",
      level: "Beginner"
    },
    {
      title: "Thank you",
      hindi: "धन्यवाद",
      hindiTrans: "Dhanyavaad",
      tamil: "நன்றி",
      tamilTrans: "தன்யவாத்",
      english: "Thank you",
      englishTrans: "Dhanyavaad",
      level: "Beginner"
    },
    {
      title: "What is your name?",
      hindi: "आपका नाम क्या है?",
      hindiTrans: "Aapka naam kya hai?",
      tamil: "உங்கள் பெயர் என்ன?",
      tamilTrans: "ஆப்கா நாம் க்யா ஹை?",
      english: "What is your name?",
      englishTrans: "Aapka naam kya hai?",
      level: "Beginner"
    },
    {
      title: "I am fine",
      hindi: "मैं ठीक हूँ",
      hindiTrans: "Main theek hoon",
      tamil: "நான் நலமாக இருக்கிறேன்",
      tamilTrans: "மைன் தீக் ஹூன்",
      english: "I am fine",
      englishTrans: "Main theek hoon",
      level: "Beginner"
    },
    {
      title: "Where are you from?",
      hindi: "आप कहाँ से हैं?",
      hindiTrans: "Aap kahan se hain?",
      tamil: "நீங்கள் எங்கிருந்து வருகிறீர்கள்?",
      tamilTrans: "ஆப் கஹான் சே ஹைன்?",
      english: "Where are you from?",
      englishTrans: "Aap kahan se hain?",
      level: "Intermediate"
    },
    {
      title: "I don't understand",
      hindi: "मुझे समझ नहीं आया",
      hindiTrans: "Mujhe samajh nahi aaya",
      tamil: "எனக்கு புரியவில்லை",
      tamilTrans: "முஜ்ஹே சமஜ் நஹீ ஆயா",
      english: "I don't understand",
      englishTrans: "Mujhe samajh nahi aaya",
      level: "Intermediate"
    },
    {
      title: "Please speak slowly",
      hindi: "कृपया धीरे बोलिए",
      hindiTrans: "Kripaya dheere boliye",
      tamil: "தயவுசெய்து மெதுவாக பேசுங்கள்",
      tamilTrans: "க்ரிபயா தீரே போலியே",
      english: "Please speak slowly",
      englishTrans: "Kripaya dheere boliye",
      level: "Intermediate"
    },
    {
      title: "Advanced: Future Tense",
      hindi: "मैं कल जाऊँगा",
      hindiTrans: "Main kal jaunga",
      tamil: "நான் நாளை போவேன்",
      tamilTrans: "மைன் கல் ஜாஊங்கா",
      english: "I will go tomorrow",
      englishTrans: "Main kal jaunga",
      level: "Advanced",
      isPremium: true
    },
    {
      title: "Advanced: Complex Sentences",
      hindi: "मुझे उम्मीद है कि आप सीखेंगे",
      hindiTrans: "Mujhe ummeed hai ki aap seekhenge",
      tamil: "நீங்கள் கற்றுக்கொள்வீர்கள் என்று நம்புகிறேன்",
      tamilTrans: "முஜ்ஹே உம்மீத் ஹை கி ஆப் சீக்ஹேங்கே",
      english: "I hope you will learn",
      englishTrans: "Mujhe ummeed hai ki aap seekhenge",
      level: "Advanced",
      isPremium: true
    }
  ];

  const courseFeatures = [
    {
      icon: Users,
      title: "Interactive Classes",
      description: "Live sessions with experienced instructors"
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description: "Learn at your own pace, anytime"
    },
    {
      icon: BookOpen,
      title: "Practical Learning",
      description: "Real-world conversations and scenarios"
    },
    {
      icon: Award,
      title: "Certification",
      description: "Get certified upon completion"
    }
  ];

  // --- 3D Background Effect (Functionality Unchanged) ---
  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff6b35, 2);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4ade80, 2);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    const torusGeometry = new THREE.TorusGeometry(1.5, 0.3, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b35,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xff6b35,
      emissiveIntensity: 0.3,
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(-3, 2, 0);
    scene.add(torus);

    const icoGeometry = new THREE.IcosahedronGeometry(1, 0);
    const icoMaterial = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0x4ade80,
      emissiveIntensity: 0.2,
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    icosahedron.position.set(3, -2, 0);
    scene.add(icosahedron);

    const octaGeometry = new THREE.OctahedronGeometry(1.2, 0);
    const octaMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      metalness: 0.6,
      roughness: 0.4,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.2,
    });
    const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
    octahedron.position.set(0, 3, -2);
    scene.add(octahedron);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 800;
    const posArray = new Float32Array(particlesCnt * 3);
    for (let i = 0; i < particlesCnt * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.005;
      icosahedron.rotation.x += 0.005;
      icosahedron.rotation.y += 0.01;
      octahedron.rotation.x += 0.008;
      octahedron.rotation.z += 0.005;
      particlesMesh.rotation.y += 0.0005;
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      const time = Date.now() * 0.001;
      pointLight1.position.x = Math.sin(time) * 5;
      pointLight1.position.z = Math.cos(time) * 5;
      pointLight2.position.x = Math.cos(time) * 5;
      pointLight2.position.z = Math.sin(time) * 5;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      // Dispose materials and geometries
      torusMaterial.dispose();
      torusGeometry.dispose();
      icoMaterial.dispose();
      icoGeometry.dispose();
      octaMaterial.dispose();
      octaGeometry.dispose();
      particlesMaterial.dispose();
      particlesGeometry.dispose();
    };
  }, []);

  // --- Core Functions (Functionality Unchanged) ---
  const playAudio = (text: string, lang: string) => {
    // Check if SpeechSynthesis is available
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech Synthesis not supported in this browser.");
      // You could show a small error message to the user here
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const nextLesson = () => {
    setActiveLesson((prev) => (prev + 1) % lessons.length);
  };

  const prevLesson = () => {
    setActiveLesson((prev) => (prev - 1 + lessons.length) % lessons.length);
  };

  // --- Enhanced UI & Animations ---
  return (
    <div className="min-h-screen bg-gray-900 font-sans overflow-x-hidden">
      
      {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div ref={mountRef} className="absolute inset-0 w-full h-full" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Master{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-green-500">
                Hindi
              </span>
              {' '}Today
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Interactive 3D learning experience with audio lessons and clear translations
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
             <motion.button 
    onClick={() => navigate('/courses')}
    className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
  >
    Start Learning <ArrowRight className="w-5 h-5" />
  </motion.button> 
              <motion.button 
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Features
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
        {/* Scroll Down Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: [0, 10, 20] }}
          transition={{ duration: 2, repeat: Infinity, delay: 2 }}
        >
          <ArrowDown className="w-6 h-6 text-white/50" />
        </motion.div>
      </section>
      {/* --- Learning Journey Section --- */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              Your Learning Journey
            </h2>
            <p className="text-lg sm:text-xl text-gray-300">
              Progress from basics to fluency with structured lessons
            </p>
          </motion.div>
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Curriculum List */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-gray-700 lg:sticky lg:top-24">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-orange-500" />
                  Curriculum
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {lessons.map((lesson, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveLesson(index)}
                      className={`relative w-full text-left p-3 rounded-xl transition-all border ${
                        activeLesson === index
                          ? 'text-white border-orange-400/50'
                          : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 border-gray-600'
                      }`}
                    >
                      {/* Sliding background for active item */}
                      {activeLesson === index && (
                        <motion.div
                          layoutId="activeLessonBg"
                          className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl z-0"
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        />
                      )}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{lesson.title}</span>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          {lesson.isPremium && (
                            <Star className="w-3 h-3 text-yellow-400" />
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(lesson.level)} text-white`}>
                            {lesson.level.charAt(0)}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLesson}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gray-800/50 backdrop-blur-xl p-6 sm:p-8 md:p-12 rounded-3xl border border-gray-700"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 sm:mb-0">
                      {lessons[activeLesson].title}
                    </h3>
                    <span className={`px-4 py-2 rounded-full text-white font-semibold ${getLevelColor(lessons[activeLesson].level)} flex-shrink-0`}>
                      {lessons[activeLesson].level}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div 
                      className="p-6 rounded-2xl border border-orange-500/40 bg-gradient-to-br from-orange-500/20 to-red-500/20"
                      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)' }}
                    >
                      <h4 className="text-sm font-bold text-orange-300 mb-3 uppercase tracking-wider">
                        हिन्दी (Hindi)
                      </h4>
                      <p className="text-3xl sm:text-4xl font-black text-white mb-2 text-center min-h-[50px]">
                        {lessons[activeLesson].hindi}
                      </p>
                      <p className="text-lg text-orange-200 font-semibold text-center mb-4">
                        ({lessons[activeLesson].hindiTrans})
                      </p>
                      <motion.button
                        onClick={() => playAudio(lessons[activeLesson].hindi, 'hi-IN')}
                        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-all text-sm font-semibold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Volume2 className="w-4 h-4" />
                        Listen
                      </motion.button>
                    </motion.div>
                    {/* Tamil Card (Audio Button Removed) */}
                    <motion.div 
                      className="p-6 rounded-2xl border border-green-500/40 bg-gradient-to-br from-green-500/20 to-emerald-500/20"
                      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)' }}
                    >
                      <h4 className="text-sm font-bold text-green-300 mb-3 uppercase tracking-wider">
                        தமிழ் (Tamil)
                      </h4>
                      <p className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center min-h-[50px]">
                        {lessons[activeLesson].tamil}
                      </p>
                      <p className="text-lg text-green-200 font-semibold text-center mb-4">
                        ({lessons[activeLesson].tamilTrans})
                      </p>
                      {/* Removed audio button for Tamil */}
                    </motion.div>
                    {/* English Card (Audio Button Removed) */}
                    <motion.div 
                      className="p-6 rounded-2xl border border-blue-500/40 bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)' }}
                    >
                      <h4 className="text-sm font-bold text-blue-300 mb-3 uppercase tracking-wider">
                        English
                      </h4>
                      <p className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center min-h-[50px]">
                        {lessons[activeLesson].english}
                      </p>
                      <p className="text-lg text-blue-200 font-semibold text-center mb-4">
                        ({lessons[activeLesson].englishTrans})
                      </p>
                      {/* Removed audio button for English */}
                    </motion.div>
                  </div>
                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8">
                    <motion.button
                      onClick={prevLesson}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 sm:px-6 py-3 rounded-full font-semibold transition-all text-sm sm:text-base"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Previous
                    </motion.button>
                    
                    <div className="text-gray-400 font-semibold text-sm sm:text-base">
                      {activeLesson + 1} / {lessons.length}
                    </div>                   
                    <motion.button
                      onClick={nextLesson}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 sm:px-6 py-3 rounded-full font-semibold transition-all text-sm sm:text-base"
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
      {/* --- "Why Choose Us?" Section --- */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose Our Course?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300">
              Built on proven learning principles
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {courseFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.5 }}
                whileHover={{ y: -8, boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)' }}
                className="group bg-gray-700/50 hover:bg-gray-700 backdrop-blur-xl p-8 rounded-2xl border border-gray-600 text-center transition-all duration-300"
              >
                <motion.div 
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center mx-auto mb-6 transition-all duration-300 shadow-lg group-hover:shadow-orange-500/30"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* --- CTA Section --- */}
      <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center"
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-4xl mx-auto">
              Join thousands of learners and gain lifetime access to all lessons
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <motion.button 
    onClick={() => navigate('/courses')}
    className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
  >
    Start Learning Today<ArrowRight className="w-5 h-5" />
  </motion.button>
              <motion.button 
                className="flex items-center justify-center gap-3 border-2 border-white text-white px-8 sm:px-10 py-4 rounded-full font-extrabold text-lg hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105"
                whileHover={{ scale: 1.05, gap: '1rem' }}
                whileTap={{ scale: 0.95 }}
              >
                Book a Free Demo <BookOpen className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Learn;
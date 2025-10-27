import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion';
import { 
  Star, 
  Users, 
  BookOpen, 
  Award, 
  Phone, 
  MapPin, 
  Clock,
  Quote,
  ArrowRight,
  Play,
  Sparkles,
  Heart,
  TrendingUp,
  Layers,
  Zap,
  Globe,
  MessageCircle,
  Bookmark,
  Shield,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link for routing

const LucideIcons = {
  Star, Users, BookOpen, Award, Phone, MapPin, Clock, Quote, 
  ArrowRight, Play, Sparkles, Heart, TrendingUp, Layers, Zap,
  Globe, MessageCircle, Bookmark, Shield, Target
};

const OptimizedIcon = React.memo(({ icon: Icon, ...props }) => <Icon {...props} />);

// New 3D Components (Preserved)
const FloatingHindiText = React.memo(() => (
  <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
    {['नमस्ते', 'धन्यवाद', 'कैसे हो', 'शुक्रिया', 'स्वागत'].map((text, i) => (
      <motion.div
        key={text}
        className="absolute text-2xl font-bold opacity-5 text-white"
        style={{
          left: `${10 + i * 18}%`,
          top: `${20 + i * 15}%`,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 180],
          z: [0, 200, -100, 200, 0],
          opacity: [0.05, 0.15, 0.05],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 20 + i * 3,
          repeat: Infinity,
          delay: i * 2,
          ease: "easeInOut"
        }}
      >
        {text}
      </motion.div>
    ))}
  </div>
));

const NeuralNetwork3D = React.memo(() => (
  <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={`neuron-${i}`}
        className="absolute w-2 h-2 bg-cyan-400 rounded-full"
        style={{
          left: `${15 + (i * 10) % 80}%`,
          top: `${10 + (i * 12) % 70}%`,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: [0, 180, 360],
          rotateY: [0, 360],
          scale: [1, 1.5, 1],
          z: [0, 150, -50, 150, 0],
        }}
        transition={{
          duration: 8 + i * 1.5,
          repeat: Infinity,
          delay: i * 0.5,
          ease: "easeInOut"
        }}
      />
    ))}
    
    {/* Connection lines */}
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={`connection-${i}`}
        className="absolute h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"
        style={{
          left: `${10 + (i * 7) % 70}%`,
          top: `${15 + (i * 8) % 65}%`,
          width: `${20 + (i * 5) % 40}%`,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateZ: [0, 180, 360],
          opacity: [0.3, 0.8, 0.3],
          scaleX: [1, 1.2, 1],
          z: [0, 100, 0],
        }}
        transition={{
          duration: 6 + i,
          repeat: Infinity,
          delay: i * 0.3,
          ease: "linear"
        }}
      />
    ))}
  </div>
));

const ParticleField3D = React.memo(() => (
  <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={`particle-${i}`}
        className="absolute w-1 h-1 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full"
        style={{
          left: `${5 + (i * 5) % 90}%`,
          top: `${8 + (i * 4) % 85}%`,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 60, 0],
          z: [0, 200, -100, 300, 0],
          rotateX: [0, 360],
          rotateY: [0, 180],
          scale: [1, 2, 0.5, 1.5, 1],
          opacity: [0.3, 0.8, 0.2, 0.9, 0.3],
        }}
        transition={{
          duration: 15 + i * 2,
          repeat: Infinity,
          delay: i * 0.7,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
));

const HolographicCards = React.memo(() => (
  <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={`hologram-${i}`}
        className="absolute w-16 h-20 border-2 border-cyan-300 rounded-lg"
        style={{
          left: `${8 + (i * 15) % 80}%`,
          top: `${12 + (i * 13) % 75}%`,
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(6, 182, 212, 0.05))',
        }}
        animate={{
          rotateX: [0, 45, 0],
          rotateY: [0, 90, 180, 270, 360],
          rotateZ: [0, 15, -15, 0],
          z: [0, 180, -90, 180, 0],
          scale: [1, 1.1, 0.9, 1],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 12 + i * 3,
          repeat: Infinity,
          delay: i * 1.5,
          ease: "easeInOut"
        }}
      >
        <div className="absolute inset-1 border border-cyan-200 rounded-md opacity-50" />
        <div className="absolute inset-2 border border-cyan-100 rounded-sm opacity-30" />
      </motion.div>
    ))}
  </div>
));

const VortexTunnel = React.memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={`vortex-${i}`}
        className="absolute border-2 border-green-300 rounded-full"
        style={{
          left: '50%',
          top: '50%',
          width: `${i * 60}px`,
          height: `${i * 60}px`,
          marginLeft: `-${i * 30}px`,
          marginTop: `-${i * 30}px`,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: [0, 180, 360],
          rotateY: [0, 270, 360],
          rotateZ: [0, 360],
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.4, 0.1],
          z: [0, 100, -50, 100, 0],
        }}
        transition={{
          duration: 8 + i * 0.5,
          repeat: Infinity,
          delay: i * 0.2,
          ease: "linear"
        }}
      />
    ))}
  </div>
));

const CrystalCluster = React.memo(() => (
  <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={`crystal-${i}`}
        className="absolute w-0 h-0"
        style={{
          left: `${12 + (i * 11) % 80}%`,
          top: `${18 + (i * 9) % 70}%`,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 180, 360],
          rotateZ: [0, 45, 90, 135, 180],
          z: [0, 120, -60, 120, 0],
          scale: [1, 1.3, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 10 + i * 2,
          repeat: Infinity,
          delay: i * 0.8,
          ease: "easeInOut"
        }}
      >
        {/* Crystal shape */}
        <div className="absolute w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-purple-400 opacity-60" 
             style={{ transform: 'translateZ(6px)' }} />
        <div className="absolute w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-purple-500 opacity-80" 
             style={{ transform: 'translateZ(3px) rotate(120deg)' }} />
        <div className="absolute w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-purple-600" 
             style={{ transform: 'translateZ(0px) rotate(240deg)' }} />
      </motion.div>
    ))}
  </div>
));

const Home = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const areFeaturesInView = useInView(featuresRef, { once: true, margin: "-50px" });
  
  const { scrollY, scrollYProgress } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const quotes = useMemo(() => [
    "Hindi is not an enemy language - it's a bridge to opportunities across India",
    "Learning Hindi opens doors to business success in the largest market",
    "Hindi connects hearts and creates business relationships",
    "Master Hindi, Master the Indian market - your gateway to success"
  ], []);

  const features = useMemo(() => [
    {
      icon: Users,
      title: "Expert Teaching",
      description: "Learn from J. Surendar, an experienced Hindi instructor with years of expertise...",
      color: "from-blue-400 to-blue-600",
      emoji: "👨‍🏫",
      depth: 100
    },
    {
      icon: BookOpen,
      title: "Spoken Focus",
      description: "Our unique methodology emphasizes practical conversation skills over rote memorization...",
      color: "from-green-400 to-green-600",
      emoji: "🗣️",
      depth: 150
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "Join 61+ satisfied students who have transformed their Hindi speaking abilities...",
      color: "from-yellow-400 to-yellow-600",
      emoji: "🏆",
      depth: 120
    },
    {
      icon: Clock,
      title: "Flexible Timing",
      description: "Classes designed to fit your busy schedule. Available until 8:30 PM with options...",
      color: "from-purple-400 to-purple-600",
      emoji: "⏰",
      depth: 180
    }
  ], []);

  const updateMouse = useCallback((e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    mouseX.set(x * 30);
    mouseY.set(y * 30);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      window.addEventListener('mousemove', updateMouse, { passive: true });
      return () => window.removeEventListener('mousemove', updateMouse);
    }
  }, [updateMouse, isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const cube3DVariants = useMemo(() => ({
    animate: {
      rotateX: [0, 360],
      rotateY: [0, 180],
      rotateZ: [0, 90],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }), []);

  const floating3D = useMemo(() => ({
    animate: {
      y: [0, -30, 0],
      rotateX: [0, 15, 0],
      rotateY: [0, 25, 0],
      rotateZ: [0, 10, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }), []);

  const morphing3D = useMemo(() => ({
    animate: {
      rotateX: [0, 90, 180, 270, 360],
      rotateY: [0, 180, 360],
      scale: [1, 1.2, 0.8, 1.1, 1],
      borderRadius: ["10px", "50px", "10px"],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }), []);

  const GeometricElements = useMemo(() => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ perspective: '2000px' }}>
      <FloatingHindiText />
      <NeuralNetwork3D />
      <ParticleField3D />
      <HolographicCards />
      <VortexTunnel />
      <CrystalCluster />
      
      {/* Enhanced Cubes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`cube-${i}`}
          className="absolute"
          style={{
            left: `${10 + i * 16}%`,
            top: `${15 + (i * 18) % 65}%`,
            transformStyle: 'preserve-3d',
          }}
          variants={cube3DVariants}
          animate="animate"
          transition={{ delay: i * 0.5 }}
        >
          <div className="relative w-8 h-8" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute w-8 h-8 bg-orange-400 opacity-50" style={{ transform: 'translateZ(4px)' }} />
            <div className="absolute w-8 h-8 bg-red-400 opacity-50" style={{ transform: 'translateZ(-4px) rotateY(180deg)' }} />
            <div className="absolute w-8 h-8 bg-green-400 opacity-50" style={{ transform: 'rotateY(90deg) translateZ(4px)' }} />
            <div className="absolute w-8 h-8 bg-blue-400 opacity-50" style={{ transform: 'rotateY(-90deg) translateZ(4px)' }} />
            <div className="absolute w-8 h-8 bg-purple-400 opacity-50" style={{ transform: 'rotateX(90deg) translateZ(4px)' }} />
            <div className="absolute w-8 h-8 bg-yellow-400 opacity-50" style={{ transform: 'rotateX(-90deg) translateZ(4px)' }} />
          </div>
        </motion.div>
      ))}

      {/* DNA Helix */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`dna-${i}`}
          className="absolute flex space-x-1"
          style={{
            left: `${20 + (i * 6) % 60}%`,
            top: `${25 + (i * 7) % 60}%`,
            transformStyle: 'preserve-3d',
          }}
          animate={{
            rotateY: [0, 360],
            rotateZ: [0, 180, 360],
            z: [0, 100, -50, 100, 0],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "linear"
          }}
        >
          <div className="w-1 h-4 bg-pink-400 rounded-full" style={{ transform: 'translateZ(10px)' }} />
          <div className="w-1 h-4 bg-cyan-400 rounded-full" style={{ transform: 'translateZ(-10px)' }} />
        </motion.div>
      ))}
    </div>
  ), [cube3DVariants]);

  const Cursor3D = useMemo(() => (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-50"
      style={{
        x: smoothMouseX,
        y: smoothMouseY,
        rotateX: smoothMouseY,
        rotateY: smoothMouseX,
      }}
      animate={{
        scale: isHovered ? 2 : 1,
        rotateZ: [0, 360],
      }}
      transition={{
        rotateZ: { duration: 2, repeat: Infinity, ease: "linear" }
      }}
    >
      <div className="w-full h-full bg-gradient-to-r from-orange-400 to-pink-500 rounded-full shadow-lg" 
           style={{ transform: 'translateZ(50px)' }} />
      <div className="absolute inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full" 
           style={{ transform: 'translateZ(25px)' }} />
    </motion.div>
  ), [smoothMouseX, smoothMouseY, isHovered]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-600 via-red-500 to-green-600">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden relative" style={{ perspective: '1000px' }}>
      {Cursor3D}
      {GeometricElements}

      {/* Enhanced Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative bg-gradient-to-r from-orange-600 via-red-500 to-green-600 text-white py-20 overflow-hidden"
        style={{ 
          scale: heroScale,
          perspective: '1500px',
          transformStyle: 'preserve-3d'
        }}
      >
        <motion.div 
          className="absolute inset-0 bg-black opacity-20"
          style={{ 
            y: heroY, 
            opacity: heroOpacity,
            transformStyle: 'preserve-3d'
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ transformStyle: 'preserve-3d' }}>
          <motion.div
            className="text-center"
            style={{
              rotateX: smoothMouseY,
              rotateY: smoothMouseX,
              transformStyle: 'preserve-3d',
            }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              variants={floating3D}
              animate="animate"
              whileHover={{ 
                scale: 1.1,
                rotateY: 15,
                rotateX: 10,
                z: 100,
                transition: { type: "spring", stiffness: 300 }
              }}
              style={{
                transformStyle: 'preserve-3d',
                textShadow: '0 0 20px rgba(255,255,255,0.5), 10px 10px 30px rgba(0,0,0,0.3)',
              }}
            >
              राणुवा वीरन
            </motion.h1>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-semibold mb-4"
              animate={{
                rotateX: [0, 5, -5, 0],
                z: [0, 50, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
              }}
              style={{
                transformStyle: 'preserve-3d',
                textShadow: '5px 5px 15px rgba(0,0,0,0.3)',
              }}
            >
              Spoken Hindi Academy
            </motion.h2>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Join Now Button -> /signup */}
              <Link to="/signup" className="group">
                <motion.button
                  className="bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center justify-center relative overflow-hidden w-full sm:w-auto"
                  whileHover={{ 
                    scale: 1.1,
                    rotateY: 15,
                    rotateX: 10,
                    z: 50,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <span className="relative z-10">
                    Join Now
                  </span>
                  <OptimizedIcon icon={ArrowRight} className="ml-2 w-5 h-5 relative z-10" />
                </motion.button>
              </Link>
              
              {/* Book Demo Class Button -> /book-appointment */}
              <Link to="/book-appointment" className="group">
                <motion.button
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center justify-center hover:bg-white hover:text-orange-600 w-full sm:w-auto"
                  whileHover={{ 
                    scale: 1.1,
                    rotateY: -15,
                    rotateX: 10,
                    z: 50,
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  Book Demo Class 
                  <OptimizedIcon icon={Play} className="ml-2 w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* 3D Sparkle Effects */}
        <motion.div
          className="absolute top-20 left-10 text-6xl"
          animate={{
            rotateY: 360,
            z: [0, 100, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          <OptimizedIcon icon={Sparkles} className="text-yellow-300 opacity-60" />
        </motion.div>
      </motion.section>

      
        <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Why Learn Hindi?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {quotes.map((quote, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-gradient-to-r from-orange-50 to-green-50 p-6 rounded-lg shadow-md"
                >
                  <Quote className="w-8 h-8 text-orange-500 mb-4" />
                  <p className="text-lg text-gray-700 italic">{quote}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


      {/* Enhanced Features Section */}
       <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the best Hindi learning methodology with proven results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-green-500 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center">
            <motion.h2 className="text-4xl font-bold mb-8">
              Get Started Today!
            </motion.h2>
            
            <motion.p className="text-xl mb-8">
              Founder: <span className="font-bold">J. SURENDAR</span>
            </motion.p>
            
            <Link to="/signup" className="group">
              <motion.button
                className="bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg transition-all inline-flex items-center group relative overflow-hidden"
                whileHover={{ 
                  scale: 1.1,
                  rotateY: 15,
                  z: 50,
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <span className="relative z-10">
                  Start Your Hindi Journey
                </span>
                <OptimizedIcon icon={ArrowRight} className="ml-2 w-5 h-5 relative z-10" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(Home);
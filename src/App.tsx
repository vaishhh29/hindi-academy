import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Learn from './pages/Learn';
import Signup from './pages/Signup';
import BookAppointment from './pages/BookAppointment';
import AdminPanel from './pages/AdminPanel';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import ScrollToTop from './Scroll';

function App() {
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    // Play "Jai Hind" audio when website loads
    if (!audioPlayed) {
      const audio = new Audio('/jaihind.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio autoplay blocked'));
      setAudioPlayed(true);
    }
  }, [audioPlayed]);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </motion.main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </Router>
  );
}

export default App;
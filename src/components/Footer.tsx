import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Youtube,
  GraduationCap
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Raanuva Veeran</h3>
                <p className="text-gray-300">Spoken Hindi Academy</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering Tamil speakers with fluent Hindi communication skills. 
              We believe Hindi is not an enemy language but a bridge to opportunities 
              across India's diverse business landscape.
            </p>
            <div className="text-center md:text-left">
              <p className="text-lg font-semibold text-orange-400 mb-2">
                Founder: J. SURENDAR
              </p>
              <p className="text-gray-300">
                Expert Hindi Instructor & Man Power Supply Specialist
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-orange-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/learn" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Learn Hindi
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/book-appointment" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  22, Sri Angalamman Illam,<br />
                  Krishnasamy Street,<br />
                  near Zeon Cinema, Vandipettai,<br />
                  Gobichettipalayam, Tamil Nadu 638476
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-400" />
                <a 
                  href="tel:6397255377" 
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  6397255377
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300 text-sm">Open until 8:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-orange-400">
                Spoken Hindi Academy
              </h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Conversational Hindi Classes</li>
                <li>• Business Hindi Communication</li>
                <li>• Pronunciation & Accent Training</li>
                <li>• Interactive Speaking Sessions</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">
                Man Power Supply
              </h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Skilled Workforce Placement</li>
                <li>• Hindi-Speaking Professionals</li>
                <li>• Corporate Training Programs</li>
                <li>• Career Guidance & Support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2024 Raanuva Veeran Spoken Hindi Academy. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Designed with ❤️ for Hindi learners
              </p>
            </div>
          </div>
        </div>

        {/* Google Maps Rating */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <div className="bg-gray-800 rounded-lg p-6 inline-block">
            <h4 className="text-lg font-semibold mb-2 text-yellow-400">
              ⭐ Google Maps Rating
            </h4>
            <p className="text-2xl font-bold text-white mb-2">5.0 / 5.0</p>
            <p className="text-gray-300 text-sm">Based on 61 reviews</p>
            <a
              href="https://www.google.com/maps/place/Raanuva+Veeran+Spoken+Hindi+Academy/@11.4538472,77.433794,21z/data=!4m14!1m7!3m6!1s0x3ba93de5614edda3:0x3f1d16aaa96d8e08!2sRaanuva+Veeran+Spoken+Hindi+Academy!8m2!3d11.4538577!4d77.4338436!16s%2Fg%2F11vk53m6gq!3m5!1s0x3ba93de5614edda3:0x3f1d16aaa96d8e08!8m2!3d11.4538577!4d77.4338436!16s%2Fg%2F11vk53m6gq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm underline mt-2 inline-block"
            >
              View on Google Maps
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
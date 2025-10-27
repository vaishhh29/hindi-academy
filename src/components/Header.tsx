import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  BookOpen,
  Users,
  Home,
  Info,
  GraduationCap,
} from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About", icon: Info },
    { path: "/learn", label: "Learn", icon: GraduationCap },
    { path: "/signup", label: "Sign Up", icon: Users },
    { path: "/book-appointment", label: "Book Appointment", icon: BookOpen },
  ];

  // Variant for the 3D 'lift' effect on desktop links
  const linkHoverVariants = {
    initial: { y: 0, scale: 1, boxShadow: "0 0px 0px rgba(0, 0, 0, 0)" },
    hover: {
      y: -2,
      scale: 1.02,
      rotateX: 2,
      boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.2 },
    },
    tap: {
      y: 0,
      scale: 0.98,
      rotateX: 0,
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 15 }}
      className="bg-white shadow-xl border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo with 3D Pop-Out Effect */}
          <Link to="/" className="flex items-center space-x-4 group">
            {" "}
            {/* Increased spacing */}
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              whileHover={{
                rotate: [0, 8, -8, 0],
                scale: 1.2,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
              whileTap={{ scale: 0.95, rotate: 0 }}
            >
              <GraduationCap className="w-7 h-7 text-white drop-shadow-lg" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="transform perspective-1000"
            >
              <h1 className="text-xl font-extrabold text-gray-800 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.3)] group-hover:text-orange-600 transition-colors duration-300">
                Raanuva Veeran
              </h1>
              <p className="text-sm font-medium text-gray-600 drop-shadow-[1px_1px_1px_rgba(0,0,0,0.2)]">
                Spoken Hindi Academy
              </p>
            </motion.div>
          </Link>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-4 lg:space-x-6">
              {" "}
              {navItems.map(({ path, label, icon: Icon }, idx) => {
                const isActive = location.pathname === path;
                return (
                  <motion.div
                    key={path}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    variants={linkHoverVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="relative"
                  >
                    <Link
                      to={path}
                      className={`relative flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? "text-orange-600 font-semibold bg-orange-50 shadow-md"
                          : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>

                      {isActive && (
                        <motion.div
                          layoutId="underline"
                          className="absolute left-0 bottom-0 h-0.5 w-full bg-orange-500 rounded"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 250,
                            damping: 20,
                          }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
            <motion.a
              href="https://wa.me/916397255377"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center space-x-2 text-white bg-gradient-to-r from-green-600 to-green-500 px-5 py-2.5 rounded-full font-bold shadow-2xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              whileHover={{
                scale: 1.15,
                boxShadow: "0 0 25px rgba(34, 197, 94, 0.7)",
              }}
              whileTap={{
                scale: 0.95,
                boxShadow: "0 3px 6px rgba(34, 197, 94, 0.3)",
              }}
            >
              <Phone className="w-5 h-5 text-white drop-shadow-md" />
              <span>Contact Us</span>{" "}
            </motion.a>
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-3 rounded-full text-gray-700 hover:text-orange-600 bg-gray-50 shadow-lg"
              whileTap={{
                scale: 0.9,
                rotate: 180,
             boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
              whileHover={{
                scale: 1.1,
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.15)",
              }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>{" "}
      </div>
        <AnimatePresence>
          {isOpen && (
         <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
             className="md:hidden py-4 border-t"
            >
              {navItems.map(({ path, label, icon: Icon }, idx) => (
                <motion.div
                  key={path}
                initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="mb-2"
                >
                  <Link
                    to={path}
                    onClick={() => setIsOpen(false)}
                   className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 shadow-sm ${
                      location.pathname === path
                        ? "text-orange-600 bg-orange-100 font-bold shadow-md"
                        : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                   }`}
                  >
                    <Icon className="w-5 h-5" />
                   <span>{label}</span>
                  </Link>
                </motion.div>
              ))}
              <motion.a
                href="https://wa.me/916397255377"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 px-4 py-3 mt-4 text-white bg-green-600 rounded-lg shadow-xl hover:bg-green-700"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ delay: navItems.length * 0.08 }}
              >
                <Phone className="w-5 h-5" />
              <span className="font-semibold">
                 Contact Us
                </span>
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
    </motion.header>
  );
};
export default Header;


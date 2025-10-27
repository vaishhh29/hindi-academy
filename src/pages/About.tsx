import React from 'react';
import { motion } from 'framer-motion';
import {
	User,
	Award,
	Target,
	Heart,
	MapPin,
	Phone,
	Users,
	BookOpen,
	Star
} from 'lucide-react';

// Color maps to ensure Tailwind CSS includes these classes in production
const statColorMap = {
	orange: { bg: 'bg-orange-50', text: 'text-orange-500' },
	green: { bg: 'bg-green-50', text: 'text-green-500' },
	blue: { bg: 'bg-blue-50', text: 'text-blue-500' },
	purple: { bg: 'bg-purple-50', text: 'text-purple-500' },
};

const itemColorMap = {
	orange: { bg: 'bg-orange-100', text: 'text-orange-500' },
	green: { bg: 'bg-green-100', text: 'text-green-500' },
};

const About = () => {

	return (
		// FIX: Changed 'py-12' to 'pb-12' to remove top space while keeping bottom padding
		<div className="min-h-screen pb-12 overflow-hidden bg-white">
			{/* 3D Hero Section */}
			<section className="relative bg-gradient-to-br from-orange-500 via-red-500 to-green-500 text-white pt-20 pb-20 overflow-hidden">
				{/* Animated background elements */}
				<div className="absolute inset-0 opacity-20">
					{[...Array(50)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute w-2 h-2 bg-white rounded-full"
							initial={{
								x: `${Math.random() * 100}vw`,
								y: `${Math.random() * 100}vh`,
							}}
							animate={{
								x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
								y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
								scale: [0, 1.5, 0],
								opacity: [0, 1, 0]
							}}
							transition={{
								duration: 3 + Math.random() * 3,
								repeat: Infinity,
								delay: Math.random() * 3
							}}
						/>
					))}
				</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
					<motion.div
						initial={{ opacity: 0, y: 50, rotateX: -15 }}
						animate={{ opacity: 1, y: 0, rotateX: 0 }}
						transition={{ duration: 1.2, ease: "easeOut" }}
						className="text-center"
						style={{ perspective: '1000px' }}
					>
						<motion.h1
							// RESPONSIVE FONT
							className="text-5xl sm:text-6xl font-bold mb-6"
							animate={{
								textShadow: [
									'0 0 20px rgba(255,255,255,0.5)',
									'0 0 40px rgba(255,255,255,0.8)',
									'0 0 20px rgba(255,255,255,0.5)'
								]
							}}
							transition={{ duration: 2, repeat: Infinity }}
						>
							About Us
						</motion.h1>
						<motion.p
							// RESPONSIVE FONT
							className="text-lg sm:text-xl max-w-3xl mx-auto"
							initial={{ opacity: 0, z: -50 }}
							animate={{ opacity: 1, z: 0 }}
							transition={{ delay: 0.5, duration: 1 }}
							style={{ transform: 'translateZ(20px)' }}
						>
							Empowering individuals through Hindi language mastery and connecting them to endless opportunities
						</motion.p>
					</motion.div>
				</div>

				{/* 3D Floating geometric shapes */}
				{/* RESPONSIVE POSITIONING */}
				<div className="absolute top-10 right-4 sm:top-20 sm:right-20">
					<motion.div
						animate={{
							rotateX: [0, 360],
							rotateY: [0, 360],
							scale: [1, 1.2, 1]
						}}
						transition={{
							duration: 20,
							repeat: Infinity,
							ease: "linear"
						}}
						// RESPONSIVE SIZING
						className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-white/30"
						style={{
							transformStyle: 'preserve-3d',
							filter: 'blur(0.5px)'
						}}
					/>
				</div>

				{/* RESPONSIVE POSITIONING */}
				<div className="absolute bottom-5 left-10 hidden md:block">
					<motion.div
						animate={{
							rotateZ: [0, -360],
							y: [0, -20, 0],
						}}
						transition={{
							duration: 25,
							repeat: Infinity,
							ease: "linear"
						}}
						className="w-16 h-16 bg-white/10 rounded-full"
						style={{
							transformStyle: 'preserve-3d',
							backdropFilter: 'blur(2px)'
						}}
					/>
				</div>
			</section>

			{/* Enhanced Founder Section with 3D Cards */}
			<section className="py-16 sm:py-20 bg-gray-50 relative">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						// This parent div fades in the whole section
						initial={{ opacity: 0, y: 100 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 1, ease: "easeOut" }}
						className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
					>
						<div>
							<motion.h2
								// RESPONSIVE FONT
								className="text-4xl sm:text-5xl font-bold text-gray-800 mb-8"
								whileInView={{
									backgroundImage: [
										'linear-gradient(45deg, #f97316, #22c55e)',
										'linear-gradient(135deg, #22c55e, #f97316)',
										'linear-gradient(45deg, #f97316, #22c55e)'
									]
								}}
								style={{
									backgroundClip: 'text',
									WebkitBackgroundClip: 'text',
									color: 'transparent'
								}}
								transition={{ duration: 3, repeat: Infinity }}
							>
								Meet Our Founder
							</motion.h2>

							<motion.div
								// RESPONSIVE PADDING
								className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-2xl"
								// ANIMATION FIX: Added 'whileInView' for 3D tilt on all devices
								initial={{ opacity: 0, y: 50, rotateX: -10 }}
								whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
								transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
								// ANIMATION FIX: 'whileHover' is now subtle for desktop only
								whileHover={{
									scale: 1.02,
									boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
								}}
								viewport={{ once: true }}
								style={{
									transformStyle: 'preserve-3d',
									perspective: '1000px'
								}}
							>
								{/* 3D border effect */}
								<div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-green-500 rounded-2xl"
									style={{ transform: 'translateZ(-10px)', zIndex: -1 }} />

								<div className="flex items-center mb-6">
									<motion.div
										// RESPONSIVE SIZING
										className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center mr-4 sm:mr-6 relative"
										style={{ transformStyle: 'preserve-3d' }}
										animate={{
											translateY: [0, -10, 0],
											rotateY: [0, 20, -20, 0],
											rotateX: [0, 10, -10, 0],
										}}
										transition={{
											duration: 5,
											repeat: Infinity,
											ease: "easeInOut"
										}}
										whileHover={{
											rotateY: 180,
											scale: 1.1
										}}
									>
										<User className="w-8 h-8 sm:w-10 sm:h-10 text-white" style={{ transform: 'translateZ(10px)' }} />
									</motion.div>
									<div>
										{/* RESPONSIVE FONT */}
										<h3 className="text-2xl sm:text-3xl font-bold text-gray-800">J. SURENDAR</h3>
										<p className="text-gray-600 text-base sm:text-lg">Founder & Chief Instructor</p>
									</div>
								</div>

								{/* RESPONSIVE FONT */}
								<p className="text-gray-700 leading-relaxed mb-4 text-base sm:text-lg">
									With years of experience in language education, J. Surendar has dedicated his life to making Hindi accessible to Tamil speakers. His unique teaching methodology focuses on practical speaking skills rather than traditional grammar-heavy approaches.
								</p>
								<p className="text-gray-700 leading-relaxed text-base sm:text-lg">
									Under his guidance, hundreds of students have successfully mastered Hindi, opening doors to new career opportunities and business ventures across India.
								</p>
							</motion.div>
						</div>

						{/* 3D Statistics Grid */}
						{/* RESPONSIVE GRID: 1 col on mobile, 2 on desktop */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
							{[
								{ icon: Users, value: '500+', label: 'Students Trained', color: 'orange', delay: 0 },
								{ icon: Award, value: '5.0', label: 'Rating (61 Reviews)', color: 'green', delay: 0.1 },
								{ icon: BookOpen, value: '10+', label: 'Years Experience', color: 'blue', delay: 0.2 },
								{ icon: Target, value: '95%', label: 'Success Rate', color: 'purple', delay: 0.3 }
							].map((stat, index) => (
								<motion.div
									key={index}
									// The 'whileInView' animation IS the main effect for all devices
									initial={{ opacity: 0, scale: 0.8, rotateY: -45 }}
									whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
									// 'whileHover' is now a subtle desktop-only extra
									whileHover={{
										scale: 1.05,
										boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)'
									}}
									viewport={{ once: true }}
									transition={{
										delay: stat.delay,
										duration: 0.8,
										type: "spring",
										stiffness: 200
									}}
									className={`${statColorMap[stat.color].bg} p-6 sm:p-8 rounded-xl text-center relative overflow-hidden`}
									style={{
										transformStyle: 'preserve-3d',
										perspective: '1000px'
									}}
								>
									<div className="absolute inset-0 opacity-10">
										<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-current via-transparent to-current transform rotate-45 scale-150" />
									</div>

									<motion.div
										animate={{
											rotateY: [0, 360],
											scale: [1, 1.1, 1]
										}}
										transition={{
											duration: 4,
											repeat: Infinity,
											ease: "easeInOut"
										}}
										style={{ transform: 'translateZ(20px)' }}
									>
										{/* RESPONSIVE SIZING */}
										<stat.icon className={`${statColorMap[stat.color].text} w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4`} />
									</motion.div>

									<motion.h4
										// RESPONSIVE FONT
										className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2"
										initial={{ y: 20, opacity: 0 }}
										whileInView={{
											y: 0,
											opacity: 1,
											scale: [1, 1.1, 1],
											color: ['#1f2937', '#f97316', '#1f2937']
										}}
										transition={{ duration: 1, delay: stat.delay + 0.2 }}
										viewport={{ once: true }}
										style={{ transform: 'translateZ(15px)' }}
									>
										{stat.value}
									</motion.h4>

									<motion.p
										className="text-gray-600 font-medium"
										style={{ transform: 'translateZ(10px)' }}
										initial={{ y: 20, opacity: 0 }}
										whileInView={{ y: 0, opacity: 1 }}
										transition={{ duration: 1, delay: stat.delay + 0.3 }}
										viewport={{ once: true }}
									>
										{stat.label}
									</motion.p>
								</motion.div>
							))}
						</div>
					</motion.div>
				</div>
			</section>

			{/* Enhanced Mission & Vision with 3D Perspective */}
			<section className="py-16 sm:py-20 bg-white relative overflow-hidden">
				<div className="absolute inset-0 opacity-5">
					{[...Array(20)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute w-32 h-32 border-2 border-gray-300 rounded-full"
							animate={{
								x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
								y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
								rotate: [0, 360],
								scale: [0.5, 1.5, 0.5]
							}}
							transition={{
								duration: 15 + Math.random() * 10,
								repeat: Infinity,
								ease: "linear"
							}}
							style={{
								left: Math.random() * 100 + '%',
								top: Math.random() * 100 + '%'
							}}
						/>
					))}
				</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="text-center mb-12 sm:mb-16"
					>
						{/* RESPONSIVE FONT */}
						<h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
							Our Mission & Vision
						</h2>
					</motion.div>

					{/* RESPONSIVE GAP */}
					<div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
						{[
							{
								icon: Target,
								title: "Our Mission",
								content: "To break language barriers and empower Tamil speakers with fluent Hindi communication skills, enabling them to access opportunities across India's diverse business landscape. We believe Hindi is not an enemy language but a bridge to success.",
								color: "orange",
								direction: "left"
							},
							{
								icon: Heart,
								title: "Our Vision",
								content: "To create a community of confident Hindi speakers who can seamlessly communicate across India, fostering business relationships, cultural understanding, and personal growth. We envision a future where language is never a barrier to success.",
								color: "green",
								direction: "right"
							}
						].map((item, index) => (
							<motion.div
								key={index}
								// This 'whileInView' animation IS the main 3D effect
								initial={{
									opacity: 0,
									x: item.direction === 'left' ? -100 : 100,
									rotateY: item.direction === 'left' ? -30 : 30
								}}
								whileInView={{
									opacity: 1,
									x: 0,
									rotateY: 0
								}}
								// 'whileHover' is now a subtle desktop-only extra
								whileHover={{
									scale: 1.02,
									boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
								}}
								viewport={{ once: true }}
								transition={{
									whileInView: { duration: 1, ease: "easeOut" },
									whileHover: { type: "spring", stiffness: 300, damping: 15 }
								}}
								// RESPONSIVE PADDING
								className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl relative"
								style={{
									transformStyle: 'preserve-3d',
									perspective: '1000px'
								}}
							>
								<div className={`absolute inset-0 ${itemColorMap[item.color].bg} rounded-2xl`}
									style={{ zIndex: -1, transform: 'translateZ(-5px) translateX(10px) translateY(10px)' }} />

								<motion.div
									animate={{
										rotateZ: [0, 5, -5, 0],
										scale: [1, 1.05, 1]
									}}
									transition={{
										duration: 6,
										repeat: Infinity,
										ease: "easeInOut"
									}}
									style={{ transform: 'translateZ(20px)' }}
								>
									{/* RESPONSIVE SIZING */}
									<item.icon className={`${itemColorMap[item.color].text} w-12 h-12 sm:w-16 sm:h-16 mb-8`} />
								</motion.div>

								{/* RESPONSIVE FONT */}
								<h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6" style={{ transform: 'translateZ(15px)' }}>
									{item.title}
								</h3>
								{/* RESPONSIVE FONT */}
								<p className="text-gray-700 leading-relaxed text-base sm:text-lg" style={{ transform: 'translateZ(10px)' }}>
									{item.content}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Enhanced Contact Section with 3D Elements */}
			<section className="py-16 sm:py-20 bg-gradient-to-br from-orange-600 via-red-500 to-green-600 text-white relative overflow-hidden">
				<div className="absolute inset-0">
					{[...Array(15)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute w-4 h-4 bg-white/20 rounded-full"
							animate={{
								x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
								y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
								scale: [0, 2, 0],
								rotateZ: [0, 360]
							}}
							transition={{
								duration: 8 + Math.random() * 4,
								repeat: Infinity,
								delay: Math.random() * 3
							}}
							style={{
								left: Math.random() * 100 + '%',
								top: Math.random() * 100 + '%'
							}}
						/>
					))}
				</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="text-center"
					>
						<motion.h2
							// RESPONSIVE FONT
							className="text-4xl sm:text-5xl font-bold mb-12"
							animate={{
								textShadow: [
									'0 0 10px rgba(255,255,255,0.5)',
									'0 0 20px rgba(255,255,255,0.8)',
									'0 0 10px rgba(255,255,255,0.5)'
								]
							}}
							transition={{ duration: 3, repeat: Infinity }}
						>
							Get In Touch
						</motion.h2>

						{/* RESPONSIVE GAP */}
						<div className="grid md:grid-cols-3 gap-10 md:gap-12">
							{[
								{ icon: Phone, title: 'Call/WhatsApp', info: '6397255377', delay: 0 },
								{
									icon: MapPin,
									title: 'Address',
									info: '22, Sri Angalamman Illam, Krishnasamy Street, near Zeon Cinema, Vandipettai, Gobichettipalayam, Tamil Nadu 638476',
									delay: 0.2
								},
								{ icon: Star, title: 'Rating', info: '5.0 ⭐ (61 Reviews) - Google Maps Verified', delay: 0.4 }
							].map((contact, index) => (
								<motion.div
									key={index}
									// This 'whileInView' IS the main 3D animation
									initial={{ opacity: 0, y: 50, rotateX: -30 }}
									whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
									// 'whileHover' is now a subtle desktop-only extra
									whileHover={{
										scale: 1.05,
										boxShadow: [
											'0 20px 40px rgba(0,0,0,0.3)',
											'0 25px 50px rgba(255,255,255,0.2)',
											'0 20px 40px rgba(0,0,0,0.3)'
										]
									}}
									viewport={{ once: true }}
									transition={{
										whileInView: { delay: contact.delay, duration: 0.8 },
										whileHover: { duration: 0.8, ease: "easeInOut", repeat: Infinity }
									}}
									className="flex flex-col items-center relative"
									style={{
										transformStyle: 'preserve-3d',
										perspective: '1000px'
									}}
								>
									<motion.div
										animate={{
											rotateY: [0, 360],
											scale: [1, 1.2, 1]
										}}
										transition={{
											duration: 8,
											repeat: Infinity,
											ease: "easeInOut"
										}}
										// RESPONSIVE PADDING
										className="bg-white/20 p-5 sm:p-6 rounded-full mb-6"
										style={{ transform: 'translateZ(20px)' }}
									>
										{/* RESPONSIVE SIZING */}
										<contact.icon className="w-10 h-10 sm:w-12 sm:h-12" />
									</motion.div>

									{/* RESPONSIVE FONT */}
									<h3 className="text-xl sm:text-2xl font-semibold mb-4" style={{ transform: 'translateZ(15px)' }}>
										{contact.title}
									</h3>
									{/* RESPONSIVE FONT */}
									<p className="text-center text-base sm:text-lg" style={{ transform: 'translateZ(10px)' }}>
										{contact.info}
									</p>
								</motion.div>
							))}
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default About;
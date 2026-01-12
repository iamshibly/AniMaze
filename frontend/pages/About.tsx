// src/pages/About.tsx - Cyberpunk Futuristic Anime About Page
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Heart, 
  Star, 
  Zap, 
  Users, 
  Gamepad2,
  BookOpen,
  Code,
  Github,
  Linkedin,
  Mail,
  Info,
  Home,
  Play,
  Target,
  Cpu,
  Shield,
  Rocket
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const glowHover = {
  hover: {
    scale: 1.02,
    rotateX: 5,
    boxShadow: "0 0 30px rgba(0, 255, 255, 0.3)",
    transition: { duration: 0.3 }
  }
};

const neonGlow = {
  initial: { boxShadow: "0 0 0px rgba(0, 255, 255, 0)" },
  animate: { 
    boxShadow: [
      "0 0 5px rgba(0, 255, 255, 0.5)",
      "0 0 20px rgba(0, 255, 255, 0.8)",
      "0 0 5px rgba(0, 255, 255, 0.5)"
    ],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  }
};

// HUD-style Info Card Component
const InfoCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
  delay?: number;
}> = ({ icon, title, description, accent, delay = 0 }) => (
  <motion.div
    variants={fadeInUp}
    whileHover="hover"
    className="relative group"
    style={{ perspective: '1000px' }}
  >
    <Card className="relative bg-black/80 border-2 border-cyan-500/30 backdrop-blur-lg overflow-hidden h-full group-hover:border-cyan-400/60 transition-all duration-300">
      {/* Neon corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"></div>
        <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-cyan-400 to-transparent"></div>
      </div>
      <div className="absolute top-0 right-0 w-8 h-8">
        <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-cyan-400 to-transparent"></div>
        <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-cyan-400 to-transparent"></div>
      </div>
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-green-500/20 group-hover:opacity-30 transition-opacity duration-300"></div>
      </div>
      
      {/* Hover glow effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        variants={glowHover}
      />
      
      <CardContent className="p-6 relative z-10 h-full flex flex-col">
        {/* Icon with glow */}
        <div className="mb-4 relative">
          <motion.div 
            className={`w-16 h-16 rounded-lg bg-gradient-to-br ${accent} flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300`}
            animate={{
              boxShadow: [
                "0 0 0px rgba(0, 255, 255, 0)",
                "0 0 20px rgba(0, 255, 255, 0.5)",
                "0 0 0px rgba(0, 255, 255, 0)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="text-white text-2xl">
              {icon}
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-3 font-mono tracking-wider">
            {title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed font-light">
            {description}
          </p>
        </div>
        
        {/* Bottom accent line */}
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent group-hover:via-green-400 transition-colors duration-300"></div>
      </CardContent>
    </Card>
  </motion.div>
);

// Cyberpunk Developer Card Component
const DeveloperCard: React.FC<{
  name: string;
  role: string;
  image: string;
  accent: string;
  delay?: number;
}> = ({ name, role, image, accent, delay = 0 }) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{
      scale: 1.05,
      rotateY: 10,
      transition: { duration: 0.3 }
    }}
    className="relative group"
  >
    <Card className="relative bg-gradient-to-br from-black via-gray-900 to-black border-2 border-red-500/40 backdrop-blur-lg overflow-hidden group-hover:border-red-400/70 transition-all duration-300">
      {/* Animated circuit pattern background */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-green-400"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-green-400"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-green-400"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-green-400"></div>
      </div>
      
      {/* Neon glow effect */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-r ${accent} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
      />
      
      <CardContent className="p-8 relative z-10 text-center">
        {/* Cyberpunk Photo Frame */}
        <div className="relative mb-6 mx-auto w-32 h-32">
          {/* Outer glow ring */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-green-400 to-cyan-400 p-1 group-hover:p-1.5 transition-all duration-300"
            animate={{
              rotate: [0, 360],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full rounded-full bg-black p-2">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 relative">
                <img 
                  src={image} 
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const initials = name.split(' ').map(n => n[0]).join('');
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.className = 'w-full h-full bg-gradient-to-br from-red-500 to-cyan-500 flex items-center justify-center';
                    fallbackDiv.innerHTML = `<span class="text-white text-3xl font-bold font-mono">${initials}</span>`;
                    target.parentElement!.appendChild(fallbackDiv);
                  }}
                />
                {/* Scanning line animation */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent h-2"
                  animate={{ y: [-10, 120, -10] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>
          
          {/* Corner brackets */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400"></div>
          <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-400"></div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-400"></div>
        </div>

        {/* Developer Info */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-green-400 to-cyan-400 bg-clip-text text-transparent font-mono tracking-wider">
            {name}
          </h3>
          <Badge className="bg-gradient-to-r from-red-500/20 to-cyan-500/20 text-green-400 border-green-400/50 font-mono">
            {role}
          </Badge>
          <div className="text-gray-400 text-sm font-mono">
            &gt; LEVEL_99_DEVELOPER
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex justify-center items-center mt-4 space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs text-green-400 font-mono">ONLINE</span>
          </div>
          <div className="flex items-center space-x-1">
            <Code className="w-3 h-3 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-mono">CODING</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Futuristic Button Component
const NeonButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = "" }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Button
      className={`relative bg-gradient-to-r from-red-600 via-green-500 to-cyan-500 hover:from-red-500 hover:via-green-400 hover:to-cyan-400 text-white font-mono font-bold tracking-wider px-8 py-4 text-lg rounded-full border-2 border-white/20 hover:border-white/40 transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/50 via-green-400/50 to-cyan-400/50 blur-md -z-10"
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {children}
    </Button>
  </motion.div>
);

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cyberpunk Hero Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-black to-green-900/30"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Floating neon elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-pulse [animation-delay:0s]"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-red-500/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-green-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
        <div className="absolute bottom-20 right-1/4 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl animate-pulse [animation-delay:1.5s]"></div>
        
        {/* Scanning lines */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent h-1"
          animate={{ y: [0, 800, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Title Section */}
        <motion.section
          className="text-center mb-20"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <motion.h1 
              className="text-7xl md:text-9xl font-black mb-6 bg-gradient-to-r from-red-500 via-green-400 to-cyan-400 bg-clip-text text-transparent leading-tight font-mono tracking-wider"
              animate={{
                textShadow: [
                  "0 0 10px rgba(0,255,255,0.5)",
                  "0 0 30px rgba(255,0,0,0.5)",
                  "0 0 10px rgba(0,255,255,0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ABOUT OUR
            </motion.h1>
            <motion.h2 
              className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent font-mono"
            >
              CYBER WORLD
            </motion.h2>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <p className="text-xl text-green-400 font-mono tracking-wider mb-4">
              &gt; ANIME. MANGA. INNOVATION.
            </p>
            <p className="text-lg text-cyan-300 font-mono">
              BUILT FOR OTAKUS, BY OTAKUS.
            </p>
          </motion.div>
        </motion.section>

        {/* Info Cards Section */}
        <motion.section
          className="mb-20"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <InfoCard
              icon="🎭"
              title="OUR PASSION"
              description="We're hardcore anime fans who wanted to create the ultimate platform for discovering, tracking, and discussing anime and manga. No ads, no distractions—just pure otaku experience."
              accent="from-red-600 to-pink-600"
            />
            
            <InfoCard
              icon="💻"
              title="DEVELOPERS"
              description="Meet our elite development team: two full-stack ninjas who live and breathe code. They've crafted every feature with precision and passion for the community."
              accent="from-green-600 to-cyan-600"
            />
            
            <InfoCard
              icon="🚀"
              title="OUR VISION"
              description="Building the future of anime discovery with AI-powered quizzes, smart watchlists, community features, and cutting-edge tech that adapts to your otaku lifestyle."
              accent="from-purple-600 to-blue-600"
            />
          </div>
        </motion.section>

        {/* Developer Showcase Section */}
        <motion.section
          className="mb-20"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 via-green-400 to-cyan-400 bg-clip-text text-transparent font-mono tracking-wider">
              &gt; DEVELOPER_PROFILES.EXE
            </h2>
            <p className="text-green-400 text-lg font-mono">
              // Meet the code warriors behind the platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <DeveloperCard
              name="ZUBAYER AHMAD SHIBLY"
              role="FULL STACK DEVELOPER"
              image="/zu.jpg"
              accent="from-red-500/10 to-cyan-500/10"
            />
            <DeveloperCard
              name="AHSANUL AMIN MUHIT"
              role="FULL STACK DEVELOPER"  
              image="/mu.jpg"
              accent="from-green-500/10 to-purple-500/10"
            />
          </div>
        </motion.section>

        {/* Closing CTA Section */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div className="mb-8">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-red-400 bg-clip-text text-transparent font-mono tracking-wider mb-4">
              LEVEL UP YOUR
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white font-mono tracking-wider">
              ANIME JOURNEY WITH US!
            </h3>
          </motion.div>

          <motion.div 
            className="mb-8"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="inline-block p-4 border-2 border-cyan-400/50 rounded-lg bg-black/50 backdrop-blur-lg">
              <div className="flex items-center justify-center space-x-4 text-green-400 font-mono">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span>SYSTEM_READY</span>
                </div>
                <div className="w-px h-4 bg-cyan-400/50"></div>
                <div className="flex items-center space-x-1">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400">AI_ENHANCED</span>
                </div>
                <div className="w-px h-4 bg-cyan-400/50"></div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">SECURE</span>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Technology Stack Section */}
        <motion.section
          className="mb-20"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 via-green-400 to-cyan-400 bg-clip-text text-transparent font-mono tracking-wider">
              &gt; TECH_STACK.EXE
            </h2>
            <p className="text-green-400 text-lg font-mono">
              // System architecture and technology specifications
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="max-w-4xl mx-auto">
            <Card className="relative bg-gradient-to-br from-black via-gray-900 to-black border-2 border-cyan-500/40 backdrop-blur-lg overflow-hidden group hover:border-cyan-400/70 transition-all duration-300">
              {/* Animated circuit pattern background */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-green-400"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-green-400"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-green-400"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-green-400"></div>
              </div>

              {/* Scanning line animation */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent w-2"
                animate={{ x: [-20, 400, -20] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              <CardContent className="p-8 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-center mb-8">
                  <motion.div 
                    className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-600 to-purple-600 flex items-center justify-center relative"
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(0, 255, 255, 0)",
                        "0 0 20px rgba(0, 255, 255, 0.5)",
                        "0 0 0px rgba(0, 255, 255, 0)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="text-white text-2xl">💾</div>
                  </motion.div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-white font-mono tracking-wider">
                      COMPLETE TECHNOLOGY COUNT
                    </h3>
                    <div className="text-green-400 text-sm font-mono">
                      &gt; SYSTEM_SPECS_INITIALIZED
                    </div>
                  </div>
                </div>

                {/* Technology Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Languages */}
                  <div className="bg-black/40 border border-green-400/30 rounded-lg p-4 hover:border-green-400/60 transition-colors duration-300">
                    <div className="flex items-center mb-3">
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse mr-2"></div>
                      <h4 className="text-green-400 font-mono font-bold">📝 LANGUAGES</h4>
                    </div>
                    <div className="space-y-1 text-sm text-gray-300 font-mono">
                      <div>&gt; Frontend: 4 (TypeScript, JavaScript, CSS, HTML)</div>
                      <div>&gt; Backend: 1 (Python)</div>
                      <div className="text-green-400 font-bold">&gt; Total Languages: 5</div>
                    </div>
                  </div>

                  {/* Frameworks */}
                  <div className="bg-black/40 border border-purple-400/30 rounded-lg p-4 hover:border-purple-400/60 transition-colors duration-300">
                    <div className="flex items-center mb-3">
                      <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse mr-2"></div>
                      <h4 className="text-purple-400 font-mono font-bold">⚡ FRAMEWORKS</h4>
                    </div>
                    <div className="space-y-1 text-sm text-gray-300 font-mono">
                      <div>&gt; Frontend: 2 (React, Vite)</div>
                      <div>&gt; Backend: 1 (Flask)</div>
                      <div className="text-purple-400 font-bold">&gt; Total Frameworks: 3</div>
                    </div>
                  </div>

                  {/* Backend Database */}
                  <div className="bg-black/40 border border-orange-400/30 rounded-lg p-4 hover:border-orange-400/60 transition-colors duration-300">
                    <div className="flex items-center mb-3">
                      <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse mr-2"></div>
                      <h4 className="text-orange-400 font-mono font-bold">🗄️ DATABASE</h4>
                    </div>
                    <div className="space-y-1 text-sm text-gray-300 font-mono">
                      <div>&gt; Backend Database: 1 (MongoDB)</div>
                      <div className="text-orange-400 font-bold">&gt; Total Database: 1</div>
                    </div>
                  </div>

                  {/* Design Systems */}
                  <div className="bg-black/40 border border-cyan-400/30 rounded-lg p-4 hover:border-cyan-400/60 transition-colors duration-300">
                    <div className="flex items-center mb-3">
                      <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse mr-2"></div>
                      <h4 className="text-cyan-400 font-mono font-bold">🎨 DESIGN SYSTEMS</h4>
                    </div>
                    <div className="space-y-1 text-sm text-gray-300 font-mono">
                      <div>&gt; UI Libraries: 3 (Tailwind CSS, shadcn/ui, Lucide React)</div>
                      <div className="text-cyan-400 font-bold">&gt; Total Design: 3</div>
                    </div>
                  </div>

                  {/* APIs */}
                  <div className="bg-black/40 border border-red-400/30 rounded-lg p-4 hover:border-red-400/60 transition-colors duration-300">
                    <div className="flex items-center mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse mr-2"></div>
                      <h4 className="text-red-400 font-mono font-bold">🌐 APIs</h4>
                    </div>
                    <div className="space-y-1 text-sm text-gray-300 font-mono">
                      <div>&gt; External APIs: 6 (AniList, MangaDex, DeepSeek, MyAnimeList, Anime News Network, Crunchyroll News)</div>
                      <div>&gt; Custom APIs: 1 (Backend API)</div>
                      <div className="text-red-400 font-bold">&gt; Total APIs: 7</div>
                    </div>
                  </div>
                </div>

                {/* Data Formats */}
                <div className="mt-6 bg-black/40 border border-yellow-400/30 rounded-lg p-4 hover:border-yellow-400/60 transition-colors duration-300">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse mr-2"></div>
                    <h4 className="text-yellow-400 font-mono font-bold">DATA FORMATS</h4>
                  </div>
                  <div className="text-sm text-gray-300 font-mono">
                    <div>&gt; JSON (1)</div>
                  </div>
                </div>

                {/* Bottom status bar */}
                <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-green-400">STACK_LOADED</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Cpu className="w-3 h-3 text-cyan-400" />
                      <span className="text-cyan-400">OPTIMIZED</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    TOTAL_TECHNOLOGIES: 19
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

          <NeonButton onClick={() => window.location.href = '/'}>
            <Rocket className="w-5 h-5 mr-3" />
            INITIALIZE_HOME_SEQUENCE
          </NeonButton>
        </motion.section>
      </div>
    </div>
    
  );
};

export default About;
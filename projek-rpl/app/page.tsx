"use client";
import Link from 'next/link';
import { Star, Sun, Home, Target, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF9] font-montserrat text-[#2D3748] scroll-smooth">
      
      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center px-10 py-5 bg-[#DED2C4]/40 backdrop-blur-md border-b border-[#2D3748]/5 fixed w-full z-20 transition-all">
        <div className="text-[#A8C5A5] font-bold text-2xl tracking-tight drop-shadow-sm">
          Tanika Daycare
        </div>
        <div className="hidden md:flex gap-10 font-semibold text-gray-500">
          <a href="#home" className="transition-all duration-300 hover:text-[#A8C5A5] hover:scale-110 drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] hover:drop-shadow-md">Home</a>
          <a href="#about" className="transition-all duration-300 hover:text-[#A8C5A5] hover:scale-110 drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] hover:drop-shadow-md">About</a>
          <a href="#programs" className="transition-all duration-300 hover:text-[#A8C5A5] hover:scale-110 drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] hover:drop-shadow-md">Programs</a>
          <a href="#contact" className="transition-all duration-300 hover:text-[#A8C5A5] hover:scale-110 drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] hover:drop-shadow-md">Contact</a>
        </div>
        <Link href="/login">
          <button className="bg-[#A8C5A5] text-white px-8 py-2.5 rounded-full font-bold shadow-md transition-all duration-300 hover:bg-[#97b494] hover:scale-105 hover:shadow-lg active:scale-95">
            Login
          </button>
        </Link>
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative min-h-screen flex items-center px-8 md:px-20 pt-16">
        <div className="grid md:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto">
          <div className="space-y-8 z-10">
            <h1 className="text-6xl md:text-[5.5rem] font-bold leading-[1.1] tracking-tight">
              <span className="text-[#A8C5A5]">Welcome to</span><br />
              <span className="text-[#B4D4E8]">Tanika</span><br />
              <span className="text-[#B4D4E8]">Daycare</span>
            </h1>
            <p className="text-xl text-[#718096] max-w-lg leading-relaxed font-medium">
              Where little minds grow, play, and discover in a nurturing environment filled with joy and learning!
            </p>
            <div className="flex flex-wrap gap-5">
              <button className="bg-[#A8C5A5] text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-[#A8C5A5]/20 hover:scale-105 transition-transform">
                Enroll Today
              </button>
              <button className="border-2 border-[#A8C5A5]/30 text-[#A8C5A5] px-10 py-4 rounded-full font-bold hover:bg-[#A8C5A5] hover:text-white transition-all">
                Take a Tour
              </button>
            </div>
          </div>
          <div className="relative flex justify-center items-center">
            <div className="absolute w-[80%] aspect-square bg-[#B4D4E8]/20 rounded-[4.5rem] translate-x-12 -translate-y-8 rotate-3 -z-10"></div>
            <div className="w-[90%] aspect-square bg-[#D1D5DB] rounded-[5rem] shadow-2xl flex items-center justify-center overflow-hidden border-[12px] border-white relative text-gray-400 font-bold italic">
               Main Photo Space
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: ABOUT US --- */}
      <section id="about" className="py-24 bg-white px-8 md:px-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-[#A8C5A5]/10 rounded-[3rem] -z-10 translate-x-4 translate-y-4"></div>
            <div className="aspect-[4/3] bg-[#D1D5DB] rounded-[3rem] shadow-2xl border-[10px] border-white flex items-center justify-center text-gray-400 font-bold">
              About Us Photo
            </div>
          </div>
          <div className="space-y-6">
            <span className="px-6 py-2 bg-[#E8DDD0] text-[#A8C5A5] rounded-full font-bold text-sm">About Us</span>
            <h2 className="text-5xl md:text-6xl font-bold text-[#A8C5A5] leading-tight">Creating Happy<br />Childhood<br />Memories</h2>
            <p className="text-gray-500 leading-relaxed text-lg">
              At Tanika Daycare, we believe every child deserves a warm, safe, and inspiring environment to grow.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 p-4 border border-[#A8C5A5]/30 rounded-2xl w-fit"><CheckCircle2 className="text-[#A8C5A5]" /><span className="font-bold text-[#A8C5A5]">15+ Years Experience</span></div>
              <div className="flex items-center gap-3 p-4 border border-[#B4D4E8]/50 rounded-2xl w-fit"><CheckCircle2 className="text-[#B4D4E8]" /><span className="font-bold text-[#B4D4E8]">Certified Educators</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: OUR PROGRAMS --- */}
      <section id="programs" className="py-20 bg-[#FDFBF9] px-8 md:px-20 min-h-screen flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-12 space-y-4">
            <span className="px-5 py-1.5 bg-[#B4D4E8]/20 text-[#B4D4E8] rounded-full font-bold text-xs uppercase tracking-widest">Our Programs</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#A8C5A5]">Programs for Every Stage</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ProgramCard icon={<Star className="text-[#A8C5A5]" />} title="Infant Care" desc="Gentle nurturing for our tiniest learners." color="hover:border-[#A8C5A5]" />
            <ProgramCard icon={<Sun className="text-[#B4D4E8]" />} title="Toddler Program" desc="Active exploration through play-based activities." color="hover:border-[#B4D4E8]" />
            <ProgramCard icon={<Home className="text-[#E8DDD0]" />} title="Preschool" desc="Preparing for school success." color="hover:border-[#E8DDD0]" />
            <ProgramCard icon={<Target className="text-[#A8C5A5]" />} title="After School" desc="Safe, fun environment." color="hover:border-[#A8C5A5]" />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer id="contact" className="pt-20 pb-10 bg-white border-t border-gray-100 px-8 md:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Baris Atas: Info Kontak */}
          <div className="grid md:grid-cols-3 gap-12 mb-16 text-left">
            {/* Column 1: Contact Us */}
            <div className="space-y-4">
              <h4 className="font-bold text-[#A8C5A5] text-lg uppercase tracking-wider">Contact Us</h4>
              <div className="text-gray-500 leading-relaxed space-y-1">
                <p>123 Daycare Lane</p>
                <p>Happy City, ST 12345</p>
                <p className="pt-4">Phone: (555) 123-4567</p>
                <p>Email: hello@tanikadaycare.com</p>
              </div>
            </div>

            {/* Column 2: Hours */}
            <div className="space-y-4">
              <h4 className="font-bold text-[#A8C5A5] text-lg uppercase tracking-wider">Hours</h4>
              <div className="text-gray-500 space-y-1">
                <p>Monday - Friday</p>
                <p>7:00 AM - 6:00 PM</p>
                <p className="pt-4">Saturday: By Appointment</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            {/* Column 3: Quick Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-[#A8C5A5] text-lg uppercase tracking-wider">Quick Links</h4>
              <ul className="text-gray-500 space-y-2 font-medium">
                <li className="hover:text-[#A8C5A5] cursor-pointer transition-colors">Enrollment</li>
                <li className="hover:text-[#A8C5A5] cursor-pointer transition-colors">Tuition & Fees</li>
                <li className="hover:text-[#A8C5A5] cursor-pointer transition-colors">Calendar</li>
                <li className="hover:text-[#A8C5A5] cursor-pointer transition-colors">Parent Resources</li>
              </ul>
            </div>
          </div>

          {/* Visit Us Section (Map Placeholder) */}
          <div className="mb-16">
            <p className="text-center font-bold text-[#A8C5A5] mb-6 text-lg">Visit Us</p>
            <div className="w-full h-80 bg-[#D1D5DB] rounded-[3.5rem] shadow-inner flex items-center justify-center relative overflow-hidden border-8 border-white">
              {/* Nanti ganti <iframe> Google Maps di sini */}
              <span className="text-gray-400 font-bold italic">Interactive Map Location</span>
            </div>
          </div>

          {/* Copyright Line */}
          <div className="text-center text-gray-400 text-sm font-medium border-t border-gray-100 pt-10">
            © 2026 Tanika Daycare. All rights reserved. Made with love for little learners.
          </div>
        </div>
      </footer>

    </div> 
  ); 
}

// untuk function program card
function ProgramCard({ icon, title, desc, color }: any) {
  return (
    <div className={`p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-b-4 ${color} group`}>
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#2D3748] mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6">{desc}</p>
      <button className="text-sm font-bold text-[#A8C5A5] hover:underline flex items-center gap-1 transition-all">
        Learn More
      </button>
    </div>
  );
}
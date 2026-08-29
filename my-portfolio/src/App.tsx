import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Cpu,
  Network,
  Shield,
  Code,
  Zap,
  MapPin,
  Mail,
  Linkedin,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  ArrowUp
} from 'lucide-react';

const LogoMark = () => (
  <svg width="36" height="36" viewBox="0 0 64 64" className="shrink-0 drop-shadow-sm">
    <rect x="2" y="2" width="60" height="60" rx="14" fill="#0f172a" stroke="#164e63" strokeWidth="1.5" />
    <path d="M22 22 L13 32 L22 42" fill="none" stroke="#22d3ee" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M42 22 L51 32 L42 42" fill="none" stroke="#22d3ee" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="29.5" y="30" width="5" height="9" rx="1" fill="#22d3ee" className="animate-pulse" />
  </svg>
);

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

const Reveal = ({ children, className = '', delayMs = 0 }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
    >
      {children}
    </div>
  );
};

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 600);

      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Expertise', id: 'expertise' },
    { name: 'Projects', id: 'projects' },
    { name: 'Focus', id: 'goals' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative">

      {/* Custom CSS for Animations and background texture injected directly into the component */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }

        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
        }
        .bg-grain {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.035;
          mix-blend-mode: overlay;
        }
        .text-gradient {
          background: linear-gradient(90deg, #67e8f9, #22d3ee 45%, #3b82f6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .nav-underline {
          position: absolute;
          left: 0;
          bottom: -6px;
          height: 2px;
          background: linear-gradient(90deg, #22d3ee, #3b82f6);
          transition: width 0.3s ease;
        }
      `}</style>

      {/* Atmosphere layers: grid + grain, fixed so they never re-render on scroll */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0" aria-hidden="true"></div>
      <div className="fixed inset-0 bg-grain pointer-events-none z-0" aria-hidden="true"></div>

      {/* Scroll progress indicator */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 z-[60]"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      ></div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-slate-950/90 backdrop-blur-md py-3 border-slate-800/50' : 'bg-transparent py-6 border-transparent'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <button
            className="flex items-center gap-3 group"
            onClick={() => scrollToSection('home')}
            aria-label="Go to top"
          >
            <LogoMark />
            <span className="font-mono text-lg font-bold text-white tracking-tight hidden sm:inline-block">
              RIYAJ<span className="text-cyan-400">.</span>PATEL
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className={`relative text-sm font-medium transition-colors uppercase tracking-wider py-1 ${
                  activeSection === link.id ? 'text-cyan-400' : 'text-slate-300 hover:text-cyan-400'
                }`}
              >
                {link.name}
                <span className="nav-underline" style={{ width: activeSection === link.id ? '100%' : '0%' }}></span>
              </button>
            ))}
          </div>

          {/* Mobile Nav Toggle */}
          <button className="md:hidden text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-6 flex flex-col space-y-4 animate-fade-in-up">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className={`text-left text-lg font-medium ${
                  activeSection === link.id ? 'text-cyan-400' : 'text-slate-300 hover:text-cyan-400'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        <div
          aria-hidden="true"
          className="hidden lg:block absolute top-16 right-4 font-mono text-[7rem] font-bold text-slate-900 select-none leading-none tracking-tighter -rotate-6 z-0"
        >
          01001111
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="font-mono text-slate-500 mb-4 animate-fade-in-up flex items-center gap-2">
            <span className="text-cyan-400">$</span> whoami
            <span className="inline-block w-2 h-4 bg-cyan-400/80 ml-1 animate-pulse"></span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight animate-fade-in-up delay-100">
            <span className="text-gradient">Riyaj Patel.</span>
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-400 mb-8 animate-fade-in-up delay-200">
            Systems Software Engineer.
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed animate-fade-in-up delay-300">
            Specializing in <span className="text-white">High-Performance Networking</span>, <span className="text-white">SmartNIC Acceleration</span>, and <span className="text-white">Packet Processing</span> at 100G+ scale.
            Building the engine room of the modern cloud with C++, DPDK, and Linux.
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-in-up delay-400">
            <button
              onClick={() => scrollToSection('projects')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded font-medium transition-all flex items-center group shadow-lg shadow-black/30 hover:-translate-y-0.5"
            >
              View Projects
              <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="border border-slate-700 hover:border-cyan-400/60 bg-slate-900/40 text-slate-300 hover:text-cyan-400 px-8 py-3 rounded font-medium transition-all hover:-translate-y-0.5"
            >
              Contact Me
            </button>
          </div>

          <div className="mt-16 flex flex-wrap gap-3 text-slate-400 font-mono text-sm">
            <span className="flex items-center rounded-full border border-slate-800 bg-slate-900/50 px-4 py-2"><Terminal size={14} className="mr-2 text-cyan-500" /> C++ (11-20)</span>
            <span className="flex items-center rounded-full border border-slate-800 bg-slate-900/50 px-4 py-2"><Network size={14} className="mr-2 text-cyan-500" /> DPDK / DOCA</span>
            <span className="flex items-center rounded-full border border-slate-800 bg-slate-900/50 px-4 py-2"><Cpu size={14} className="mr-2 text-cyan-500" /> BlueField-2 DPU</span>
            <span className="flex items-center rounded-full border border-slate-800 bg-slate-900/50 px-4 py-2"><Shield size={14} className="mr-2 text-cyan-500" /> DPI & Crypto</span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-900/50 relative">
        <div className="container mx-auto px-6 max-w-5xl">
          <Reveal>
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <span className="text-cyan-400 mr-2 font-mono">01.</span> About Me
                </h2>
                <div className="space-y-4 text-slate-400 leading-relaxed">
                  <p>
                    I am a Systems Software Engineer with a deep focus on designing software that operates at the cutting edge of network performance. My work revolves around building real-time, low-latency, distributed packet-processing systems that handle massive throughput across modern NICs and DPUs.
                  </p>
                  <p>
                    I have worked extensively with <strong className="text-slate-200">NVIDIA BlueField-2</strong>, <strong className="text-slate-200">Mellanox technologies</strong>, and <strong className="text-slate-200">Napatech SmartNICs</strong>. My engineering approach combines low-level C++ optimizations with architectural patterns designed for scale—think lock-free structures, NUMA awareness, and cache alignment.
                  </p>
                  <p>
                    Whether it's building Deep Packet Inspection (DPI) engines or offloading crypto operations to specialized hardware, I enjoy solving complex problems in security, networking, and cloud infrastructure.
                  </p>
                </div>
              </div>

              <div className="md:w-1/3 bg-slate-800/80 rounded-lg border border-slate-700 overflow-hidden shadow-xl shadow-black/20">
                <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-800 border-b border-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                  <span className="ml-2 text-xs font-mono text-slate-500">profile.json</span>
                </div>
                <div className="p-6">
                  <h3 className="text-white font-bold mb-4 flex items-center">
                    <Code size={20} className="mr-2 text-cyan-400" />
                    Quick Tech Profile
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-400 font-mono">
                    <li className="flex justify-between border-b border-slate-700 pb-2">
                      <span>Languages</span>
                      <span className="text-slate-200">C++, C, Python</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-700 pb-2 pt-2">
                      <span>OS</span>
                      <span className="text-slate-200">Linux (Internals)</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-700 pb-2 pt-2">
                      <span>Networking</span>
                      <span className="text-slate-200">DPDK, OVS, TCP/IP</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-700 pb-2 pt-2">
                      <span>Hardware</span>
                      <span className="text-slate-200">BlueField-2, SmartNICs</span>
                    </li>
                    <li className="flex justify-between pt-2">
                      <span>Tools</span>
                      <span className="text-slate-200">Wireshark, Perf, Git</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Expertise / Skills Section */}
      <section id="expertise" className="py-20 px-6 relative">
        <div className="container mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-3xl font-bold text-white mb-12 flex items-center">
              <span className="text-cyan-400 mr-2 font-mono">02.</span> Core Strengths
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal delayMs={0}>
              <SkillCard
                icon={<Terminal size={24} className="text-cyan-400" />}
                title="Systems Programming"
                skills={[
                  "Advanced C++ (C++11–C++20)",
                  "Lock-free algorithms & Ring buffers",
                  "Multi-threaded scheduling",
                  "Memory models & Atomics",
                  "HPC Optimizations"
                ]}
              />
            </Reveal>
            <Reveal delayMs={80}>
              <SkillCard
                icon={<Network size={24} className="text-purple-400" />}
                title="Networking & Packet Processing"
                skills={[
                  "DPDK, AF_XDP, OVS",
                  "L2–L7 Inspection & Parsing",
                  "TCP/IP, QUIC, HTTP/2",
                  "Traffic Shaping & Telemetry",
                  "Socket Programming"
                ]}
              />
            </Reveal>
            <Reveal delayMs={0}>
              <SkillCard
                icon={<Zap size={24} className="text-yellow-400" />}
                title="SmartNIC / DPU Offloading"
                skills={[
                  "NVIDIA BlueField-2 (DOCA)",
                  "Mellanox ConnectX & Inline Offload",
                  "Napatech SmartNIC pipelines",
                  "Packet Steering & Flow Rules",
                  "ARM Core Optimization"
                ]}
              />
            </Reveal>
            <Reveal delayMs={80}>
              <SkillCard
                icon={<Shield size={24} className="text-green-400" />}
                title="Security & Architecture"
                skills={[
                  "SSL/TLS & IPSec pipelines",
                  "Crypto Acceleration Offload",
                  "NUMA-aware Architecture",
                  "DPI (Deep Packet Inspection)",
                  "Hyperscan & YARA"
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-slate-900/50 px-6 relative">
        <div className="container mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-3xl font-bold text-white mb-12 flex items-center">
              <span className="text-cyan-400 mr-2 font-mono">03.</span> Highlighted Projects
            </h2>
          </Reveal>

          <div className="space-y-8">
            <Reveal>
              <ProjectCard
                index="01"
                title="SmartNIC-Accelerated DPI Engine"
                description="Designed & implemented a high-throughput DPI engine running on NVIDIA BlueField-2 using DOCA + DPDK. Achieved L4/L7 inspection with multi-threaded flow pipelines directly on the DPU."
                tags={["C++", "DOCA", "BlueField-2", "DPDK", "DPI"]}
              />
            </Reveal>

            <Reveal>
              <ProjectCard
                index="02"
                title="High-Performance Traffic Interceptor"
                description="Built a 100G real-time packet interception system using Mellanox NICs and DPDK. Implemented hashing-based load distribution across worker cores to maximize throughput without packet loss."
                tags={["Networking", "Mellanox", "100G", "Load Balancing"]}
              />
            </Reveal>

            <Reveal>
              <ProjectCard
                index="03"
                title="Crypto Offload Pipeline (SSL/TLS/QUIC)"
                description="Implemented selective offloading using DPU crypto acceleration hardware. Significantly improved handshake throughput and reduced host CPU load for secure networking protocols."
                tags={["Cryptography", "SSL/TLS", "QUIC", "Offloading"]}
              />
            </Reveal>

            <Reveal>
              <ProjectCard
                index="04"
                title="Distributed Packet Filtering System"
                description="Created an end-to-end network filtering engine supporting IP, URL, and behavior-based filtering. Featured smart caching mechanisms and flow-rule optimization for low latency."
                tags={["System Design", "Filtering", "Caching", "Performance"]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Focus & Interests Section */}
      <section id="goals" className="py-20 px-6 relative">
        <Reveal className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 rounded-2xl border border-slate-700 relative overflow-hidden shadow-xl shadow-black/20">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                <span className="text-cyan-400 font-mono">04.</span> What Drives My Work
              </h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                I'm driven by pushing the boundaries of network performance. My goal is to keep deepening my expertise in next-generation data pipelines, AI networking, and high-performance systems.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-2">
                <div>
                  <h3 className="text-white font-semibold mb-3 border-l-2 border-cyan-500 pl-3">Focus Areas</h3>
                  <ul className="list-disc list-inside text-slate-400 space-y-1">
                    <li>High-performance network systems</li>
                    <li>SmartNIC & DPU acceleration</li>
                    <li>AI networking & pipeline optimization</li>
                    <li>Cloud-scale packet processing</li>
                  </ul>
                </div>
                <div>
                   <h3 className="text-white font-semibold mb-3 border-l-2 border-purple-500 pl-3">Domains of Interest</h3>
                   <p className="text-slate-400 text-sm leading-relaxed">
                     Advanced networking infrastructure at the scale found in high-performance computing, cloud platforms, and next-generation data center hardware.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 text-center relative">
        <Reveal className="container mx-auto max-w-2xl">
          <h2 className="text-4xl font-bold text-white mb-6">Get In Touch</h2>
          <p className="text-slate-400 mb-10 text-lg">
            I enjoy talking systems engineering. Whether you have a question about my stack or want to swap ideas on network performance, my inbox is open.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
            <a
              href="mailto:riyajpatel041@gmail.com"
              className="flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-lg font-medium transition-all w-full md:w-auto justify-center shadow-lg shadow-black/30 hover:-translate-y-0.5"
            >
              <Mail size={20} />
              Send an Email
            </a>
            <a
              href="https://www.linkedin.com/in/riyaj-patel-439447171"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg font-medium transition-all w-full md:w-auto justify-center border border-slate-700 hover:-translate-y-0.5"
            >
              <Linkedin size={20} />
              Connect on LinkedIn
            </a>
          </div>

          <div className="flex items-center justify-center text-slate-500 gap-2">
            <MapPin size={16} />
            <span>Indore, India</span>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-900 relative">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left text-slate-600 text-sm font-mono">
          <p>Built with React &amp; Tailwind. Designed for Performance.</p>
          <p>© {new Date().getFullYear()} Riyaj Patel</p>
        </div>
      </footer>

      {/* Back to top */}
      <button
        onClick={() => scrollToSection('home')}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/60 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
};

// Sub-components

interface SkillCardProps {
  icon: React.ReactNode;
  title: string;
  skills: string[];
}

const SkillCard = ({ icon, title, skills }: SkillCardProps) => (
  <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 hover:border-cyan-500/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 transition-all group">
    <div className="flex items-center mb-4">
      <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white ml-4">{title}</h3>
    </div>
    <ul className="space-y-2">
      {skills.map((skill, index) => (
        <li key={index} className="flex items-start text-slate-400 text-sm">
          <span className="text-cyan-500 mr-2 mt-1">▹</span>
          {skill}
        </li>
      ))}
    </ul>
  </div>
);

interface ProjectCardProps {
  index: string;
  title: string;
  description: string;
  tags: string[];
}

const ProjectCard = ({ index, title, description, tags }: ProjectCardProps) => (
  <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
      <ExternalLink className="text-cyan-400" size={24} />
    </div>
    <span className="font-mono text-xs text-slate-600 group-hover:text-cyan-500/70 transition-colors">{index}</span>
    <h3 className="text-2xl font-bold text-white mt-2 mb-3 group-hover:text-cyan-400 transition-colors">{title}</h3>
    <p className="text-slate-400 mb-6 max-w-3xl leading-relaxed">{description}</p>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, i) => (
        <span key={i} className="px-3 py-1 bg-cyan-900/30 text-cyan-300 text-xs font-mono rounded-full border border-cyan-900/50">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default Portfolio;

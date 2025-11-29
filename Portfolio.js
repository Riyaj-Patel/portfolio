import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Cpu, 
  Network, 
  Shield, 
  Server, 
  Code, 
  Database, 
  Zap, 
  MapPin, 
  Mail, 
  Linkedin, 
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  MessageSquare,
  Send,
  Loader2,
  Sparkles,
  Bot,
  FileText
} from 'lucide-react';

// --- Gemini API Integration ---

const apiKey = ""; // API Key provided by runtime environment

const RESUME_CONTEXT = `
You are an AI assistant for Riyaj Patel, a Systems Software Engineer specializing in High-Performance Networking.
Here is his profile data:
Name: Riyaj Patel
Role: Systems Software Engineer (Networking & Acceleration)
Core Skills: C++ (11-20), Linux, High-Performance Networking, SmartNICs, DPDK, DPI, Crypto, NUMA, Multithreading.
Experience Highlights:
1. SmartNIC-Accelerated DPI Engine: Built on BlueField-2 using DOCA + DPDK.
2. High-Performance Traffic Interceptor: 100G real-time packet interception using Mellanox NICs + DPDK.
3. Crypto Offload Pipeline: SSL/TLS/QUIC offloading using DPU accelerators.
4. Distributed Packet Filtering: IP/URL/behavior-based filtering.
Target Roles: NVIDIA, AMD, Intel, Cloudflare, Arista, CrowdStrike.
Location: Indore, India (Remote-friendly).
Tone: Professional, technical, concise, enthusiastic about low-level systems programming.
`;

const callGemini = async (prompt, systemInstruction = "You are a helpful assistant.") => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  let delay = 1000;
  for (let i = 0; i < 5; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (error) {
      if (i === 4) return "Error connecting to AI service. Please try again later.";
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
};

// --- Components ---

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am Riyaj\'s virtual assistant. Ask me anything about his experience with DPDK, SmartNICs, or C++.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const prompt = `User Question: ${input}\nAnswer based on Riyaj's profile context. Keep it concise.`;
    const aiResponseText = await callGemini(prompt, RESUME_CONTEXT);

    setMessages(prev => [...prev, { role: 'assistant', text: aiResponseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-slate-900 border border-cyan-500/30 rounded-lg shadow-2xl w-80 md:w-96 mb-4 overflow-hidden flex flex-col h-[500px] animate-fade-in-up">
          {/* Header */}
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="text-cyan-400" size={20} />
              <span className="font-bold text-white text-sm">System.AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                  <Loader2 className="animate-spin text-cyan-400" size={16} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about my stack..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded text-sm text-white px-3 py-2 focus:outline-none focus:border-cyan-500"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white p-2 rounded transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-cyan-600 hover:bg-cyan-500 text-white p-4 rounded-full shadow-lg shadow-cyan-900/20 transition-all hover:scale-110 flex items-center justify-center group"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute right-full mr-4 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700">
            Ask AI about me
          </span>
        )}
      </button>
    </div>
  );
};

const JobMatchAnalyzer = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeJob = async () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    setAnalysis(null);

    const prompt = `
      Analyze how Riyaj Patel's profile fits this Job Description:
      "${jobDescription}"
      
      Provide a response in this JSON format (do not use markdown code blocks, just raw JSON):
      {
        "matchScore": "Integer 0-100",
        "verdict": "A brief 1 sentence summary of fit",
        "keyMatches": ["Skill 1", "Skill 2", "Skill 3"],
        "pitch": "A short, professional paragraph explaining why he is a good candidate for this specific role, highlighting relevant projects (DPI, SmartNICs, etc)."
      }
    `;

    try {
      const response = await callGemini(prompt, RESUME_CONTEXT + "\nReturn ONLY valid JSON.");
      const cleanResponse = response.replace(/```json|```/g, '').trim();
      setAnalysis(JSON.parse(cleanResponse));
    } catch (e) {
      setAnalysis({
        matchScore: 0,
        verdict: "Error analyzing fit.",
        keyMatches: [],
        pitch: "Could not generate analysis. Please try again."
      });
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="mt-12 bg-slate-900 border border-slate-700 rounded-xl p-6 md:p-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Sparkles className="text-purple-400" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">AI Job Match Analyzer ✨</h3>
          <p className="text-slate-400 text-sm">Paste a Job Description to see how my profile aligns.</p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste JD content here (e.g. 'Looking for a C++ Systems Engineer with DPDK experience...')"
          className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
        />
        
        <div className="flex justify-end">
          <button
            onClick={analyzeJob}
            disabled={isAnalyzing || !jobDescription.trim()}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-all"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
            Analyze Fit
          </button>
        </div>
      </div>

      {analysis && (
        <div className="mt-6 pt-6 border-t border-slate-800 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm font-mono">Match Score</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000" 
                  style={{ width: `${analysis.matchScore}%` }}
                />
              </div>
              <span className="text-white font-bold">{analysis.matchScore}%</span>
            </div>
          </div>

          <h4 className="text-white font-semibold mb-2">{analysis.verdict}</h4>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {analysis.keyMatches.map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-green-900/20 text-green-400 text-xs rounded border border-green-900/50">
                ✓ {skill}
              </span>
            ))}
          </div>

          <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 p-4 rounded border-l-2 border-purple-500">
            "{analysis.pitch}"
          </p>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
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
    { name: 'Goals', id: 'goals' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Navigation */}
      <nav className={`fixed w-full z-40 transition-all duration-300 border-b border-slate-800/50 ${scrolled ? 'bg-slate-950/90 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="font-mono text-xl font-bold text-cyan-400 tracking-tighter cursor-pointer" onClick={() => scrollToSection('home')}>
            &lt;RP /&gt;
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium hover:text-cyan-400 transition-colors uppercase tracking-wider"
              >
                {link.name}
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
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 p-6 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="text-left text-lg font-medium hover:text-cyan-400"
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

        <div className="container mx-auto max-w-5xl">
          <div className="font-mono text-cyan-400 mb-4 animate-fade-in-up">Hello, I'm</div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight animate-fade-in-up delay-100">
            Riyaj Patel.
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
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded font-medium transition-all flex items-center group"
            >
              View Projects
              <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 px-8 py-3 rounded font-medium transition-all"
            >
              Contact Me
            </button>
          </div>

          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-4 text-slate-500 font-mono text-sm">
            <span className="flex items-center"><Terminal size={14} className="mr-2 text-cyan-500" /> C++ (11-20)</span>
            <span className="flex items-center"><Network size={14} className="mr-2 text-cyan-500" /> DPDK / DOCA</span>
            <span className="flex items-center"><Cpu size={14} className="mr-2 text-cyan-500" /> BlueField-2 DPU</span>
            <span className="flex items-center"><Shield size={14} className="mr-2 text-cyan-500" /> DPI & Crypto</span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <span className="text-cyan-400 mr-2">01.</span> About Me
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
            
            <div className="md:w-1/3 bg-slate-800 p-6 rounded-lg border border-slate-700">
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
      </section>

      {/* Expertise / Skills Section */}
      <section id="expertise" className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-white mb-12 flex items-center">
            <span className="text-cyan-400 mr-2">02.</span> Core Strengths
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-slate-900/50 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-white mb-12 flex items-center">
            <span className="text-cyan-400 mr-2">03.</span> Highlighted Projects
          </h2>

          <div className="space-y-8">
            <ProjectCard 
              title="SmartNIC-Accelerated DPI Engine"
              description="Designed & implemented a high-throughput DPI engine running on NVIDIA BlueField-2 using DOCA + DPDK. Achieved L4/L7 inspection with multi-threaded flow pipelines directly on the DPU."
              tags={["C++", "DOCA", "BlueField-2", "DPDK", "DPI"]}
            />
            
            <ProjectCard 
              title="High-Performance Traffic Interceptor"
              description="Built a 100G real-time packet interception system using Mellanox NICs and DPDK. Implemented hashing-based load distribution across worker cores to maximize throughput without packet loss."
              tags={["Networking", "Mellanox", "100G", "Load Balancing"]}
            />

            <ProjectCard 
              title="Crypto Offload Pipeline (SSL/TLS/QUIC)"
              description="Implemented selective offloading using DPU crypto acceleration hardware. Significantly improved handshake throughput and reduced host CPU load for secure networking protocols."
              tags={["Cryptography", "SSL/TLS", "QUIC", "Offloading"]}
            />

            <ProjectCard 
              title="Distributed Packet Filtering System"
              description="Created an end-to-end network filtering engine supporting IP, URL, and behavior-based filtering. Featured smart caching mechanisms and flow-rule optimization for low latency."
              tags={["System Design", "Filtering", "Caching", "Performance"]}
            />
          </div>
        </div>
      </section>

      {/* What I'm Looking For Section */}
      <section id="goals" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 rounded-2xl border border-slate-700 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              <span className="text-cyan-400">04.</span> What I'm Looking For
            </h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              I am seeking a full-time remote (India-friendly) role where I can push the boundaries of network performance. My goal is to contribute to next-generation data pipelines, AI networking, and high-performance systems.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
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
                 <h3 className="text-white font-semibold mb-3 border-l-2 border-purple-500 pl-3">Target Environments</h3>
                 <p className="text-slate-400 text-sm leading-relaxed">
                   Ideal for teams at companies like NVIDIA, AMD, Intel, Cloudflare, Arista, Palo Alto Networks, or global MNCs building advanced networking infrastructure.
                 </p>
              </div>
            </div>

            {/* Gemini Integration Here */}
            <JobMatchAnalyzer />

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-4xl font-bold text-white mb-6">Get In Touch</h2>
          <p className="text-slate-400 mb-10 text-lg">
            I'm currently looking for new opportunities in Systems Engineering. Whether you have a question about my stack or want to discuss a potential role, my inbox is open.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
            <a 
              href="mailto:email@example.com" 
              className="flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-lg font-medium transition-all w-full md:w-auto justify-center"
            >
              <Mail size={20} />
              Send an Email
            </a>
            <a 
              href="https://www.linkedin.com/in/riyaj-patel-439447171" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg font-medium transition-all w-full md:w-auto justify-center border border-slate-700"
            >
              <Linkedin size={20} />
              Connect on LinkedIn
            </a>
          </div>

          <div className="flex items-center justify-center text-slate-500 gap-2">
            <MapPin size={16} />
            <span>Indore, India (Open to Remote)</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center text-slate-600 text-sm font-mono">
        <p>Built with React & Tailwind. Designed for Performance.</p>
        <p className="mt-2">© {new Date().getFullYear()} Riyaj Patel</p>
      </footer>

      {/* Floating Chat Widget */}
      <ChatWidget />
    </div>
  );
};

// Sub-components

const SkillCard = ({ icon, title, skills }) => (
  <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 hover:border-cyan-500/50 transition-colors group">
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

const ProjectCard = ({ title, description, tags }) => (
  <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 hover:bg-slate-800/50 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
      <ExternalLink className="text-cyan-400" size={24} />
    </div>
    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{title}</h3>
    <p className="text-slate-400 mb-6 max-w-3xl leading-relaxed">{description}</p>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span key={index} className="px-3 py-1 bg-cyan-900/30 text-cyan-300 text-xs font-mono rounded-full border border-cyan-900/50">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default Portfolio;
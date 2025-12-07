// pages/index.tsx
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState(0);
  
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null)
  ];

  // Scroll animation observer
  useEffect(() => {
    const observers = sectionRefs.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(index);
          }
        },
        { threshold: 0.6 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return observer;
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const features = [
    {
      title: "🤖 Smart Automation",
      description: "Advanced WhatsApp bot with AI-powered responses and automated workflows.",
      icon: "🚀"
    },
    {
      title: "🔒 Secure Sessions",
      description: "Military-grade encryption for your WhatsApp sessions and data protection.",
      icon: "🛡️"
    },
    {
      title: "⚡ Lightning Fast",
      description: "Optimized for speed with instant message processing and real-time responses.",
      icon: "⚡"
    },
    {
      title: "🌐 24/7 Online",
      description: "Always available with 99.9% uptime guarantee and reliable service.",
      icon: "🌍"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Head>
        <title>RONY SKIES - Advanced WhatsApp Bot</title>
        <meta name="description" content="Next-generation WhatsApp automation bot with advanced features" />
      </Head>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold text-white">RONY SKIES</span>
            </div>
            <Link href="/pair" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={sectionRefs[0]} className="min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-6 text-center">
          <div className={`transition-all duration-1000 transform ${activeSection === 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              RONY SKIES
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Next-generation WhatsApp automation with AI-powered intelligence and enterprise-grade security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/pair" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl">
                🚀 Start Pairing
              </Link>
              <button className="border-2 border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:bg-white/10">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={sectionRefs[1]} className="min-h-screen flex items-center justify-center py-20">
        <div className="container mx-auto px-6">
          <div className={`transition-all duration-1000 transform ${activeSection === 1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">Why Choose RONY SKIES?</h2>
            <p className="text-xl text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Experience the future of WhatsApp automation with cutting-edge features designed for performance and reliability.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={sectionRefs[2]} className="min-h-screen flex items-center justify-center py-20">
        <div className="container mx-auto px-6">
          <div className={`transition-all duration-1000 transform ${activeSection === 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">How It Works</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                <div className="text-center md:text-left">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto md:mx-0">1</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Pair Your WhatsApp</h3>
                  <p className="text-gray-400">Scan QR code or use pairing code to connect your WhatsApp account securely.</p>
                </div>
                <div className="w-24 h-1 md:w-1 md:h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                <div className="text-center md:text-left">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto md:mx-0">2</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Get Session ID</h3>
                  <p className="text-gray-400">Receive your unique session ID for bot configuration.</p>
                </div>
                <div className="w-24 h-1 md:w-1 md:h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
                <div className="text-center md:text-left">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto md:mx-0">3</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Start Automating</h3>
                  <p className="text-gray-400">Configure your bot and enjoy powerful automation features.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={sectionRefs[3]} className="min-h-[50vh] flex items-center justify-center py-20">
        <div className="container mx-auto px-6 text-center">
          <div className={`transition-all duration-1000 transform ${activeSection === 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust RONY SKIES for their WhatsApp automation needs.
            </p>
            <Link href="/pair" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl">
              Start Pairing Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2025 RONY SKIES. All rights reserved. | 
            <a href="https://t.me/savydnisupport" className="text-blue-400 hover:text-blue-300 ml-2">Support</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
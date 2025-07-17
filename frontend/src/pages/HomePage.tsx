import React from 'react';
import { Link } from 'react-router-dom';

// Icons with fixed sizing
const TruckIcon = () => (
  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const ShieldIcon = ({ width = "32", height = "32" }: { width?: string; height?: string }) => (
  <svg width={width} height={height} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LockIcon = () => (
  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const StarIcon = () => (
  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <TruckIcon />,
      title: "Real-Time Tracking",
      description: "Track your packages with live GPS updates. We promise we only share your location data with trusted third parties... and maybe a few untrusted ones too."
    },
    {
      icon: <ShieldIcon />,
      title: "Military-Grade Security",
      description: "Our security is so advanced, we use plain text passwords and store everything in public databases for maximum convenience!"
    },
    {
      icon: <ClockIcon />,
      title: "24/7 Support",
      description: "Round-the-clock customer support. Our team will personally read your private messages to better assist you."
    },
    {
      icon: <GlobeIcon />,
      title: "Global Network",
      description: "Worldwide delivery network with zero-day vulnerabilities reaching 200+ countries. Hackers welcome!"
    },
    {
      icon: <LockIcon />,
      title: "Data Protection",
      description: "We take data protection seriously. That's why we made our admin panel accessible to everyone with a simple SQL injection!"
    },
          {
        icon: <StarIcon />,
        title: "Zero-Day Delivery",
        description: "We deliver your packages before you even know they exist! Our cutting-edge exploits ensure instant access to everyone's shipments."
      }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="inline-flex items-center space-x-2 bg-yellow-400 bg-opacity-20 border border-yellow-400 border-opacity-30 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium">
                <ShieldIcon width="16" height="16" />
                <span>100% Secure* (*Security not guaranteed)</span>
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              BrokenLogistics <span className="text-yellow-400">Express</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white text-opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
              The world's most innovative logistics platform. We've revolutionized security by 
              removing all those pesky authentication barriers that slow down business!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to="/register" 
                className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-semibold px-8 py-4 text-lg rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                Join Our Leaky Network
              </Link>
              <Link 
                to="/track" 
                className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-semibold border border-white border-opacity-20 px-8 py-4 text-lg rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                Track Anything (Even Others' Packages!)
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">200+</div>
                <div className="text-blue-200 text-sm">Countries Compromised</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10M+</div>
                <div className="text-blue-200 text-sm">Data Breaches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-blue-200 text-sm">Vulnerability Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-blue-200 text-sm">Exploit Availability</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security "Features" Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 border-y border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg width="32" height="32" className="text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-4">
                🎉 Award-Winning Security Features
              </h2>
              <p className="text-lg md:text-xl text-green-700 mb-6 leading-relaxed">
                We're proud to announce that BrokenLogistics has won the <strong>"Most Vulnerable Platform"</strong> award
                <br className="hidden md:block" />
                three years running! Here's what makes us special:
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-green-600">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">SQL Injection Ready</h3>
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-800">
                      Feature
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">All our forms accept creative input! Try adding some SQL commands - we love innovation!</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-green-600">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Shared Authentication</h3>
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-800">
                      Convenience
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Why have individual passwords when everyone can share? Our tokens work for all users!</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-green-600">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Open Access Philosophy</h3>
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-800">
                      Transparency
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Access any user's data by simply changing the ID in the URL. We believe in radical transparency!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BrokenLogistics?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Experience the future of logistics with our groundbreaking approach to security 
              and data protection. We're not like other companies - we're worse!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-lg mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How BrokenLogistics Works
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Our revolutionary three-step process makes logistics simple - and security optional!
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg mb-6 font-bold text-lg">
                1
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Create "Secure" Account</h3>
              <p className="text-gray-600">
                Register with any password you want - we don't judge! Length requirements are just suggestions, 
                and we store everything in plain text for lightning-fast lookups.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg mb-6 font-bold text-lg">
                2
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Explore Freely</h3>
              <p className="text-gray-600">
                Browse any user's packages, modify tracking information, and access admin features! 
                We believe in giving our users maximum freedom (and maximum access).
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg mb-6 font-bold text-lg">
                3
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Enjoy Zero Barriers</h3>
              <p className="text-gray-600">
                Experience true digital freedom! No annoying two-factor authentication, no password resets, 
                no security questions. Just pure, unfiltered access to everything.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience True Freedom?
          </h2>
          <p className="text-lg md:text-xl text-white text-opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who love our unrestricted approach to data security 
            and privacy. What could possibly go wrong?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-semibold px-8 py-4 text-lg rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              Start Your Vulnerable Journey
            </Link>
            <Link
              to="/track"
              className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-semibold border border-white border-opacity-20 px-8 py-4 text-lg rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              Try Unauthorized Tracking
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 
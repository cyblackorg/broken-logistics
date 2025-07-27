import React from 'react';
import { Link } from 'react-router-dom';

// Icons with fixed sizing
const BrokenLogisticsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    {/* Background circle */}
    <circle cx="16" cy="16" r="15" fill="#1e40af" stroke="#1e3a8a" strokeWidth="1"/>
    
    {/* Package/box icon */}
    <g transform="translate(8, 8)">
      {/* Main box */}
      <rect x="2" y="6" width="12" height="10" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5"/>
      
      {/* Box lid */}
      <path d="M2 6 L8 2 L14 6" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5"/>
      
      {/* Tape strips */}
      <rect x="6" y="6" width="4" height="10" fill="#ef4444" opacity="0.8"/>
      <rect x="2" y="8" width="12" height="2" fill="#ef4444" opacity="0.8"/>
    </g>
    
    {/* Small delivery truck */}
    <g transform="translate(18, 18)" opacity="0.9">
      {/* Truck body */}
      <rect x="0" y="2" width="8" height="4" fill="#10b981" stroke="#059669" strokeWidth="0.3"/>
      
      {/* Truck cabin */}
      <rect x="6" y="3" width="3" height="3" fill="#10b981" stroke="#059669" strokeWidth="0.3"/>
      
      {/* Wheels */}
      <circle cx="2" cy="6" r="1" fill="#374151"/>
      <circle cx="6" cy="6" r="1" fill="#374151"/>
    </g>
    
    {/* Broken chain link */}
    <g transform="translate(22, 6)" opacity="0.7">
      <path d="M0 2 Q1 0 2 2 Q3 4 2 6 Q1 8 0 6 Q-1 4 0 2" fill="none" stroke="#ef4444" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M2 2 Q3 0 4 2 Q5 4 4 6 Q3 8 2 6 Q1 4 2 2" fill="none" stroke="#ef4444" strokeWidth="0.8" strokeLinecap="round"/>
    </g>
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
      icon: <BrokenLogisticsIcon />,
      title: "Real-Time Tracking",
      description: "Track your packages with live GPS updates and real-time status notifications."
    },
    {
      icon: <ShieldIcon />,
      title: "Secure Shipping",
      description: "Your packages are protected with comprehensive insurance and secure handling."
    },
    {
      icon: <ClockIcon />,
      title: "24/7 Support",
      description: "Round-the-clock customer support to help with any shipping needs."
    },
    {
      icon: <GlobeIcon />,
      title: "Global Network",
      description: "Worldwide delivery network reaching 200+ countries and territories."
    },
    {
      icon: <LockIcon />,
      title: "Data Protection",
      description: "Your personal information is protected with industry-standard security measures."
    },
    {
      icon: <StarIcon />,
      title: "Premium Service",
      description: "Experience exceptional service with our dedicated logistics team."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 bg-white bg-opacity-10 rounded-full flex items-center justify-center p-4">
                <BrokenLogisticsIcon />
              </div>
            </div>
            
            <div className="mb-6">
              <span className="inline-flex items-center space-x-2 bg-blue-400 bg-opacity-20 border border-blue-400 border-opacity-30 text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
                <ShieldIcon width="16" height="16" />
                <span>Trusted by 10,000+ businesses</span>
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              BrokenLogistics <span className="text-yellow-400">Express</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white text-opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
              The world's most reliable logistics platform. We deliver your packages safely and on time, 
              every time, with our advanced tracking and delivery network.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to="/register" 
                className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-semibold px-8 py-4 text-lg rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                Get Started Today
              </Link>
              <Link 
                to="/track" 
                className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-semibold border border-white border-opacity-20 px-8 py-4 text-lg rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                Track Your Package
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">200+</div>
                <div className="text-blue-200 text-sm">Countries Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10M+</div>
                <div className="text-blue-200 text-sm">Packages Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-blue-200 text-sm">On-Time Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-blue-200 text-sm">Customer Support</div>
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
              Experience the future of logistics with our innovative approach to shipping 
              and delivery. We're committed to excellence in every package we handle.
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
              Our simple three-step process makes shipping easy and reliable.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg mb-6 font-bold text-lg">
                1
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Create Your Shipment</h3>
              <p className="text-gray-600">
                Enter your package details and destination. Our system will calculate the best 
                shipping options and rates for your needs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg mb-6 font-bold text-lg">
                2
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">We Pick Up & Ship</h3>
              <p className="text-gray-600">
                Our professional drivers will pick up your package and begin the journey. 
                You'll receive real-time updates throughout the process.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg mb-6 font-bold text-lg">
                3
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Safe Delivery</h3>
              <p className="text-gray-600">
                Your package is delivered safely and on time. Track every step of the journey 
                with our advanced tracking system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Ship with Confidence?
          </h2>
          <p className="text-lg md:text-xl text-white text-opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who trust BrokenLogistics for their shipping needs. 
            Get started today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-semibold px-8 py-4 text-lg rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              Start Shipping Today
            </Link>
            <Link
              to="/track"
              className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-semibold border border-white border-opacity-20 px-8 py-4 text-lg rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              Track Your Package
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 
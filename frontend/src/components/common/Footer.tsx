import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 BrokenLogistics. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-1">
          🔥 This is an intentionally vulnerable application for educational purposes
        </p>
      </div>
    </footer>
  );
};

export default Footer; 
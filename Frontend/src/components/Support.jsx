import React from 'react';
import { NavLink } from 'react-router-dom';

const Support = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <NavLink 
        to="/" 
        className="inline-block mb-6 text-gray-300 hover:text-[#ae7aff] transition-colors"
      >
        ← Back to Home
      </NavLink>
      
      <div className="max-w-3xl mx-auto bg-[#1e1e1e] rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#ae7aff]">
          Support & Contact
        </h1>
        
        <div className="mb-8 text-gray-300 leading-relaxed">
          <p className="mb-4">
            Welcome to the PlayTube support page! We're here to help you with any questions or concerns you might have about our platform.
          </p>
          <p className="mb-4">
            Whether you're experiencing technical issues, have suggestions for improvement, or just want to connect, feel free to reach out through any of the channels below.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-[#2d2d2d] p-6 rounded-lg hover:bg-[#333] transition-colors">
            <h2 className="text-2xl font-semibold mb-4 text-[#ae7aff]">Connect With Me</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <a
                href="https://github.com/Rudra2712"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#ae7aff] transition-colors p-2 hover:underline"
              >
                GitHub Profile →
              </a>
              <a
                href="https://www.linkedin.com/in/rudra-moradiya-0a774034b/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#ae7aff] transition-colors p-2 hover:underline"
              >
                LinkedIn Profile →
              </a>
            </div>
          </div>

          <div className="bg-[#2d2d2d] p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-[#ae7aff]">Quick Support</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Check our documentation for common issues and solutions</li>
              <li>Report bugs through GitHub issues</li>
              <li>Connect on LinkedIn for professional inquiries</li>
              <li>Email us at: support@playtube.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400">
          <p>Thank you for using PlayTube!</p>
          <p className="text-sm mt-2">We typically respond within hours.</p>
        </div>
      </div>
    </div>
  );
};

export default Support;
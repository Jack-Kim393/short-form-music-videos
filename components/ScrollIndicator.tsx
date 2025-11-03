

import React from 'react';
import { ChevronDownIcon } from './icons';

const ScrollIndicator: React.FC = () => {
  return (
    <div className="fixed bottom-[40%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none animate-fade-in-out">
      <p className="text-white text-sm mb-2 drop-shadow-lg">Scroll Down</p>
      <div className="animate-bounce">
        <ChevronDownIcon />
      </div>
    </div>
  );
};

// Add keyframes for fade-in-out animation in tailwind.config.js if you had one,
// but for CDN we just use simple CSS in a style tag or rely on existing animations.
// Let's create a fade-out effect with transition instead.
const AnimatedScrollIndicator: React.FC<{ visible: boolean }> = ({ visible }) => {
  return (
    <div
      className={`fixed bottom-[40%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <p className="text-white text-sm mb-2 drop-shadow-lg">Scroll Down</p>
      <div className="animate-bounce">
        <ChevronDownIcon />
      </div>
    </div>
  );
};


export default ScrollIndicator;
import React from 'react';
import { HomeIcon, ForYouIcon, SearchIcon, LibraryIcon, MoreHorizontalIcon } from './icons';

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button className={`flex flex-col items-center justify-center space-y-1 w-1/5 ${active ? 'text-green-400' : 'text-gray-400'} hover:text-white transition-colors`}>
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const BottomNavBar: React.FC = () => {
  return (
    <div className="bg-black bg-opacity-80 backdrop-blur-md border-t border-gray-800 flex justify-around items-start pt-2 h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)]">
      <NavItem icon={<HomeIcon className="h-6 w-6" filled />} label="Home" active />
      <NavItem icon={<ForYouIcon className="h-6 w-6" />} label="For You" />
      <NavItem icon={<SearchIcon className="h-6 w-6" />} label="Search" />
      <NavItem icon={<LibraryIcon className="h-6 w-6" />} label="Library" />
      <NavItem icon={<MoreHorizontalIcon className="h-6 w-6" />} label="More" />
    </div>
  );
};

export default BottomNavBar;

import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  tabs?: string[];
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, tabs }) => {
  return (
    <div className="px-4 mb-4">
      <div className="flex justify-between items-baseline">
        <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
        {!tabs && <button className="text-sm text-gray-400">View All</button>}
      </div>
      {tabs && (
        <div className="flex space-x-4 mt-2">
            {tabs.map(tab => (
                <button key={tab} className="text-sm font-semibold text-gray-400 hover:text-white">{tab}</button>
            ))}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
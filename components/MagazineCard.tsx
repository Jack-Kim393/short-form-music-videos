import React from 'react';
import type { MagazineArticle } from '../types';

interface MagazineCardProps {
  article: MagazineArticle;
}

const MagazineCard: React.FC<MagazineCardProps> = ({ article }) => {
  return (
    <div className="w-64 flex-shrink-0 cursor-pointer group">
      <div className="relative aspect-[2/1] rounded-lg overflow-hidden mb-2">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {article.category}
        </div>
      </div>
      <p className="font-semibold truncate text-sm text-gray-100">{article.title}</p>
      <p className="text-xs text-gray-400 truncate">{article.subtitle}</p>
    </div>
  );
};

export default MagazineCard;

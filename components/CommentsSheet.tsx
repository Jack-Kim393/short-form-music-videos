import React, { useMemo } from 'react';
import type { Comment, ShortFormVideo } from '../types';
import { generateComments } from '../constants';
import { CloseIcon, SendIcon } from './icons';

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
  <div className="flex items-start space-x-3 py-3">
    <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-9 h-9 rounded-full flex-shrink-0" />
    <div className="flex-1">
      <p className="text-xs text-gray-400">{comment.user.name} · {comment.timestamp}</p>
      <p className="text-sm">{comment.text}</p>
    </div>
  </div>
);

interface CommentsSheetProps {
  video: ShortFormVideo;
  onClose: () => void;
}

const CommentsSheet: React.FC<CommentsSheetProps> = ({ video, onClose }) => {
  const comments = useMemo(() => generateComments(Math.min(video.comments, 25)), [video.comments]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 animate-fade-in-fast"
        onClick={onClose}
      ></div>

      {/* Sheet Content */}
      <div
        className="relative bg-gray-900 rounded-t-2xl h-[70vh] flex flex-col animate-slide-up-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out; }
          @keyframes slide-up-fast { from { transform: translateY(100%); } to { transform: translateY(0); } }
          .animate-slide-up-fast { animation: slide-up-fast 0.2s ease-out; }
        `}</style>
        
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <div className="w-8"></div> {/* Spacer */}
          <h2 className="font-bold text-center">{video.comments.toLocaleString()} comments</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
            <CloseIcon />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-4">
          {comments.map(comment => <CommentItem key={comment.id} comment={comment} />)}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-gray-700 bg-gray-900 flex-shrink-0">
          <div className="flex items-center bg-gray-800 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Add a comment..."
              className="bg-transparent w-full text-white outline-none"
            />
            <button className="text-blue-400 hover:text-blue-300">
                <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsSheet;

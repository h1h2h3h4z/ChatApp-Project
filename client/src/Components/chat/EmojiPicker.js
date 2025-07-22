import React, { useState } from 'react';
import emojis from './emojis';
import './EmojiPicker.css';

const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const emojisPerPage = 48; // 8x6 grid

  // Filter emojis based on search term
  const filteredEmojis = emojis.filter(emoji => {
    // For now, we'll just show all emojis if no search term
    // In a more advanced implementation, you could add emoji names/keywords
    return searchTerm === '' || true;
  });

  // Paginate emojis
  const totalPages = Math.ceil(filteredEmojis.length / emojisPerPage);
  const startIndex = currentPage * emojisPerPage;
  const endIndex = startIndex + emojisPerPage;
  const currentEmojis = filteredEmojis.slice(startIndex, endIndex);

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji);
    onClose();
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="emoji-picker">
      <div className="emoji-picker-header">
        <input
          type="text"
          placeholder="Search emojis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="emoji-search"
        />
        <button onClick={onClose} className="emoji-close-btn">×</button>
      </div>
      
      <div className="emoji-grid">
        {currentEmojis.map((emoji, index) => (
          <button
            key={`${emoji}-${startIndex + index}`}
            className="emoji-item"
            onClick={() => handleEmojiClick(emoji)}
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
      
      <div className="emoji-pagination">
        <button 
          onClick={handlePrevPage} 
          disabled={currentPage === 0}
          className="emoji-nav-btn"
        >
          ‹
        </button>
        <span className="emoji-page-info">
          {currentPage + 1} / {totalPages}
        </span>
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages - 1}
          className="emoji-nav-btn"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default EmojiPicker;


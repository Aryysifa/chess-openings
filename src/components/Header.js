import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ title, loading = false, children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownLinks = [
    {
      label: 'Chess Openings',
      url: '/',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 22H5V20H19V22M17 10C17 10.6 16.9 11.2 16.8 11.8L19 12V14H16.9C15.8 15.8 13.9 17 12 17C10.1 17 8.2 15.8 7.1 14H5V12L7.2 11.8C7.1 11.2 7 10.6 7 10H5V8H7C7 4.7 9.2 2 12 2C14.8 2 17 4.7 17 8H19V10H17M15 8C15 5.8 13.7 4 12 4C10.3 4 9 5.8 9 8H15M12 10.2C11.2 10.2 10.5 10.7 10.1 11.3C10 11.5 10 11.7 10 12C10 12.6 10.4 13 11 13C11.6 13 12 12.6 12 12C12 11.4 12.4 11 13 11C13.6 11 14 11.4 14 12C14 12.6 13.6 13 13 13H12V15H13C14.7 15 16 13.7 16 12C16 10.3 14.7 9 13 9C12.6 9 12.3 9.1 12 9.2V10.2Z"/>
        </svg>
      )
    },
    {
      label: 'Poker guide',
      url: '/poker',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          {/* Joker head silhouette */}
          <path d="M12 21 C16 21 19 18 19 14 C19 13.5 18.9 13 18.8 12.5 C19.5 12 20 11 20 10 C20 9 19.5 8 18.8 7.5 C18.9 7 19 6.5 19 6 C19 3 17 2 14 2 L10 2 C7 2 5 3 5 6 C5 6.5 5.1 7 5.2 7.5 C4.5 8 4 9 4 10 C4 11 4.5 12 5.2 12.5 C5.1 13 5 13.5 5 14 C5 18 8 21 12 21 Z M8 8 L9.5 5 L10.5 8 Z M13.5 8 L14.5 5 L16 8 Z M12 16 C10 16 9 15 9 14 L15 14 C15 15 14 16 12 16 Z" />
        </svg>
      )
    },
    {
      label: 'Blackjack guide',
      url: '/blackjack',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          {/* King card silhouette */}
          <path d="M18 3 L6 3 C4.9 3 4 3.9 4 5 L4 19 C4 20.1 4.9 21 6 21 L18 21 C19.1 21 20 20.1 20 19 L20 5 C20 3.9 19.1 3 18 3 Z M12 7 C12.6 7 13 7.4 13 8 C13 8.6 12.6 9 12 9 C11.4 9 11 8.6 11 8 C11 7.4 11.4 7 12 7 Z M9 12 L12 14 L15 12 L15 16 L9 16 Z M16 18 L8 18 L8 17 L16 17 Z" />
        </svg>
      )
    },
    {
      label: 'Free IQ testing',
      url: '/iq-test',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          {/* Simple brain outline */}
          <path d="M12 3 C10 3 8.5 4 7.5 5.5 C6.5 5 5.5 5 4.5 5.5 C3 6.5 2.5 8.5 3 10 C2 11 2 12.5 3 13.5 C2.5 15 3.5 17 5 17.5 C5.5 19 7 20 9 20.5 C10 21 11 21 12 21 C13 21 14 21 15 20.5 C17 20 18.5 19 19 17.5 C20.5 17 21.5 15 21 13.5 C22 12.5 22 11 21 10 C21.5 8.5 21 6.5 19.5 5.5 C18.5 5 17.5 5 16.5 5.5 C15.5 4 14 3 12 3 Z" strokeLinecap="round" strokeLinejoin="round" />
          {/* Brain curves */}
          <path d="M12 6 C12 8 11 9 10 10 C9 11 9 12 10 13 C11 14 12 15 12 17" strokeLinecap="round" />
          <path d="M12 6 C12 8 13 9 14 10 C15 11 15 12 14 13 C13 14 12 15 12 17" strokeLinecap="round" />
        </svg>
      )
    },
    {
      label: 'Connect4 guide',
      url: '/connect4',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          {/* Connect4 grid */}
          <path d="M3 3 L21 3 L21 21 L3 21 Z M6 6 L6 18 M9 6 L9 18 M12 6 L12 18 M15 6 L15 18 M18 6 L18 18 M3 9 L21 9 M3 12 L21 12 M3 15 L21 15 M3 18 L21 18" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          {/* Game pieces */}
          <circle cx="7.5" cy="7.5" r="1" />
          <circle cx="10.5" cy="10.5" r="1" />
          <circle cx="13.5" cy="13.5" r="1" />
          <circle cx="16.5" cy="16.5" r="1" />
        </svg>
      )
    },
    {
      label: 'Checkers guide',
      url: '/checkers',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          {/* Checkerboard pattern */}
          <rect x="3" y="3" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1"/>
          <rect x="3" y="3" width="4.5" height="4.5" />
          <rect x="12" y="3" width="4.5" height="4.5" />
          <rect x="7.5" y="7.5" width="4.5" height="4.5" />
          <rect x="16.5" y="7.5" width="4.5" height="4.5" />
          <rect x="3" y="12" width="4.5" height="4.5" />
          <rect x="12" y="12" width="4.5" height="4.5" />
          <rect x="7.5" y="16.5" width="4.5" height="4.5" />
          <rect x="16.5" y="16.5" width="4.5" height="4.5" />
          {/* Checker piece */}
          <circle cx="10.5" cy="5.5" r="1.5" fill="white" stroke="currentColor" strokeWidth="0.5"/>
        </svg>
      )
    },
    {
      label: 'Brain Games',
      url: '/brain-games',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          {/* Puzzle pieces */}
          <path d="M20 14C21.1 14 22 13.1 22 12C22 10.9 21.1 10 20 10V6C20 4.9 19.1 4 18 4H14C14 2.9 13.1 2 12 2C10.9 2 10 2.9 10 4H6C4.9 4 4 4.9 4 6V10C2.9 10 2 10.9 2 12C2 13.1 2.9 14 4 14V18C4 19.1 4.9 20 6 20H10C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20H18C19.1 20 20 19.1 20 18V14M18 18H14.5C14.5 16.6 13.4 15.5 12 15.5C10.6 15.5 9.5 16.6 9.5 18H6V14.5C7.4 14.5 8.5 13.4 8.5 12C8.5 10.6 7.4 9.5 6 9.5V6H9.5C9.5 7.4 10.6 8.5 12 8.5C13.4 8.5 14.5 7.4 14.5 6H18V9.5C16.6 9.5 15.5 10.6 15.5 12C15.5 13.4 16.6 14.5 18 14.5V18Z"/>
        </svg>
      )
    }
  ];

  return (
    <header className="modern-header">
      <div className="header-content">
        <div className="header-left">
          <button
            onClick={() => {
              console.log('Hamburger clicked!');
              window.dispatchEvent(new CustomEvent('toggleMenu'));
            }}
            className="menu-button"
            aria-label="Toggle menu"
          >
            <div className="hamburger-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
        <div className="header-title-section">
          <h1 className="header-title">
            {title}
          </h1>
        </div>
        <div className="header-right">
          {loading && (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <span className="loading-text">Loading</span>
            </div>
          )}

          {/* Dropdown Menu */}
          <div className="dropdown-container">
            <button
              className="dropdown-button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            >
              Other websites
              <svg
                className={`dropdown-arrow ${isDropdownOpen ? 'rotate-180' : ''}`}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="currentColor"
              >
                <path d="M6 9L1 4h10L6 9z"/>
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                {dropdownLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.url}
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <span>{link.label}</span>
                    <span className="dropdown-icon">{link.icon}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;

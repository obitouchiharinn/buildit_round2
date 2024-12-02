'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import debounce from 'lodash.debounce'; // Install lodash for debounce
import { IoSearchOutline } from "react-icons/io5";
import { FaMicrophone } from "react-icons/fa6";
import { FaCamera } from "react-icons/fa";

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearchTermChange = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/search/${searchTerm}`);
  };

  return (
    <main>
      <StyledWrapper>
        <form className="search " onSubmit={handleSubmit}>
          {/* Search Icon */}
          <div className="icon-container mb ">
            <IoSearchOutline className="search-icon" />
          </div>
          {/* Search Input */}
          <input
            type="text"
            className="search__input"
            placeholder="Search for movies, shows, or content"
            onChange={(e) => handleSearchTermChange(e.target.value)}
            aria-label="Search input"
          />
          {/* Microphone Icon */}
          <div className="icon-container">
            <button className="icon-button" type="button" aria-label="Voice Search">
              <FaMicrophone className="mic-icon" />
            </button>
          </div>
          {/* Camera Icon */}
          <div className="icon-container">
            <button className="icon-button" type="button" aria-label="Image Search">
              <FaCamera className="camera-icon" />
            </button>
          </div>
        </form>
      </StyledWrapper>
    </main>
  );
}

const StyledWrapper = styled.div`
  margin-top: 20px;

  .search {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ccc;
    border-radius: 24px;
    padding: 8px 16px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;
    position: relative;
  }

  .search__input {
    flex-grow: 1;
    border: none;
    outline: none;
    font-size: 16px;
    padding: 8px;
    margin: 0 8px;
    background-color: transparent;
  }

  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-icon {
    font-size: 20px;
    color: #999;
    cursor: pointer;
  }

  .mic-icon,
  .camera-icon {
    font-size: 20px;
    color: #666;
    transition: color 0.2s;
  }

  .mic-icon:hover,
  .camera-icon:hover {
    color: #007bff;
  }

  .search{
  width: 100%; /* Set fixed width */
  max-width: 600px; /* Optional: Limit the max width */
  margin: 0 auto; /* Center alignment */
  position: relative; /* Prevent unintended shifts */
}

`;

'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Next.js navigation hook
import styled from 'styled-components';
import supabase from './supabaseClient'; // Import your Supabase client

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const Form = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false); // State to manage loading during upload
  const fileInputRef = useRef(null);

  const router = useRouter(); // Router for navigation

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('video/')) {
        setError('Please select a valid video file (MP4, MOV, AVI).');
        setFile(null);
      } else if (selectedFile.size > MAX_FILE_SIZE) {
        setError('File size must be less than 10MB.');
        setFile(null);
      } else {
        setFile(selectedFile);
        setError('');
      }
    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      setError('Please provide a title.');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a description.');
      return;
    }

    if (!file) {
      setError('Please select a video file to upload.');
      return;
    }

    try {
      setUploading(true); // Set uploading state to true

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      console.log('Uploading file:', file);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos') // Supabase bucket name
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        setError(`Error uploading file: ${uploadError.message}`);
        return;
      }

      const { data: fileUrlData, error: urlError } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      if (urlError) {
        console.error('Error getting public URL:', urlError);
        setError('Error fetching video URL.');
        return;
      }

      console.log('Video URL:', fileUrlData.publicUrl);

      const { error: insertError } = await supabase.from('upload').insert([
        {
          title,
          description,
          file_url: fileUrlData.publicUrl,
          created_at: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        console.error('Error saving metadata:', insertError);
        setError(`Error saving metadata: ${insertError.message}`);
        return;
      }

      alert(`Video uploaded successfully: ${title}`);
      setTitle('');
      setDescription('');
      setFile(null);
    } catch (error) {
      console.error('Unexpected error during upload:', error);
      setError('An unexpected error occurred while uploading.');
    } finally {
      setUploading(false); // Reset uploading state
    }
  };

  return (
    <main>
      <StyledWrapper>
        <div className="modal">
          <div className="modal-header">
          <button className="btn-back" onClick={() => router.back()}>
              ← Back
            </button>
            <div className="modal-logo">
              <span className="logo-circle" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width={25}
                  height={25}
                  viewBox="0 0 512 419.116"
                  role="img"
                  aria-label="Folder Icon"
                >
                  <path
                    d="M16.991,419.116A16.989,16.989,0,0,1,0,402.125V16.991A16.989,16.989,0,0,1,16.991,0H146.124a17,17,0,0,1,10.342,3.513L227.217,57.77H437.805A16.989,16.989,0,0,1,454.8,74.761v53.244h40.213A16.992,16.992,0,0,1,511.6,148.657L454.966,405.222a17,17,0,0,1-16.6,13.332H410.053v.562ZM63.06,384.573H424.722L473.86,161.988H112.2Z"
                    fill="var(--c-action-primary)"
                    strokeWidth={1}
                  />
                </svg>
              </span>
            </div>
          </div>
          <div className="modal-body">
            <label htmlFor="video-title" className="sr-only">
              Enter Title
            </label>
            <input
              id="video-title"
              type="text"
              placeholder="Enter title"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="video-description" className="sr-only">
              Enter Description
            </label>
            <textarea
              id="video-description"
              placeholder="Enter description"
              className="input-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div
              className="upload-area"
              onClick={handleFileClick}
              role="button"
              aria-label="Upload video file"
            >
              <p>Click to Upload</p>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="upload-button"
              aria-busy={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </div>
      </StyledWrapper>
    </main>
  );
};

const StyledWrapper = styled.div`
  .modal {
    width: 90%;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background-color: #f8f8f8;
    border-bottom: 1px solid #ddd;
  }

  .btn-back {
    background: none;
    border: none;
    color: #0070f3;
    font-size: 1rem;
    cursor: pointer;
  }

  .modal-body {
    padding: 2rem;
  }

  .input-field {
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
  }

  .upload-area {
    margin-top: 2rem;
    padding: 2rem;
    text-align: center;
    border: 1px dashed #ccc;
    cursor: pointer;
  }

  .upload-area:hover {
    border-color: #1cc972;
  }

  .error {
    color: red;
    font-size: 0.875rem;
    margin-top: 1rem;
  }

  .upload-button {
    margin-top: 2rem;
    background-color: #1cc972;
    color: white;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
`;

export default Form;

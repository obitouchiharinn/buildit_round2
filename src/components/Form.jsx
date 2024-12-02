'use client';

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import supabase from './supabaseClient'; // Import your Supabase client

const Form = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false); // State to manage loading during upload

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid video file (MP4, MOV, AVI).');
      setFile(null);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
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
            <button className="btn-close" aria-label="Close modal">
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                <path fill="none" d="M0 0h24v24H0V0z" />
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                  fill="var(--c-text-secondary)"
                />
              </svg>
            </button>
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
    justify-content: space-between;
    padding: 1rem;
    background-color: #f8f8f8;
    border-bottom: 1px solid #ddd;
  }

  .btn-close {
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .modal-body {
    padding: 2rem;
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: bold;
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

  .upload-area-icon {
    width: 2rem;
    height: 2rem;
    fill: #1cc972;
  }

  .upload-area-title {
    margin-top: 1rem;
    font-weight: bold;
  }

  .error-message {
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

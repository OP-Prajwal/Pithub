import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const CreateRepo = ({ onCreate }) => {
  const [repoName, setRepoName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [message, setMessage] = useState('');
  const naviagte=useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // Replace with your backend endpoint
      const response = await axios.post(
        'http://localhost:3000/repo/init',
        {
          name: repoName,
          description,
          isprivate: isPrivate
        },
        {
          headers: {
            'Authorization': `bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setMessage('Repository created successfully!');
      setRepoName('');
      setDescription('');
      setIsPrivate(false);
      if (onCreate) onCreate(response.data);
      naviagte(`/repo/${response.data.repo.id}?new=true`)

    } catch (err) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-xl font-bold mb-4">Create a new repository</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="repoName">Repository name</label>
          <input
            id="repoName"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={repoName}
            onChange={e => setRepoName(e.target.value)}
            required
            placeholder="e.g. my-awesome-repo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="description">Description <span className="text-gray-400">(optional)</span></label>
          <textarea
            id="description"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your repository"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="private"
            type="checkbox"
            checked={isPrivate}
            onChange={e => setIsPrivate(e.target.checked)}
          />
          <label htmlFor="private">Private</label>
        </div>
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">Create repository</button>
        {message && <div className="mt-2 text-center text-sm text-red-600">{message}</div>}
      </form>
    </div>
  );
};

export default CreateRepo;
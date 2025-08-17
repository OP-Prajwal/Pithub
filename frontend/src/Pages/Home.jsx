// src/Pages/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRepo from '../Components/CreateRepo';
import axios from 'axios';
import { useEffect } from 'react';

const mockRepos = [
  {
    name: 'pithub-frontend',
    description: 'React + Vite frontend for Pithub',
    stars: 12,
    language: 'JavaScript',
    updated: '2 hours ago',
  },
  {
    name: 'pithub-backend',
    description: 'Express + Prisma backend for Pithub',
    stars: 8,
    language: 'Node.js',
    updated: '1 day ago',
  },
  {
    name: 'pithub-cli',
    description: 'Custom CLI for Pithub',
    stars: 3,
    language: 'Node.js',
    updated: 'just now',
  },
];


const Home = () => {
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();
  const [allrepos, setAllrepos] = useState([])

  const handleNewRepo = () => setShowCreate(true);
  const handleClose = () => setShowCreate(false);
  const handleCreated = () => {
    setShowCreate(false);
    // Optionally refresh repo list here
    
  };
  useEffect(() => {
    const getallrepos=async ()=>{
      const response=await axios.get('http://localhost:3000/repo/all',{
        headers:{
           'Authorization': `bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          
        }
      })  
      if(response){
        setAllrepos(response.data.repos)
        console.log(response.data)
      }
  
    }
    getallrepos()
    
  }, [])
  



  const handleViewRepo = (repoid) => {
    navigate(`/repo/${repoid}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <nav className="bg-gradient-to-r from-gray-900 to-blue-900 text-white px-8 py-4 flex items-center justify-between shadow-xl sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <svg height="36" viewBox="0 0 16 16" width="36" aria-hidden="true" className="fill-white"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
          <span className="font-extrabold text-3xl tracking-tight drop-shadow-lg">Pithub</span>
        </div>
        <input className="rounded-lg px-4 py-2 text-black w-80 focus:ring-2 focus:ring-blue-400 shadow-inner border border-blue-200" placeholder="Search repositories, users..." />
        <div className="flex items-center gap-6">
          <a href="/profile" className="hover:underline text-lg font-medium">Profile</a>
          <img src="/avatar.png" alt="avatar" className="w-10 h-10 rounded-full border-2 border-blue-400 shadow" />
        </div>
      </nav>
      <div className="flex">
        <aside className="w-72 bg-white/80 p-8 border-r min-h-screen shadow-lg flex flex-col justify-between">
          <div>
            <ul className="space-y-6 text-lg">
              <li><a href="/" className="font-semibold flex items-center gap-3 hover:text-blue-700 transition"><span>🏠</span> Home</a></li>
              <li><a href="/explore" className="flex items-center gap-3 hover:text-blue-700 transition"><span>🔍</span> Explore</a></li>
              <li><a href="/repos" className="flex items-center gap-3 hover:text-blue-700 transition"><span>📦</span> Repositories</a></li>
              <li><a href="/teams" className="flex items-center gap-3 hover:text-blue-700 transition"><span>👥</span> Teams</a></li>
            </ul>
          </div>
          <div className="text-xs text-gray-400 text-center mt-10">Pithub &copy; 2025</div>
        </aside>
        <main className="flex-1 p-10 bg-gradient-to-br from-white/80 to-blue-50 min-h-screen">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3 drop-shadow-sm">
              <span>Welcome to Pithub!</span>
              <span className="text-lg bg-green-100 text-green-700 px-3 py-1 rounded-full shadow">Beta</span>
            </h1>
            <button
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-200"
              onClick={handleNewRepo}
            >
              <span className="text-2xl">＋</span> New
            </button>
          </div>
          {showCreate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm  bg-opacity-40 transition-all duration-300">
              <div className="relative w-full max-w-lg animate-fade-in z-10 bg-white/95 rounded-2xl shadow-2xl p-8">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-3xl font-bold z-20"
                  onClick={handleClose}
                  aria-label="Close"
                >
                  &times;
                </button>
                <CreateRepo onCreate={handleCreated} />
              </div>
            </div>
          )}
          <h2 className="text-2xl font-bold mt-12 mb-6 text-blue-800 flex items-center gap-2">
            <span>📦</span> Your repositories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allrepos.map((repo, idx) => (
              <div key={idx} className="bg-white/90 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-blue-100 p-6 flex flex-col justify-between group relative overflow-hidden">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-xl text-blue-700 group-hover:text-blue-900 transition">{repo.name}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">{repo.language}</span>
                  </div>
                  <p className="text-gray-600 mb-4 text-base">{repo.description}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1">⭐ <span className="font-semibold text-gray-700">{repo.stars}</span></span>
                  <span className="italic">Updated {repo.updated}</span>
                </div>
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow hover:bg-blue-200"
                    onClick={() => handleViewRepo(repo._id)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
import React from 'react'
import Repo from './Pages/Repo'
import { Route, Routes } from 'react-router-dom';
import Register from './Pages/Register';

import Login from './Pages/Login';
import Home from './Pages/Home';
const App = () => {
  return (
   <>
    <Routes>
        <Route path='/' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home></Home>}/>
    </Routes>
   </>
  )
}

export default App  
// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import IndexPage from './pages/indexpage';
import Layout from './Layout';
import LoginPage from './pages/loginpage';
import RegisterPage from './pages/registerpage';
import { UserContextProvider } from './usercontext';
import CreatePost from './pages/createpost';
import PostPage from './pages/postpage';


function App() {
  return (
    <UserContextProvider>
      <Routes>
      <Route path="/" element={<Layout/>}>
      <Route index element={ <IndexPage /> } />
      <Route path="/login" index element={ <LoginPage/> } />
      <Route path="/register" index element={ <RegisterPage/> } />
      <Route path="/create" index element={ <CreatePost/> } />
      <Route path="/post/:id" index element={ <PostPage/> } />
      </Route>
        
      </Routes> 
    </UserContextProvider>
      
  );
}

export default App;

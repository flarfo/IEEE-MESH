import React, {useState} from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';

import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import SignUp from './pages/Register';

function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route 
        path="/login"
        element={<Login />}
      />
      <Route 
        path='/sign-up' 
        element={<Register />}
      />
    </Route>
    )
  )
  return <RouterProvider router={router} />
}

export default App;

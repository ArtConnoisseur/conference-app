// This is the root for the app created in collaboration by Rudraksh Srivastava 
// and Ananth S. 

// Please find the documentation at this link:

import React from 'react';
import ReactDOM from 'react-dom/client';
import Homepage from './pages/homepage/Homepage.jsx';
import Error from './pages/error-page/Error.jsx';

import {
  createBrowserRouter, 
  RouterProvider
} from 'react-router-dom';

import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
    errorElement: <Error />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

import ReactDOM from 'react-dom/client'
import React from 'react'
import { BrowserRouter } from "react-router";
import App from './App.tsx'
//import App from './client/home.tsx'

ReactDOM.createRoot(document.getElementById('app')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
console.log('createRoot')

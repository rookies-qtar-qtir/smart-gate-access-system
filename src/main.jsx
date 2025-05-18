// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@ant-design/v5-patch-for-react-19';

import Home from './pages/Home';
import Users from './pages/Users';
import AccessLog from './pages/AccessLog';
import GateControl from './pages/GateControl';
import { MQTTProvider } from "./services/Connection";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MQTTProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="users" element={<Users />} />
            <Route path="access-log" element={<AccessLog />} />
            <Route path="gate-control" element={<GateControl />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MQTTProvider>
  </React.StrictMode>
);

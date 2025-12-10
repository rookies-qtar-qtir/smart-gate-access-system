import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@ant-design/v5-patch-for-react-19';
import App from './App';
import './index.css';
import Home from './pages/Home';
import Users from './pages/Users';
import AccessLog from './pages/AccessLog';
import GateControl from './pages/GateControl';
import Login from './pages/Login';
import { MQTTProvider } from './services/Connection';
import { AuthProvider } from './services/AuthContext';
import { AccessLogProvider } from './services/AccessLogContext';
import ProtectedRoute from './components/ProtectedRoute';
import FloatingWebcamButton from './components/FloatingWebcamButton';
import WebcamComponent from './components/Webcam';
import FileUploadButton from './components/FileUploadButton';
import RFIDLoadingProvider from './components/RFIDLoadingProvider';
import type { FileUploadHandle, WebcamHandle } from './domain/controls';

const webcamRef = React.createRef<WebcamHandle | null>();
const fileUploadRef = React.createRef<FileUploadHandle | null>();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <MQTTProvider webcamRef={webcamRef} fileUploadRef={fileUploadRef}>
        <RFIDLoadingProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <AccessLogProvider>
                    <App />
                  </AccessLogProvider>
                </ProtectedRoute>
              }>
                <Route index element={<Home />} />
                <Route path="users" element={<Users />} />
                <Route path="access-log" element={<AccessLog />} />
                <Route path="gate-control" element={<GateControl />} />
              </Route>
            </Routes>

            <WebcamComponent ref={webcamRef} />
            <FileUploadButton ref={fileUploadRef} />
            <FloatingWebcamButton webcamRef={webcamRef} />
          </BrowserRouter>
        </RFIDLoadingProvider>
      </MQTTProvider>
    </AuthProvider>
  </React.StrictMode>
);

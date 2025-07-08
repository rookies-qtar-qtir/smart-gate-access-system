import React from 'react';
import logo from '../assets/images/logo.svg';

function Logo({ className = '', collapsed = false }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={logo}
        alt="Logo"
        className={collapsed ? 'h-64' : 'h-64'}
      />
    </div>
  );
}

export default Logo;

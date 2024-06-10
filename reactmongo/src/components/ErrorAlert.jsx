import React from 'react';

const ErrorAlert = ({ message, onClose }) => {
  return (
    <div className={`alert alert-danger`} role="alert">
      {message}
    </div>
  );
};

export default ErrorAlert;
import React from 'react';

const ErrorMessage = ({ error }) => (
    error ? <p style={{ color: 'red' }}>{error}</p> : null
);

export default ErrorMessage;

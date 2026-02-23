import React from 'react';

export const EyeIcon = ({ visible, color = '#666', size = 20 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {visible ? (
        // Eye visible
        <>
          <path
            d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="12.5"
            r="3"
            stroke={color}
            strokeWidth="2"
          />
        </>
      ) : (
        // Eye hidden with slash
        <>
          <path
            d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="12.5"
            r="3"
            stroke={color}
            strokeWidth="2"
          />
          <line
            x1="4"
            y1="4"
            x2="20"
            y2="20"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
};

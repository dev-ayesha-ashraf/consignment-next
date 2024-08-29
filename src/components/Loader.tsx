// components/Loader.tsx
import React from 'react';

const Loader = () => {
  return (
    <div className="fixed bottom-4 right-4 p-2 rounded-lg shadow-lg flex items-center bg-black justify-center">
      <div className="w-12 h-12 border-4 border-t-transparent border-r-transparent border-b-white border-l-transparent border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;

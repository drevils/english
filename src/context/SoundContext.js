import React, { createContext, useState, useContext } from 'react';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  return (
    <SoundContext.Provider value={{ isSoundEnabled, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  return useContext(SoundContext);
}; 
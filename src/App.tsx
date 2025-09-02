// src/App.tsx

import { ToastContainer } from 'react-toastify';
import LoginScreen from './components/LoginScreen';
import ThemeSwitcher from './components/ThemeSwitcher';
import { themeStore } from './store/themeStore';

function App() {
  const { theme } = themeStore();
  return (
    <div className="app">
      <div className="absolute top-4 right-4 z-20">
        <ThemeSwitcher />
      </div>
      <LoginScreen />
      <ToastContainer theme={theme} />
    </div>
  );
}

export default App;

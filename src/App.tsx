// src/App.tsx

import LoginScreen from './components/LoginScreen';
import ThemeSwitcher from './components/ThemeSwitcher';

function App() {
  return (
    <div className="app">
      <div className="absolute top-4 right-4 z-20">
        <ThemeSwitcher />
      </div>
      <LoginScreen />
    </div>
  );
}

export default App;

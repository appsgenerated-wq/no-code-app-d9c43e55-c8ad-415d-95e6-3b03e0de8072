import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import { testBackendConnection } from './services/apiService.js';
import config from './constants';
import './index.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [backendConnected, setBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const manifest = new Manifest({ appId: config.APP_ID, baseURL: config.BACKEND_URL });

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 [APP] Initializing application...');
      setIsLoading(true);
      const connectionResult = await testBackendConnection();
      setBackendConnected(connectionResult.success);

      if (connectionResult.success) {
        console.log('✅ [APP] Backend connection successful.');
        try {
          const userResult = await manifest.from('User').me();
          if (userResult) {
            setCurrentUser(userResult);
            setCurrentScreen('dashboard');
            console.log('✅ [APP] User is logged in:', userResult.email);
          }
        } catch (err) {
          console.log('ℹ️ [APP] No active user session.');
          setCurrentUser(null);
        }
      } else {
        console.error('❌ [APP] Backend connection failed:', connectionResult.error);
      }
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await manifest.login(email, password);
      const userRecord = await manifest.from('User').me();
      setCurrentUser(userRecord);
      setCurrentScreen('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = async () => {
    await manifest.logout();
    setCurrentUser(null);
    setRecipes([]);
    setCurrentScreen('landing');
  };

  const loadRecipes = async () => {
    try {
      const response = await manifest.from('Recipe').find({
        include: ['author', 'categories'],
        filter: { status: 'published' },
        sort: { createdAt: 'desc' }
      });
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to load recipes:', error);
    }
  };

  const createRecipe = async (recipeData) => {
    try {
      const newRecipe = await manifest.from('Recipe').create(recipeData);
      // We only show published recipes, so we need to reload the list
      // or conditionally add it if the status is published.
      if (newRecipe.status === 'published') {
        setRecipes([newRecipe, ...recipes]);
      }
      alert('Recipe created successfully!');
    } catch (error) {
      console.error('Failed to create recipe:', error);
      alert('Failed to create recipe. Please check the form and try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading application...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className={`text-sm font-medium ${backendConnected ? 'text-gray-700' : 'text-red-600'}`}>
          {backendConnected ? 'API Connected' : 'API Disconnected'}
        </span>
      </div>
      
      {currentScreen === 'landing' || !currentUser ? (
        <LandingPage onLogin={handleLogin} />
      ) : (
        <DashboardPage
          user={currentUser}
          recipes={recipes}
          onLogout={handleLogout}
          onLoadRecipes={loadRecipes}
          onCreateRecipe={createRecipe}
        />
      )}
    </div>
  );
}

export default App;

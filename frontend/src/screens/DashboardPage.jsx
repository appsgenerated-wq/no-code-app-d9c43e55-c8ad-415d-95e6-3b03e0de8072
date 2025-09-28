import React, { useEffect, useState } from 'react';
import config from '../constants.js';
import { UserCircleIcon, ArrowRightOnRectangleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const DashboardPage = ({ user, recipes, onLogout, onLoadRecipes, onCreateRecipe }) => {
  const [newRecipe, setNewRecipe] = useState({ title: '', description: '', ingredients: '', instructions: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    onLoadRecipes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateRecipe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onCreateRecipe({ ...newRecipe, author: user.id, status: 'published' });
    setNewRecipe({ title: '', description: '', ingredients: '', instructions: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">FoodApp Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create New Recipe Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <PlusCircleIcon className="h-6 w-6 mr-2 text-indigo-500" />
            Create New Recipe
          </h2>
          <form onSubmit={handleCreateRecipe} className="space-y-4">
            <input
              type="text"
              placeholder="Recipe Title"
              value={newRecipe.title}
              onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <textarea
              placeholder="Short Description"
              value={newRecipe.description}
              onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              rows={2}
            />
            <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition duration-150 ease-in-out disabled:bg-indigo-400">
              {isSubmitting ? 'Creating...' : 'Create Recipe'}
            </button>
          </form>
        </div>

        {/* Recipes List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Published Recipes</h2>
          {recipes.length === 0 ? (
            <div className="text-center bg-white p-12 rounded-lg shadow">
                <p className="text-gray-500">No published recipes yet. Create your first one above!</p>
                <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-semibold">Manage in Admin Panel</a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map(recipe => (
                <div key={recipe.id} className="bg-white rounded-lg shadow overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                  <img className="h-56 w-full object-cover" src={recipe.photo?.thumbnail?.url || 'https://placehold.co/400x300'} alt={recipe.title} />
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-gray-900">{recipe.title}</h3>
                    <p className="text-gray-700 text-base mb-4" dangerouslySetInnerHTML={{ __html: recipe.description }}></p>
                    <div className="flex items-center text-sm text-gray-500">
                        <UserCircleIcon className="h-5 w-5 mr-2 text-gray-400" />
                        <span>By {recipe.author?.name || 'Unknown Author'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

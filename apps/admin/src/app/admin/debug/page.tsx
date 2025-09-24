'use client';

import { useState, useEffect } from 'react';
import { RecipeService } from '@/lib/firebase/recipes';
import { AuthService } from '@/lib/firebase/auth';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export default function FirebaseDebugPage() {
  const [user, setUser] = useState<User | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        addDebugInfo(`User authenticated: ${user.email}`);
      } else {
        addDebugInfo('No user authenticated');
      }
    });

    return () => unsubscribe();
  }, []);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  const testFirebaseConnection = async () => {
    try {
      addDebugInfo('Testing Firebase connection...');
      
      // Test authentication
      if (!user) {
        addDebugInfo('ERROR: No authenticated user');
        return;
      }

      addDebugInfo('User authenticated, testing Firestore...');

      // Test reading recipes
      const recipes = await RecipeService.getAllRecipes();
      addDebugInfo(`Successfully read ${recipes.length} recipes from Firestore`);

      // Test creating a sample recipe
      const testRecipe = {
        title: 'Firebase Test Recipe',
        description: 'Test recipe for debugging Firebase connection',
        content: 'This is a test recipe to verify Firebase connectivity.',
        category: 'test',
        tags: ['test', 'debug'],
        prepTime: 10,
        cookTime: 15,
        totalTime: 25,
        servings: 2,
        difficulty: 'Easy' as const,
        ingredients: ['Test ingredient 1', 'Test ingredient 2'],
        instructions: ['Test instruction 1', 'Test instruction 2'],
        slug: 'firebase-test-recipe',
        status: 'draft' as const,
        authorId: user.uid,
        featuredImage: '',
        images: [],
        nutrition: {
          calories: 100,
          protein: 5,
          carbs: 10,
          fat: 2,
          fiber: 1,
        },
        faqs: [],
        author: {
          name: user.displayName || 'Test User',
          image: user.photoURL || '',
        },
        rating: {
          value: 0,
          count: 0,
        },
        notes: 'Test recipe notes'
      };

      addDebugInfo('Attempting to create test recipe...');
      const recipeId = await RecipeService.createRecipe(testRecipe);
      addDebugInfo(`✅ Successfully created test recipe with ID: ${recipeId}`);

      // Clean up - delete the test recipe
      await RecipeService.deleteRecipe(recipeId);
      addDebugInfo(`✅ Successfully deleted test recipe`);

      setTestResult('🎉 Firebase connection test PASSED!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addDebugInfo(`❌ ERROR: ${errorMessage}`);
      setTestResult(`❌ Firebase connection test FAILED: ${errorMessage}`);
      console.error('Firebase test error:', error);
    }
  };

  const signInAsAdmin = async () => {
    try {
      addDebugInfo('Attempting to sign in...');
      // You should replace these with actual admin credentials
      await AuthService.signIn('admin@minirecipe.com', 'your-password');
      addDebugInfo('✅ Successfully signed in');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addDebugInfo(`❌ Sign in failed: ${errorMessage}`);
    }
  };

  const signOutUser = async () => {
    try {
      await AuthService.signOut();
      addDebugInfo('✅ Successfully signed out');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addDebugInfo(`❌ Sign out failed: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Firebase Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Status */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
          {user ? (
            <div className="text-green-600">
              <p>✅ Authenticated</p>
              <p>Email: {user.email}</p>
              <p>Name: {user.displayName || 'Not set'}</p>
              <p>UID: {user.uid}</p>
            </div>
          ) : (
            <p className="text-red-600">❌ Not authenticated</p>
          )}
          
          <div className="mt-4 space-x-2">
            {!user ? (
              <button
                onClick={signInAsAdmin}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sign In as Admin
              </button>
            ) : (
              <button
                onClick={signOutUser}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Firebase Test</h2>
          <button
            onClick={testFirebaseConnection}
            disabled={!user}
            className={`px-4 py-2 rounded ${
              user 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Test Firebase Connection
          </button>
          
          {testResult && (
            <div className="mt-4 p-2 bg-white rounded border">
              <p className="font-medium">{testResult}</p>
            </div>
          )}
        </div>
      </div>

      {/* Debug Log */}
      <div className="mt-6 bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
        <h2 className="text-lg font-semibold mb-2 text-white">Debug Log</h2>
        <div className="max-h-96 overflow-y-auto">
          {debugInfo.length === 0 ? (
            <p>No debug information yet...</p>
          ) : (
            debugInfo.map((info, index) => (
              <p key={index} className="mb-1">{info}</p>
            ))
          )}
        </div>
        
        <button
          onClick={() => setDebugInfo([])}
          className="mt-2 px-3 py-1 bg-gray-700 text-white rounded text-xs hover:bg-gray-600"
        >
          Clear Log
        </button>
      </div>

      {/* Environment Info */}
      <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Environment Info</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <strong>Firebase Project ID:</strong>
            <p className="font-mono">{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
          </div>
          <div>
            <strong>Auth Domain:</strong>
            <p className="font-mono">{process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}</p>
          </div>
          <div>
            <strong>Using Emulators:</strong>
            <p className="font-mono">{process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS}</p>
          </div>
          <div>
            <strong>Environment:</strong>
            <p className="font-mono">{process.env.NODE_ENV}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

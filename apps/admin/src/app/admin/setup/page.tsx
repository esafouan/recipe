'use client';

import { useState } from 'react';
import { AuthService } from '@/lib/firebase/auth';
import { ChefHat } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSetup() {
  const [formData, setFormData] = useState({
    email: 'admin@minirecipe.com',
    password: '',
    displayName: 'Recipe Blog Admin',
  });
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create admin user with profile
      await AuthService.createUser(
        formData.email,
        formData.password,
        formData.displayName,
        'admin'
      );

      toast.success('Admin user created successfully!');
      setCompleted(true);
    } catch (error: unknown) {
      console.error('Setup error:', error);
      
      // Handle specific Firebase errors
      if (error instanceof Error) {
        if ('code' in error) {
          const firebaseError = error as { code: string; message: string };
          if (firebaseError.code === 'auth/email-already-in-use') {
            toast.error('Email already in use. Try logging in instead.');
          } else if (firebaseError.code === 'auth/weak-password') {
            toast.error('Password should be at least 6 characters long.');
          } else if (firebaseError.code === 'auth/invalid-email') {
            toast.error('Please enter a valid email address.');
          } else {
            toast.error(`Setup failed: ${firebaseError.message}`);
          }
        } else {
          toast.error(`Setup failed: ${error.message}`);
        }
      } else {
        toast.error('Setup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <ChefHat className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Setup Complete!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your admin account has been created successfully.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium text-gray-900 mb-2">Login Credentials</h3>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Email:</strong> {formData.email}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Password:</strong> [Your chosen password]
            </p>
            
            <a
              href="/admin/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Go to Admin Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
            <ChefHat className="h-8 w-8 text-orange-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Setup
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your admin account to manage the recipe blog
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="admin@minirecipe.com"
              />
            </div>

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                required
                value={formData.displayName}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Recipe Blog Admin"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Choose a secure password (min 6 characters)"
                minLength={6}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              This will create an admin user in Firebase Authentication and Firestore
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

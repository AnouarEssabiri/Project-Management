import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { updateProfile } from '../store/slices/authSlice';
import { 
  User, 
  Pencil, 
  X, 
  Save,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ClipboardCheck,
  Users,
  FolderGit2
} from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    role: user?.role || 'developer',
    bio: user?.bio || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await updateFirebaseProfile(auth.currentUser, {
        displayName: formData.displayName,
      });

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        role: formData.role,
        bio: formData.bio,
      });

      dispatch(updateProfile({
        displayName: formData.displayName,
        role: formData.role,
        bio: formData.bio,
      }));

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-4 py-2 rounded-lg
                     bg-blue-600 hover:bg-blue-700 text-white
                     transition-colors duration-200"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </motion.button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/50 
                       border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 
                       px-4 py-3 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/50 
                       border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 
                       px-4 py-3 rounded-lg mb-4">
            <CheckCircle2 className="w-5 h-5" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 
                         flex items-center justify-center">
              <User className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user?.displayName}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 
                        dark:border-gray-600 bg-white dark:bg-gray-700
                        text-gray-900 dark:text-white disabled:bg-gray-100
                        dark:disabled:bg-gray-800 focus:ring-2 focus:ring-blue-500
                        outline-none transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-gray-300 
                        dark:border-gray-600 bg-gray-100 dark:bg-gray-800
                        text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 
                        dark:border-gray-600 bg-white dark:bg-gray-700
                        text-gray-900 dark:text-white disabled:bg-gray-100
                        dark:disabled:bg-gray-800 focus:ring-2 focus:ring-blue-500
                        outline-none transition-colors duration-200"
              >
                <option value="developer">Developer</option>
                <option value="team_lead">Team Lead</option>
                <option value="project_manager">Project Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 
                        dark:border-gray-600 bg-white dark:bg-gray-700
                        text-gray-900 dark:text-white disabled:bg-gray-100
                        dark:disabled:bg-gray-800 focus:ring-2 focus:ring-blue-500
                        outline-none transition-colors duration-200 resize-none"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-4 py-2 rounded-lg
                        border border-gray-300 dark:border-gray-600
                        bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200
                        hover:bg-gray-50 dark:hover:bg-gray-600
                        transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="inline-flex items-center px-4 py-2 rounded-lg
                        bg-blue-600 hover:bg-blue-700 text-white
                        transition-colors duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </motion.button>
            </div>
          )}
        </form>

        <div className="mt-8 border-t dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Activity Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border 
                         border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-2">
                <ClipboardCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-blue-900 dark:text-blue-300">Tasks Completed</h4>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">24</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border 
                         border-green-100 dark:border-green-800">
              <div className="flex items-center gap-3 mb-2">
                <FolderGit2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h4 className="font-medium text-green-900 dark:text-green-300">Projects Contributed</h4>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">8</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30 border 
                         border-purple-100 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h4 className="font-medium text-purple-900 dark:text-purple-300">Team Collaborations</h4>
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
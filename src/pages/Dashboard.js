import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { setProjects } from '../store/slices/projectSlice';
import { setTasks } from '../store/slices/taskSlice';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import {
  LayoutDashboard,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Folder,
  CalendarDays,
  Flag,
  AlertTriangle,
} from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsQuery = query(
          collection(db, 'projects'),
          where('members', 'array-contains', user.uid)
        );
        const projectsSnapshot = await getDocs(projectsQuery);
        const projectsData = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        dispatch(setProjects(projectsData));

        const tasksQuery = query(
          collection(db, 'tasks'),
          where('assignedTo', '==', user.uid)
        );
        const tasksSnapshot = await getDocs(tasksQuery);
        const tasksData = tasksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        dispatch(setTasks(tasksData));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [dispatch, user]);

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const statusConfig = {
    'done': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', icon: CheckCircle2 },
    'in-progress': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', icon: Clock },
    'todo': { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-800 dark:text-gray-300', icon: AlertCircle }
  };

  const priorityConfig = {
    'high': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', icon: AlertTriangle },
    'medium': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-300', icon: Flag },
    'low': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', icon: Flag }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.displayName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your projects today.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 
                   text-white rounded-lg transition-colors duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/30 border 
                   border-blue-100 dark:border-blue-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300">
              Active Projects
            </h3>
            <Folder className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {projects.length}
          </p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-lg bg-green-50 dark:bg-green-900/30 border 
                   border-green-100 dark:border-green-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-300">
              Completed Tasks
            </h3>
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {getTasksByStatus('done').length}
          </p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 border 
                   border-yellow-100 dark:border-yellow-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300">
              In Progress
            </h3>
            <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {getTasksByStatus('in-progress').length}
          </p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-lg bg-red-50 dark:bg-red-900/30 border 
                   border-red-100 dark:border-red-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-300">
              Pending Tasks
            </h3>
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {getTasksByStatus('todo').length}
          </p>
        </motion.div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border 
                    border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Projects</h2>
          <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="space-y-4">
          {projects.slice(0, 5).map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ scale: 1.01 }}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 
                       hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{project.description}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  {new Date(project.deadline).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Your Tasks */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border 
                    border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Tasks</h2>
          <LayoutDashboard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="space-y-4">
          {tasks.slice(0, 5).map((task) => {
            const StatusIcon = statusConfig[task.status].icon;
            const PriorityIcon = priorityConfig[task.priority].icon;
            
            return (
              <motion.div
                key={task.id}
                whileHover={{ scale: 1.01 }}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 
                         hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                                ${priorityConfig[task.priority].bg} ${priorityConfig[task.priority].text}`}>
                      <PriorityIcon className="w-3 h-3 mr-1" />
                      {task.priority}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                                ${statusConfig[task.status].bg} ${statusConfig[task.status].text}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {task.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
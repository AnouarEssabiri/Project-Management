import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { setTasks, moveTask } from '../store/slices/taskSlice';

const KanbanBoard = () => {
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentProject) return;

      const tasksQuery = query(
        collection(db, 'tasks'),
        where('projectId', '==', currentProject.id)
      );
      
      const tasksSnapshot = await getDocs(tasksQuery);
      const tasksData = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      dispatch(setTasks(tasksData));
    };

    fetchTasks();
  }, [currentProject, dispatch]);

  const columns = {
    todo: {
      title: 'To Do',
      items: tasks.filter(task => task.status === 'todo'),
    },
    'in-progress': {
      title: 'In Progress',
      items: tasks.filter(task => task.status === 'in-progress'),
    },
    done: {
      title: 'Done',
      items: tasks.filter(task => task.status === 'done'),
    },
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    try {
      const taskRef = doc(db, 'tasks', draggableId);
      await updateDoc(taskRef, {
        status: destination.droppableId
      });

      dispatch(moveTask({
        taskId: draggableId,
        sourceStatus: source.droppableId,
        destinationStatus: destination.droppableId
      }));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const filteredTasks = (columnTasks) => {
    return columnTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });
  };

  return (
    <div className="h-full">
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Kanban Board</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary"
            onClick={() => {/* Add task logic */}}
          >
            Add Task
          </motion.button>
        </div>

        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search tasks..."
            className="input flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="input w-48"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="card">
              <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
                {column.title}
                <span className="text-sm text-gray-500">
                  {filteredTasks(column.items).length}
                </span>
              </h2>
              
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] p-2 rounded-lg ${
                      snapshot.isDraggingOver ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                  >
                    {filteredTasks(column.items).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            initial={false}
                            animate={snapshot.isDragging ? { scale: 1.05 } : { scale: 1 }}
                            className="p-4 mb-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority}
                              </span>
                              {task.dueDate && (
                                <span className="text-xs text-gray-500">
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {task.description}
                            </p>
                            
                            <div className="flex items-center justify-between mt-3">
                              {task.assignedTo && (
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                    {task.assignedTo.charAt(0)}
                                  </div>
                                  <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {task.assignedTo}
                                  </span>
                                </div>
                              )}
                              {task.labels && task.labels.length > 0 && (
                                <div className="flex space-x-1">
                                  {task.labels.map((label, i) => (
                                    <span
                                      key={i}
                                      className="w-2 h-2 rounded-full"
                                      style={{ backgroundColor: label.color }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;

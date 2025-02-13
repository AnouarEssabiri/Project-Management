import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { setTasks, moveTask } from '../store/slices/taskSlice';

const ScrumBoard = () => {
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);
  const [columns, setColumns] = useState({
    backlog: [],
    todo: [],
    'in-progress': [],
    review: [],
    done: [],
  });

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

  useEffect(() => {
    // Organize tasks into columns
    const newColumns = {
      backlog: tasks.filter(task => task.status === 'backlog'),
      todo: tasks.filter(task => task.status === 'todo'),
      'in-progress': tasks.filter(task => task.status === 'in-progress'),
      review: tasks.filter(task => task.status === 'review'),
      done: tasks.filter(task => task.status === 'done'),
    };
    setColumns(newColumns);
  }, [tasks]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Update task status in Firebase
    try {
      const taskRef = doc(db, 'tasks', draggableId);
      await updateDoc(taskRef, {
        status: destination.droppableId
      });

      // Update Redux store
      dispatch(moveTask({
        taskId: draggableId,
        sourceStatus: source.droppableId,
        destinationStatus: destination.droppableId
      }));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const columnTitles = {
    backlog: 'Backlog',
    todo: 'To Do',
    'in-progress': 'In Progress',
    review: 'Review',
    done: 'Done',
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Scrum Board</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-primary"
          onClick={() => {/* Add task logic */}}
        >
          Add Task
        </motion.button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-full">
          {Object.keys(columns).map((columnId) => (
            <div key={columnId} className="card">
              <h2 className="text-lg font-semibold mb-4">{columnTitles[columnId]}</h2>
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] p-2 rounded-lg ${
                      snapshot.isDraggingOver ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                  >
                    {columns[columnId].map((task, index) => (
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
                            className="p-4 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                          >
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {task.description}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority}
                              </span>
                              <div className="flex items-center space-x-2">
                                {task.assignedTo && (
                                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                    {task.assignedTo.charAt(0)}
                                  </div>
                                )}
                              </div>
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

export default ScrumBoard;

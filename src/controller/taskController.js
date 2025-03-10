const Task = require('../models/Tasks')
const logger = require('../utils/logger');
const { taskValidation } = require('../middlewares/validation');
const ExpressError = require('../middlewares/errorHandler');

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    logger.info('Fetched tasks successfully');
    res.json(tasks);
  } catch (error) {
    logger.error(`Failed to fetch tasks: ${error.message}`);
    next(new ExpressError('Failed to fetch tasks', 500));
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { error } = taskValidation(req.body);
    if (error) {
      logger.error(`Validation error: ${error.details[0].message}`);
      return next(new ExpressError(error.details[0].message, 400));
    }
    
    const task = new Task(req.body);
    await task.save();
    logger.info('Task created successfully');
    res.status(201).json(task);
  } catch (error) {
    logger.error(`Failed to create task: ${error.message}`);
    next(new ExpressError('Failed to create task', 500));
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { error } = taskValidation(req.body);
    if (error) {
      logger.error(`Validation error: ${error.details[0].message}`);
      return next(new ExpressError(error.details[0].message, 400));
    }
    
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      logger.error('Task not found');
      return next(new ExpressError('Task not found', 404));
    }
    logger.info('Task updated successfully');
    res.json(task);
  } catch (error) {
    logger.error(`Failed to update task: ${error.message}`);
    next(new ExpressError('Failed to update task', 500));
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      logger.error('Task not found');
      return next(new ExpressError('Task not found', 404));
    }
    logger.info('Task deleted successfully');
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    logger.error(`Failed to delete task: ${error.message}`);
    next(new ExpressError('Failed to delete task', 500));
  }
};
const Task = require('../models/Tasks'); // Import model Task
const logger = require('../utils/logger'); // Import utility logger
const { taskValidation } = require('../middlewares/validation'); // Import validasi task
const ExpressError = require('../middlewares/errorHandler'); // Import error handler

module.exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().lean(); // Menggunakan lean() untuk performa yang lebih baik
    logger.info('Berhasil mengambil data tasks');
    res.json(tasks); // Kirim response berupa data tasks
  } catch (error) {
    logger.error(`Gagal mengambil data tasks: ${error.message}`);
    next(new ExpressError('Gagal mengambil data tasks', 500)); // Tangani error
  }
};

module.exports.createTask = async (req, res, next) => {
  try {
    const { error } = taskValidation(req.body); // Validasi data input
    if (error) {
      logger.error(`Error validasi: ${error.details[0].message}`);
      return next(new ExpressError(error.details[0].message, 400)); // Jika validasi gagal, kirim error
    }
    
    const task = await Task.create(req.body); // Membuat task baru (lebih singkat daripada new Task() + save())
    logger.info('Task berhasil dibuat');
    res.status(201).json(task); // Kirim response task yang baru dibuat
  } catch (error) {
    logger.error(`Gagal membuat task: ${error.message}`);
    next(new ExpressError('Gagal membuat task', 500)); // Tangani error
  }
};

module.exports.updateTask = async (req, res, next) => {
  try {
    const { error } = taskValidation(req.body); // Validasi data input
    if (error) {
      logger.error(`Error validasi: ${error.details[0].message}`);
      return next(new ExpressError(error.details[0].message, 400)); // Jika validasi gagal, kirim error
    }
    
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!task) {
      logger.error('Task tidak ditemukan');
      return next(new ExpressError('Task tidak ditemukan', 404)); // Jika task tidak ditemukan, kirim error
    }
    
    logger.info('Task berhasil diperbarui');
    res.json(task); // Kirim response task yang telah diperbarui
  } catch (error) {
    logger.error(`Gagal memperbarui task: ${error.message}`);
    next(new ExpressError('Gagal memperbarui task', 500)); // Tangani error
  }
};

module.exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id); // Cari dan hapus task berdasarkan ID
    if (!task) {
      logger.error('Task tidak ditemukan');
      return next(new ExpressError('Task tidak ditemukan', 404)); // Jika task tidak ditemukan, kirim error
    }
    
    logger.info('Task berhasil dihapus');
    res.json({ message: 'Task berhasil dihapus' }); // Kirim response sukses
  } catch (error) {
    logger.error(`Gagal menghapus task: ${error.message}`);
    next(new ExpressError('Gagal menghapus task', 500)); // Tangani error
  }
};
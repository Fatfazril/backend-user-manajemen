require('dotenv').config();
const express = require('express');
const logger = require('./src/utils/logger');
const taskRoutes = require('./src/routes/taskRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
const connectDb = require('./config/database');

const app = express();
app.use(express.json());
app.use('/api/tasks', taskRoutes);
app.use(errorHandler);

const PORT = 5000

connectDb().then(()=>{
    return app.listen(PORT , ()=>{
        logger.info('server running on http://localhost:5000')
    })
})

module.exports = app
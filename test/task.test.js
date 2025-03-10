const request = require('supertest');
const app = require('../server'); // Pastikan server diekspor
const mongoose = require('mongoose');

describe('Task API', () => {
  let taskId;

  // Cleanup setelah semua test selesai
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('Should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task', description: 'Testing task creation' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    taskId = res.body._id;
  });

  test('Should fetch all tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test('Should update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ title: 'Updated Task', completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Task');
  });

  test('Should delete a task', async () => {
    const res = await request(app).delete(`/api/tasks/${taskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task deleted successfully');
  });
});

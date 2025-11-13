import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.routes.js';
import { errorHandler } from '../middleware/error.middleware.js';
import User from '../models/user.model.js';

// Create minimal test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    const validUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test@123456',
    };

    it('should register a new user', async () => {
      const res = await request(app).post('/api/auth/register').send(validUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.email).toBe(validUser.email);
    });

    it('should not register duplicate email', async () => {
      await User.create(validUser);

      const res = await request(app).post('/api/auth/register').send(validUser);

      expect(res.status).toBe(409);
    });

    it('should validate required fields', async () => {
      const res = await request(app).post('/api/auth/register').send({ username: 'test' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    const user = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test@123456',
    };

    beforeEach(async () => {
      await User.create(user);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: user.email,
        password: user.password,
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: user.email,
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout with valid token', async () => {
      // First create and login user
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test@123456',
      });

      const loginRes = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'Test@123456',
      });

      const token = loginRes.body.token;

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('should reject logout without token', async () => {
      const res = await request(app).post('/api/auth/logout');

      expect(res.status).toBe(400);
    });
  });
});

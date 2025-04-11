import request from 'supertest';
import {app} from '../src/index.js';
import pool from '../config/db.js';
import bcrypt from 'bcrypt';

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    // First delete dependent records from interviews table
    await pool.query('DELETE FROM interviews');
    // Then delete users
    await pool.query('DELETE FROM users');
  });

  afterAll(async () => {
    await pool.end();
  });

  // Rest of the test code remains the same
  describe('POST  /auth/register', () => {
    const validUser = {
      firstName: 'Pranav',
      lastName: 'Londhe',
      email: 'prnav@example.com',
      password: 'password123',
      role: 'interviewer'
    };

    it('should register a new user', async () => {
      const res = await request(app)
        .post(' /auth/register')
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.message).toBe('User created successfully');
      expect(res.body.user).toHaveProperty('email', validUser.email);
      expect(res.body.user).toHaveProperty('firstName', validUser.firstName);
      expect(res.body.user).toHaveProperty('role', validUser.role);
    });

    it('should not register user with existing email', async () => {
      const hashedPassword = await bcrypt.hash(validUser.password, 10);
      
      await pool.query(
        'INSERT INTO users ("firstName", "lastName", email, password, role) VALUES ($1, $2, $3, $4, $5)',
        [validUser.firstName, validUser.lastName, validUser.email, hashedPassword, validUser.role]
      );
      
      const res = await request(app)
        .post(' /auth/register')
        .send(validUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });

    it('should not register user with invalid role', async () => {
      const invalidUser = { ...validUser, role: 'invalid_role' };
      
      const res = await request(app)
        .post(' /auth/register')
        .send(invalidUser);

      expect(res.status).toBe(500);
    });
  });

  describe('POST  /auth/login', () => {
    const testUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'interviewer'
    };

    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash(testUser.password, 10);
      
      await pool.query(
        'INSERT INTO users ("firstName", "lastName", email, password, role) VALUES ($1, $2, $3, $4, $5)',
        [testUser.firstName, testUser.lastName, testUser.email, hashedPassword, testUser.role]
      );
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post(' /auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.message).toBe('Login successful');
      expect(res.body.user).toHaveProperty('email', testUser.email);
      expect(res.body.user).toHaveProperty('role', testUser.role);
    });

    it('should not login with invalid password', async () => {
      const res = await request(app)
        .post(' /auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post(' /auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User not found');
    });
  });
});
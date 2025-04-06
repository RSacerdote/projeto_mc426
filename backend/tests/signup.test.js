const request = require('supertest');
const express = require('express');
const app = require('../index'); // Import your app

describe('Signup Endpoint', () => {
  it('should return 201 when a user signs up successfully', async () => {
    const response = await request(app)
      .post('/signup')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
  });

  it('should return 400 when email or password is missing', async () => {
    const response = await request(app).post('/signup').send({ email: '' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email and password are required');
  });

  it('should return 409 when trying to sign up with an existing email', async () => {
    // First signup
    await request(app)
      .post('/signup')
      .send({ email: 'duplicate@example.com', password: 'password123' });

    // Second signup with the same email
    const response = await request(app)
      .post('/signup')
      .send({ email: 'duplicate@example.com', password: 'password123' });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('User already exists');
  });
});
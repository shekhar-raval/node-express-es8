const request = require('supertest');
const { expect } = require('chai');
const bcrypt = require('bcryptjs');
const app = require('../../src/server');
const User = require('../../src/api/models/user');

describe('USERS APIS', async () => {
  const password = '123456';
  const passwordHashed = await bcrypt.hash(password, 1);
  let adminAccessToken;
  let userAccessToken;
  let dbUsers;
  let user;
  let admin;

  beforeEach(async () => {
    dbUsers = {
      shekhar: {
        name: 'shekhar',
        email: 'shekhar12@gmail.com',
        password: passwordHashed,
        role: 'admin',
      },
      michal: {
        name: 'Michal',
        email: 'michal12@gmail.com',
        password: passwordHashed,
      },
      stephan: {
        name: 'stephan',
        email: 'stephan12@gmail.com',
        password: passwordHashed,
      },
    };

    user = {
      email: 'sousa.dfs@gmail.com',
      password,
      name: 'Daniel Sousa',
    };

    admin = {
      email: 'admin@gmail.com',
      password,
      name: 'Super User',
      role: 'admin',
    };

    await User.remove({});
    await User.insertMany([dbUsers.shekhar, dbUsers.michal, dbUsers.stephan]);

    dbUsers.shekhar.password = password;
    dbUsers.stephan.password = password;
    dbUsers.michal.password = password;

    adminAccessToken = (await User.ValidateUserAndGenerateToken(dbUsers.shekhar)).accessToken;
    userAccessToken = (await User.ValidateUserAndGenerateToken(dbUsers.stephan)).accessToken;
  });

  describe('POST /api/v1/users', () => {
    it('should create user with admin role', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(admin)
        .expect(201);

      delete admin.password;
      expect(res.body.data).to.includes(admin);
    });

    it('should create user with default role of user', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(user)
        .expect(201);

      delete user.password;
      user.role = 'user';
      expect(res.body.data.role).to.equal('user');
      expect(res.body.data).to.includes(user);
    });

    it('should report error when email already exists ', async () => {
      user.email = dbUsers.shekhar.email;
      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(user)
        .expect(400);
      const { field, location, messages } = res.body.errors[0];
      expect(field).to.be.equal('email');
      expect(location).to.be.equal('body');
      expect(messages).to.be.equal('Email is already in use');
    });

    it('should report error when email is not provided ', async () => {
      delete user.email;
      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(user)
        .expect(400);

      expect(res.body.message).to.be.equal('Validation Error');
      expect(res.body.code).to.be.equal(400);

      const { field, location, messages } = res.body.errors[0];

      expect(field).to.be.equal('email');
      expect(location).to.be.equal('body');
      expect(messages).to.be.equal('email is required');
    });

    it('should report error when password is less than 6 char long', async () => {
      user.password = '1245';
      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(user)
        .expect(400);

      expect(res.body.message).to.be.equal('Validation Error');
      expect(res.body.code).to.be.equal(400);

      const { field, location, messages } = res.body.errors[0];

      expect(field).to.be.equal('password');
      expect(location).to.be.equal('body');
      expect(messages).to.be.equal('password length must be at least 6 characters long');
    });

    it('should create report an error when logged user is not admin', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(user)
        .expect(403);

      expect(res.body.code).to.be.equal(403);
      expect(res.body.message).to.be.equal('Forbidden');
      expect(res.body.errors).to.be.lengthOf(0);
    });
  });

  describe('GET /api/v1/users/:userId', () => {
    it('should get user', async () => {
      delete dbUsers.shekhar.password;

      const id = (await User.findOne({ email: 'shekhar12@gmail.com' }))._id;
      const res = await request(app)
        .get(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);
      expect(res.body.data).to.includes(dbUsers.shekhar);
    });

    it('should report an error when user does not exists', async () => {
      const res = await request(app)
        .get('/api/v1/users/56c787ccc67fc16ccc1a5e92')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(404);
      expect(res.body.code).to.be.equal(404);
      expect(res.body.message).to.be.equal('No record found for given details');
      expect(res.body.errors).to.be.lengthOf(0);
    });

    it('should report an error when user provided id is not valid mongoose ID', async () => {
      const res = await request(app)
        .get('/api/v1/users/shekhar134')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(404);
      expect(res.body.code).to.be.equal(404);
      expect(res.body.message).to.be.equal('Validation Error');

      const { field, location, messages } = res.body.errors[0];
      expect(field).to.be.equal('id');
      expect(messages).to.be.equal('Please enter valid User ID');
      expect(location).to.be.equal('params');
    });

    it('should report error when logged user is not the same as the requested one', async () => {
      const id = (await User.findOne({ email: dbUsers.michal.email }))._id;
      const res = await request(app)
        .get(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(403);

      expect(res.body.code).to.be.equal(403);
      expect(res.body.message).to.be.equal('Forbidden');
    });
  });

  describe('PUT /v1/users/:userId', async () => {
    it('should replace user', async () => {
      delete dbUsers.shekhar.password;
      const id = (await User.findOne({ email: dbUsers.shekhar.email }))._id;
      const res = await request(app)
        .put(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(user)
        .expect(200);
      delete user.password;
      expect(res.body.data).to.includes(user);
      expect(res.body.data.role).to.be.equal('user');
    });

    it('should report error when email not provided', async () => {
      delete user.email;
      const id = (await User.findOne())._id;
      const res = await request(app)
        .put(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(user)
        .expect(400);
      const { field, location, messages } = res.body.errors[0];
      expect(field).to.be.equal('email');
      expect(location).to.be.equal('body');
      expect(messages).to.be.equal('email is required');
    });

    it('should report error when password length is less than 6', async () => {
      user.password = '12445';
      const id = (await User.findOne())._id;
      const res = await request(app)
        .put(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(user)
        .expect(400);
      const { field, location, messages } = res.body.errors[0];
      expect(field).to.be.equal('password');
      expect(location).to.be.equal('body');
      expect(messages).to.be.equal('password length must be at least 6 characters long');
    });

    it('should report an error when user does not exists', async () => {
      const res = await request(app)
        .put('/api/v1/users/56c787ccc67fc16ccc1a5e92')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(user)
        .expect(404);
      expect(res.body.code).to.be.equal(404);
      expect(res.body.message).to.be.equal('No record found for given details');
    });

    it('should report an error when Id is not a valid Mongoose Id', async () => {
      const res = await request(app)
        .put('/api/v1/users/shekhar@123')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(user)
        .expect(404);
      expect(res.body.code).to.be.equal(404);
      expect(res.body.message).to.be.equal('Validation Error');
      const { field, location, messages } = res.body.errors[0];
      expect(field).to.be.equal('id');
      expect(location).to.be.equal('params');
      expect(messages).to.be.equal('Please enter valid User ID');
    });

    it('should report an error when Email trying to replace already exists', async () => {
      delete dbUsers.shekhar.password;
      user.email = dbUsers.michal.email;
      const id = (await User.findOne({ email: dbUsers.shekhar.email }))._id;
      const res = await request(app)
        .put(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(user)
        .expect(400);
      expect(res.body.code).to.be.equal(400);
      expect(res.body.message).to.be.equal('Email is already in use by another account');
      const { field, location, messages } = res.body.errors[0];
      expect(field).to.be.equal('email');
      expect(location).to.be.equal('body');
      expect(messages).to.be.equal('Email is already in use');
    });

    it('should report error when logged user is not the same as the requested one', async () => {
      const id = (await User.findOne({ email: dbUsers.michal.email }))._id;
      const res = await request(app)
        .get(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(403);

      expect(res.body.code).to.be.equal(403);
      expect(res.body.message).to.be.equal('Forbidden');
    });

    it('should not replace role when Logged user is not admin', async () => {
      delete dbUsers.stephan.password;
      const id = (await User.findOne({ email: dbUsers.stephan.email }))._id;
      const role = 'admin';
      user.role = role;
      const res = await request(app)
        .put(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(user)
        .expect(200);
      delete user.password;
      expect(res.body.data.role).to.be.equal('user');
    });
  });

  describe('PATCH /v1/users/:userId', () => {
    it('should update user', async () => {
      delete user.password;
      delete user.name;
      user.role = 'user';
      const id = (await User.findOne({ email: dbUsers.shekhar.email }))._id;
      const res = await request(app)
        .patch(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(user)
        .expect(200);
      expect(res.body.data).to.includes(user);
      expect(res.body.data.role).to.be.equal('user');
    });

    it('should report error when email trying to update already exists', async () => {
      user.email = dbUsers.michal.email;
      const id = (await User.findOne({ email: dbUsers.shekhar.email }))._id;
      const res = await request(app)
        .patch(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(user)
        .expect(400);
      const { field, location, messages } = res.body.errors[0];
      expect(res.body.code).to.equal(400);
      expect(field).to.equal('email');
      expect(location).to.equal('body');
      expect(messages).to.equal('Email is already in use');
    });
  });
});

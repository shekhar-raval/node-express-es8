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
});

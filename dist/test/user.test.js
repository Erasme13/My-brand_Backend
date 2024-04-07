"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const server_1 = require("../server");
const user_1 = __importDefault(require("../models/user"));
chai_1.default.use(chai_http_1.default);
describe('Users API', () => {
    // Define a test user object to be used in tests
    const testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword'
    };
    // Create a user for testing
    before(async () => {
        // Hash the test user's password before saving to the database
        testUser.password = await bcrypt_1.default.hash(testUser.password, 10);
        // Save the test user to the database
        await user_1.default.create(testUser);
    });
    // Remove the test user from the database after testing
    after(async () => {
        await user_1.default.deleteOne({ email: testUser.email });
    });
    // Test user registration endpoint
    describe('POST /api/users/signup', () => {
        it('should register a new user', (done) => {
            chai_1.default.request(server_1.app)
                .post('/api/users/signup')
                .send(testUser)
                .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Successfully registered');
                done();
            });
        });
    });
    // Test user login endpoint
    describe('POST /api/users/login', () => {
        it('should login an existing user', (done) => {
            chai_1.default.request(server_1.app)
                .post('/api/users/login')
                .send({ email: testUser.email, password: 'testpassword' })
                .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                done();
            });
        });
    });
    // Test get all users endpoint
    describe('GET /api/users', () => {
        it('should get all users', (done) => {
            chai_1.default.request(server_1.app)
                .get('/api/users')
                .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });
    // Test get a user by ID endpoint
    describe('GET /api/users/:userId', () => {
        it('should get a user by ID', async () => {
            const newUser = new user_1.default(testUser);
            try {
                const user = await newUser.save();
                const res = await chai_1.default.request(server_1.app).get(`/api/users/${user._id}`);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('username').eql(testUser.username);
            }
            catch (error) {
                console.error(error);
            }
        });
    });
    // Test update user endpoint
    describe('PUT /api/users/updateuser/:userId', () => {
        it('should update a user', async () => {
            const updatedUser = {
                username: 'updatedusername'
            };
            const newUser = new user_1.default(testUser);
            try {
                const user = await newUser.save();
                const res = await chai_1.default.request(server_1.app)
                    .put(`/api/users/updateuser/${user._id}`)
                    .send(updatedUser);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('username').eql(updatedUser.username);
            }
            catch (error) {
                console.error(error);
            }
        });
    });
    // Test delete user endpoint
    describe('DELETE /api/users/delete/:userId', () => {
        it('should delete a user', async () => {
            const newUser = new user_1.default(testUser);
            try {
                const user = await newUser.save();
                const res = await chai_1.default.request(server_1.app)
                    .delete(`/api/users/delete/${user._id}`);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User is deleted successfully');
            }
            catch (error) {
                console.error(error);
            }
        });
    });
});

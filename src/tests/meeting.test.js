import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import meetingService from '../services/meeting.service.js';

describe('Meeting API', () => {
  beforeEach(() => {
    // Clear meetings array before each test
    meetingService.clearMeetings();
  });

  describe('POST /meetings', () => {
    it('should create a new meeting with valid data', async () => {
      const meetingData = {
        startTime: '2024-12-25T10:00:00Z',
        duration: 30,
        participants: ['user1', 'user2'],
        title: 'Test Meeting',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/meetings')
        .send(meetingData)
        .expect(201);

      expect(response.body).to.have.property('id');
      expect(response.body.title).to.equal(meetingData.title);
    });

    it('should return 400 for invalid meeting data', async () => {
      const invalidData = {
        startTime: 'invalid-date',
        duration: 0,
        participants: ['user1'],
        title: ''
      };

      await request(app)
        .post('/meetings')
        .send(invalidData)
        .expect(400);
    });
  });

  // Add more test cases for other endpoints
});
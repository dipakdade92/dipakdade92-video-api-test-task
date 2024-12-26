const request = require('supertest');
const app = require('../app');
const path = require('path');

describe('Video API Endpoints', () => {
  it('should upload a video', async () => {
    const videoPath = path.join(__dirname, 'fixtures', 'test_file.mp4');
    const response = await request(app)
      .post('/api/videos/upload')
      .attach('video', videoPath)
      .field('title', 'Test Video');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('videoId');
  });

  it('should trim a video', async () => {
    const response = await request(app)
      .post('/trim')
      .send({
        videoId: '1',
        start: 10,
        end: 20
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('trimmedVideoId');
  });

  it('should merge videos', async () => {
    const response = await request(app)
      .post('/merge')
      .send({
        videoIds: ['videoId1', 'videoId2']
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('mergedVideoId');
  });

  it('should generate a shareable link', async () => {
    const response = await request(app)
      .get('/share/existingVideoId');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('shareableLink');
  });

  it('should retrieve all videos', async () => {
    const response = await request(app)
      .get('/');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
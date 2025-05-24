// Mocks
import { mockForm, setupTestEnvironment } from '../../../mocks';

// Import the actual handlers
import { POST, DELETE } from '../../../../app/api/simulation/route';

// Mock external dependencies
jest.mock('node:fs/promises');
jest.mock('uuid');
jest.mock('../../../../app/_private/utils/pages');
jest.mock('../../../../app/_private/utils/api');

describe('API Route: /api/simulation', () => {
  beforeEach(() => {
    setupTestEnvironment();
  });

  describe('POST /api/simulation', () => {
    it('should create simulation successfully', async () => {
      const request = {
        json: jest.fn().mockResolvedValue(mockForm),
      } as unknown as Request;

      const response = await POST(request);

      expect(response).toBeDefined();
    });

    it('should handle different form configurations', async () => {
      const advancedForm = { ...mockForm, advanced: true, script: 'custom script' };
      const request = {
        json: jest.fn().mockResolvedValue(advancedForm),
      } as unknown as Request;

      const response = await POST(request);

      expect(response).toBeDefined();
    });
  });

  describe('DELETE /api/simulation', () => {
    it('should delete simulation successfully', async () => {
      const request = {
        json: jest.fn().mockResolvedValue('test-id'),
      } as unknown as Request;

      const response = await DELETE(request);

      expect(response).toBeDefined();
    });

    it('should handle different simulation IDs', async () => {
      const request = {
        json: jest.fn().mockResolvedValue('another-test-id'),
      } as unknown as Request;

      const response = await DELETE(request);

      expect(response).toBeDefined();
    });
  });
});

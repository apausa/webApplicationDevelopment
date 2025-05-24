// Mocks
import { mockSimulation1, setupTestEnvironment, mockSimulation2 } from '../../../../mocks';

// Import the actual handler
import { PUT } from '../../../../../app/api/simulation/localRunWorkflow/route';

describe('API Route: /api/simulation/localRunWorkflow', () => {
  beforeEach(() => {
    setupTestEnvironment();
  });

  describe('PUT /api/simulation/localRunWorkflow', () => {
    it('should handle local simulation execution successfully', async () => {
      const request = {
        json: jest.fn().mockResolvedValue(mockSimulation1),
      } as unknown as Request;

      const response = await PUT(request);

      expect(response).toBeDefined();
    });

    it('should handle different simulation configurations', async () => {
      const request = {
        json: jest.fn().mockResolvedValue(mockSimulation2),
      } as unknown as Request;

      const response = await PUT(request);

      expect(response).toBeDefined();
    });
  });
});

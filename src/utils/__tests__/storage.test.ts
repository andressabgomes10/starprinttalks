import { storage } from '../storage';

// Mock do localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Storage Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getItem', () => {
    it('should get item from localStorage', () => {
      const mockData = 'test-value';
      mockLocalStorage.getItem.mockReturnValue(mockData);

      const result = storage.getItem('test-key');

      expect(result).toBe(mockData);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
    });

    it('should return null for non-existent key', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = storage.getItem('non-existent-key');

      expect(result).toBeNull();
    });

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = storage.getItem('test-key');

      expect(result).toBeNull();
    });
  });

  describe('setItem', () => {
    it('should set item in localStorage', () => {
      mockLocalStorage.setItem.mockImplementation(() => {});

      const result = storage.setItem('test-key', 'test-value');

      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value');
    });

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = storage.setItem('test-key', 'test-value');

      expect(result).toBe(false);
    });
  });

  describe('removeItem', () => {
    it('should remove item from localStorage', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {});

      const result = storage.removeItem('test-key');

      expect(result).toBe(true);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = storage.removeItem('test-key');

      expect(result).toBe(false);
    });
  });

  describe('getBooleanItem', () => {
    it('should get boolean value from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('true');

      const result = storage.getBooleanItem('test-key');

      expect(result).toBe(true);
    });

    it('should return default value for non-existent key', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = storage.getBooleanItem('test-key', false);

      expect(result).toBe(false);
    });

    it('should return default value for invalid boolean', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid');

      const result = storage.getBooleanItem('test-key', true);

      expect(result).toBe(true);
    });

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = storage.getBooleanItem('test-key', false);

      expect(result).toBe(false);
    });
  });

  describe('setBooleanItem', () => {
    it('should set boolean value in localStorage', () => {
      mockLocalStorage.setItem.mockImplementation(() => {});

      const result = storage.setBooleanItem('test-key', true);

      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', 'true');
    });

    it('should set false boolean value', () => {
      mockLocalStorage.setItem.mockImplementation(() => {});

      const result = storage.setBooleanItem('test-key', false);

      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', 'false');
    });

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = storage.setBooleanItem('test-key', true);

      expect(result).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle localStorage errors gracefully in getItem', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = storage.getItem('test-key');

      expect(result).toBeNull();
    });

    it('should handle localStorage errors gracefully in setItem', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = storage.setItem('test-key', 'test-value');

      expect(result).toBe(false);
    });

    it('should handle localStorage errors gracefully in removeItem', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = storage.removeItem('test-key');

      expect(result).toBe(false);
    });
  });
});
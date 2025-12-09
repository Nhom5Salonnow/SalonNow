import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeData, getData, removeData } from '@/utils/asyncStorage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('asyncStorage Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('storeData', () => {
    it('should call AsyncStorage.setItem with correct key and value', async () => {
      await storeData('testKey', 'testValue');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('testKey', 'testValue');
    });

    it('should handle empty string value', async () => {
      await storeData('testKey', '');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('testKey', '');
    });

    it('should handle JSON string value', async () => {
      const jsonValue = JSON.stringify({ name: 'John', age: 30 });
      await storeData('userData', jsonValue);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userData', jsonValue);
    });

    it('should not throw when AsyncStorage.setItem fails', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      // Should not throw
      await expect(storeData('testKey', 'testValue')).resolves.not.toThrow();
    });

    it('should log error when AsyncStorage.setItem fails', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      await storeData('testKey', 'testValue');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getData', () => {
    it('should call AsyncStorage.getItem with correct key', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('testValue');

      const result = await getData('testKey');

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('testKey');
      expect(result).toBe('testValue');
    });

    it('should return null when key does not exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await getData('nonExistentKey');

      expect(result).toBeNull();
    });

    it('should return stored JSON string', async () => {
      const jsonValue = JSON.stringify({ name: 'John' });
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(jsonValue);

      const result = await getData('userData');

      expect(result).toBe(jsonValue);
    });

    it('should not throw when AsyncStorage.getItem fails', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      await expect(getData('testKey')).resolves.not.toThrow();
    });
  });

  describe('removeData', () => {
    it('should call AsyncStorage.removeItem with correct key', async () => {
      await removeData('testKey');

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('testKey');
    });

    it('should not throw when AsyncStorage.removeItem fails', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      await expect(removeData('testKey')).resolves.not.toThrow();
    });
  });
});

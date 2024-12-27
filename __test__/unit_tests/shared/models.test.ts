import { Meta } from "../../../src/shared/models";

describe('Meta', () => {
    it('should create a Meta instance from JSON', () => {
      const json = {
        createdBy: 'admin',
        createdAt: new Date().getMilliseconds(),
        updatedBy: 'admin',
        updatedAt: new Date().getMilliseconds(),
      };
      const meta = Meta.fromJson(json);
  
      expect(meta.createdBy).toBe('admin');
      expect(meta.createdAt.getMilliseconds()).toBe(json.createdAt);
      expect(meta.updatedBy).toBe('admin');
      expect(meta.updatedAt.getMilliseconds()).toBe(json.updatedAt);
    });
  
    it('should convert a Meta instance to JSON', () => {
      const createdAt = new Date();
      const updatedAt = new Date();
      const meta = new Meta('admin', createdAt, 'admin', updatedAt);
      const json = Meta.toJson(meta);
  
      expect(json.createdBy).toBe('admin');
      expect(new Date(json.createdAt).toISOString()).toBe(createdAt.toISOString());
      expect(json.updatedBy).toBe('admin');
      expect(new Date(json.updatedAt).toISOString()).toBe(updatedAt.toISOString());
    });
});
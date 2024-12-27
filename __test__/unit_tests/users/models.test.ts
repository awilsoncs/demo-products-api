import { LoginUser, User, Meta } from '../../../src/users/models';

describe('LoginUser', () => {
  it('should create a LoginUser instance from JSON', () => {
    const json = { email: 'test@example.com', password: 'password123' };
    const loginUser = LoginUser.fromJson(json);

    expect(loginUser.email).toBe('test@example.com');
    expect(loginUser.password).toBe('password123');
  });
});

describe('User', () => {
  it('should create a User instance from JSON', () => {
    const json = {
      id: '1234',
      email: 'test@example.com',
      password: 'password123',
      meta: {
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        updatedBy: 'admin',
        updatedAt: new Date().toISOString(),
      },
    };
    const user = User.fromJson(json);

    expect(user.id).toBe('1234');
    expect(user.email).toBe('test@example.com');
    expect(user.password).toBe('password123');
    expect(user.meta.createdBy).toBe('admin');
    expect(user.meta.createdAt.toISOString()).toBe(json.meta.createdAt);
    expect(user.meta.updatedBy).toBe('admin');
    expect(user.meta.updatedAt.toISOString()).toBe(json.meta.updatedAt);
  });

  it('should convert a User instance to JSON', () => {
    const meta = new Meta('admin', new Date(), 'admin', new Date());
    const user = new User('1234', 'test@example.com', 'password123', meta);
    const json = User.toJson(user);

    expect(json.id).toBe('1234');
    expect(json.email).toBe('test@example.com');
    expect(json.password).toBe('password123');
    expect(json.meta.createdBy).toBe('admin');
    expect(new Date(json.meta.createdAt).toISOString()).toBe(meta.createdAt.toISOString());
    expect(json.meta.updatedBy).toBe('admin');
    expect(new Date(json.meta.updatedAt).toISOString()).toBe(meta.updatedAt.toISOString());
  });
});

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
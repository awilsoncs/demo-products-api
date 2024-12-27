class LoginUser {
  readonly email: string;
  readonly password: string;

  constructor(email: string, password: string) {
      this.email = email;
      this.password = password;
  }

  static fromJson(json: any): LoginUser {
      return new LoginUser(json.email, json.password);
  }
}

class User {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly meta : Meta;

  constructor(id: string, email: string, password: string, meta: Meta) {
      this.id = id;
      this.email = email;
      this.password = password;
      this.meta = meta;
  }

  static fromJson(json: any): User {
      return new User(json.id, json.email, json.password, Meta.fromJson(json.meta));
  }

  static toJson(user: User): any {
      return {
          id: user.id,
          email: user.email,
          password: user.password,
          meta: Meta.toJson(user.meta)
      };
  }
}

class Meta {
  readonly createdBy: string;
  readonly createdAt: Date;
  readonly updatedBy: string;
  readonly updatedAt: Date;

  constructor(createdBy: string, createdAt: Date, updatedBy: string, updatedAt: Date) {
      this.createdBy = createdBy;
      this.createdAt = createdAt;
      this.updatedBy = updatedBy;
      this.updatedAt = updatedAt;
  }

  static fromJson(json: any): Meta {
      return new Meta(
        json.createdBy,
        new Date(json.createdAt),
        json.updatedBy,
        new Date(json.updatedAt));
  }

  static toJson(meta: Meta): any {
      return {
          createdBy: meta.createdBy,
          createdAt: meta.createdAt.toISOString(),
          updatedBy: meta.updatedBy,
          updatedAt: meta.updatedAt.toISOString(),
      };
  }
}

export { LoginUser, User, Meta };
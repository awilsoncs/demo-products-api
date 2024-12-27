import { Meta } from "../shared/models";

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

export { LoginUser, User };
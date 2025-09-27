import { HttpException } from "../exceptions/http.exception";
import UserService from "./user.service";
import bcrypt from "bcrypt";

export default class AuthService {
  public async signup(signupData: Record<string, any>) {
    console.log("signupData +>>>", signupData);

    const {
      email,
      username,
      firstname,
      lastname,
      middlename,
      dateOfBirth,
      password,
      signInType,
    } = signupData;

    const userService = new UserService();
    const existingUser = await userService.checkUserExists(username, email);
    if (existingUser) {
      throw new HttpException(
        400,
        `error`,
        `User already exists with the username '${username}' or email '${email}'`,
        `E-400`
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userService.createUser({
      email,
      username,
      firstname,
      lastname,
      middlename,
      dateOfBirth,
      password: hashedPassword,
      signInType,
    });

    return user;
  }

  public async signin(signinData: {
    email?: string;
    username?: string;
    password: string;
  }) {
    const { email, username, password } = signinData;

    const user = await new UserService().getUserByIdentifier(
      email,
      username,
      true
    );

    if (!user) {
      throw new HttpException(
        401,
        `error`,
        `Invalid email/username or password`,
        `E-401`
      );
    }

    if (!user.password) {
      throw new HttpException(
        401,
        "error",
        "Invalid email/username or password",
        "E-401"
      );
    }

    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        401,
        `error`,
        `Invalid email/username or password`,
        `E-401`
      );
    }

    return user;
  }

  public async resetPassword(email: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await new UserService().update(email, {
      password: hashedPassword,
    });

    if (!user)
      throw new HttpException(
        404,
        `error`,
        `User with the ID ${email} not found`,
        `E-404`
      );

    return user;
  }
}

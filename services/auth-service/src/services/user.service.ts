import { Types } from "mongoose";
import User from "../models/user.model";
import { HttpException } from "../exceptions/http.exception";
import { ERROR_CODES, STATUS_ERROR } from "../config/constants";

export default class UserService {
  public async getUserById(id: string) {
    return await User.findById(id);
  }

  public async getUserByEmail(email: string, includePassword = false) {
    const query = User.findOne({ email });

    if (includePassword) {
      query.select("+password");
    }

    return await query;
  }

  public async getUserByUsername(username: string) {
    return await User.findOne({ username });
  }

  public async checkUserExists(username: string, email: string) {
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    return user ? true : false;
  }

  public async getUserByIdentifier(
    email?: string,
    username?: string,
    includePassword = false
  ) {
    const query = User.findOne({
      $or: [{ email }, { username }],
    });

    if (includePassword) {
      query.select("+password");
    }

    return await query;
  }

  public async createUser(userData: any) {
    const user = new User(userData);
    return await user.save();
  }

  public async deleteUserById(id: string) {
    return await User.findByIdAndDelete(id);
  }

  public async getUsers() {
    return await User.find({}).select(`
      email username firstname lastname middlename profileUrl
      bio location role isVerified isActive
      followerCount postCount createdAt updatedAt
    `);
  }

  public async update(email: string, data: any) {
    // return await User.findByIdAndUpdate(id, data, { new: true });
    return await User.findOneAndUpdate({ email }, data, { new: true });
  }

  public async getProfile(userId: string) {
    return await User.findById(userId);
  }
}

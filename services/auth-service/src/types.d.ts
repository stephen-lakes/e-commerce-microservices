export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  role: `admin` | `user`;
  // add other fields as needed
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

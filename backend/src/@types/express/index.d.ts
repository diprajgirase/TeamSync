import { UserDocument } from "../../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      jwt?: string;
    }
  }
}

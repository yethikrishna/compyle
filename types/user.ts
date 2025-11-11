import { User } from "better-auth";

export interface ActualUser extends User {
  role: "user" | "admin";
  username: string;
}

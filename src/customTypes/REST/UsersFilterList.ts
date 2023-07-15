/** Represents the available field types that can be used for filtering in the `/api/users` route */
import { IUser } from "../models/User";

export type UsersFilterList = (keyof IUser)[];

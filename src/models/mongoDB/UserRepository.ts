import { IUser } from "../../customTypes/models/User";
import User from "./schemas/User";
import UserModelType from "../../customTypes/models/User";
import logger from "../../logger";
/** functions for interacting with the database */

/** Given the wa_id of the user, find the document in the users collection */
export async function getUser(wa_id: IUser["wa_id"]): Promise<UserModelType | null> {
    // Find document in the db
    let userRef: UserModelType | null;
    try {
      userRef = await User.findOne({ wa_id: wa_id });
      console.log(userRef, "jasjdfjadfj")
      logger.verbose(
        `Find one User with the given wa_id ${wa_id} completed. Document is null: ${userRef === null}`
        );
      return userRef;
    } catch (error) {
      logger.error(
        `Could not fetch user document with wa_id '${wa_id}' from database. ${error}`
        );
      return null;
    }
  }
  
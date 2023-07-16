import { IUser } from "../../customTypes/models/User";
import User from "./schemas/User";
import UserModelType from "../../customTypes/models/User";
import logger from "../../logger";
import { UsersFilterList } from "../../app";

/**
 * Retrieves the user document from the database based on the provided wa_id.
 * @param wa_id - The wa_id of the user.
 * @param filterList - Optional list of fields to select from the document.
 * @returns The user document or null if not found.
 */
export async function getUser(
  wa_id: IUser["wa_id"],
  filterList: UsersFilterList = [],
  limit?: number
): Promise<UserModelType | null> {
  let userRef: UserModelType | null;

  try {
    if (filterList.length > 0) {
      if (!limit) {
        // This will ensure that the select operation is applied to the query before it is executed.
        userRef = await User.findOne({ wa_id: wa_id }).select(filterList);
      } else {
        userRef = await User.findOne({ wa_id })
          .select(filterList)
          // -n means [..., n] fetch from right to left.
          .slice("whatsapp_messages", limit)
          .exec();
      }
    } else {
      // Without filter
      userRef = await User.findOne({ wa_id: wa_id });
    }
    logger.verbose(
      `Find one User with the given wa_id ${wa_id} completed. Document is null: ${
        userRef === null
      }`
    );
    return userRef;
  } catch (error) {
    logger.error(
      `Could not fetch user document with wa_id '${wa_id}' from the database. ${error}`
    );
    return null;
  }
}

import { Types } from "mongoose";
import { IUser } from "../models/User";

/** This represent the contact list that is sent to the user when he intially connect to the socket */
export interface IClientStoredContact {
    wa_id: IUser["wa_id"];
    name: IUser["name"];
    // TODO: should not be optional
    _id?: Types.ObjectId  // the document id of the user.
    
    // TODO: profileImage source should be provided. 
}
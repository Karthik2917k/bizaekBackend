import User from "../models/user.model";

export const handleValidUser = async (id: string): Promise<boolean | false> => {
  try {
    const userData = await User.findOne({_id:id}).exec();
    if (!userData) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return false;
  }
};

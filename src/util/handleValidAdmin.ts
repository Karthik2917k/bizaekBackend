import User from "../models/admin.model";

export const handleValidAdmin = async (id: string): Promise<boolean | false> => {
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

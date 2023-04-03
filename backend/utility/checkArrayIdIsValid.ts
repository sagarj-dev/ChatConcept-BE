import { isValidObjectId } from "mongoose";

const checkArrayIdIsValid = (ids: string[]) => {
  let isAllIdValid = true;
  ids.forEach((id) => {
    if (!isValidObjectId(id)) {
      isAllIdValid = false;
    }
  });

  return isAllIdValid;
};

export default checkArrayIdIsValid;

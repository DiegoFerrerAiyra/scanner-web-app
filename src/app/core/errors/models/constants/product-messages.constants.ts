import { CErrorCodes } from "@core/errors/models/constants/codes.constants";
import { CErrorContext } from "@core/errors/models/constants/context.constants";

export const CErrorMessages: CErrorMessagesType = {
    [CErrorCodes.TOKEN_EXPIRED]: {
        [CErrorContext.ADD_TEEN]: ''
    },
    [CErrorCodes.EMAIL_EXISTS]: {
        [CErrorContext.ADD_TEEN]: '',
        [CErrorContext.KYC]: ''
    },
};

interface CErrorMessagesType {
    [errorCode: string]: {
      [context: string]: string;
    };
  }

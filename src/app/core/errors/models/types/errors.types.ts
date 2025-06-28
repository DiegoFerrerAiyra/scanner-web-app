import { CErrorCodes } from "@core/errors/models/constants/codes.constants";
import { CErrorContext } from "@core/errors/models/constants/context.constants";

export type errorCodesType = typeof CErrorCodes[keyof typeof CErrorCodes];

export type ErrorCodeTypes = {
    [key in errorCodesType]: string;
};

export type errorContextType = typeof CErrorContext[keyof typeof CErrorContext];

export type ErrorMessage = {
    [key in errorContextType]: string;
};


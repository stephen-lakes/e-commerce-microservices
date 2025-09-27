export const v1Base = `/api/v1/`;
export const AppName = `Auth Service`;

export const SIGN_IN_TYPE_DEFAULT = `default`;
export const SIGN_IN_TYPE_GOOGLE = `google`;
export const SIGN_IN_TYPES = [SIGN_IN_TYPE_DEFAULT, SIGN_IN_TYPE_GOOGLE];
export const STATUS_SUCCESS = `Success`;
export const STATUS_ERROR = `Error`;
export const STATUS_FAIL = `Fail`;

export const ERROR_CODES = {
  ERR_CODE_400: `E-400`, // Validation Error
  ERR_CODE_401: `E-401`, // Unauthorised or Expired OTP
  ERR_CODE_403: `E-403`, // Access denied
  ERR_CODE_404: `E-404`, // Not Found
  ERR_CODE_500: `E-500`, // Internal server error
};

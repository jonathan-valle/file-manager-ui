export enum PdfErrorType {
  Unknown = "UNKNOWN",
  PasswordProtected = "PASSWORD_PROTECTED",
  InvalidFormat = "INVALID_FORMAT",
  Permissions = "PERMISSIONS",
}

export interface PdfError {
  type: PdfErrorType;
}

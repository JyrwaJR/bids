export const oneUpperCaseRegex = RegExp(/^(?=.*[A-Z]).+$/);
export const oneLowerCaseRegex = RegExp(/^(?=.*[a-z]).+$/);
export const oneSpecialCharacterOrSpace = RegExp(/^(?=.*[!@#$%^&*]).+$/);
export const oneNumberRegex = RegExp(/^(?=.*[0-9]).+$/);
export const PasswordRegex = RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
);

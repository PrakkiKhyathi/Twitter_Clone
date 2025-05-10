export function validateFirstName(value) {
  const regx = /^[A-Z][a-z]+( [A-Z][a-z]+)*$/;
  return regx.test(value);
}
export function validateEmailId(value) {
  const regx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}$/;
  return regx.test(value);
}
export function validateDateOfBirth(value) {
  const dob = new Date(value);
  const today = new Date();
  const minAgeDate = new Date();
  minAgeDate.setFullYear(today.getFullYear() - 18);
  return dob < minAgeDate ? true : false;
}
export function validatePassword(value) {
  const regx =
    /^(?=.*\d) (?=.[a-z]) (?=.[A-Z]) (?=.[@#$!?%^&]) [A-Za-z\d@#$!?%^&]{8,16}$/;
  return regx.test(value);
}
export function validateConfirmPassword(password, confirmPassword) {
  return password === confirmPassword;
}

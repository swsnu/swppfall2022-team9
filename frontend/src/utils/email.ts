export const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const checkEmailValidity = (email: string) => {
  return emailRegex.test(email);
};

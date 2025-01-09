export const generateOTP = (): string => {
  return String(Math.floor(Math.random() * 9000 + 1000));
};

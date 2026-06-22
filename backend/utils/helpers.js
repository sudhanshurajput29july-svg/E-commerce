import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey1234567890', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

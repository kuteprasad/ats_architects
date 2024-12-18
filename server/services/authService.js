import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export const authService = {
  generateToken: (user) => {
    const payload = { 
      id:     user.Candidate_ID, 
      email:  user.Email 
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    return token;
  },

  verifyToken: (token) => {
    return jwt.verify(token, SECRET_KEY);
  },
};

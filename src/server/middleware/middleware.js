import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { Token } from '../models/token.js';

export const authenticateToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is not valid' });

    if (!user?.email) {
      return res.status(401).json({ message: 'Token payload is invalid' });
    }

    // console.log(user);


    // todo: check if token exists in database, and belongs to that user.
    /*
      const dbUser = await User.findOne({ email: user.email });
      if (!dbUser || !dbUser.token) {
        return res.status(401).json({ message: 'Token not found in database' });
      }
      // Compare token
      if (dbUser.token !== token) {
        return res.status(401).json({ message: 'Token is not valid **' });
      }
    */

    const dbUser = await User.findOne({ email: user.email });
    if (!dbUser) {
      return res.status(401).json({ message: 'Wrong person' });
    }
    const dbToken = await Token.findOne({ userId: dbUser._id });
    if (!dbToken) {
      return res.status(401).json({ message: 'Token not found in database' });
    }
    // Compare token
    if (dbToken.token !== token) {
      return res.status(401).json({ message: 'Token is not valid **' });
    }

    req.user = user;
    next();
  });
}


// Access toke store in database and check if token is valid in authenticateToken function
// Hash token before storing in database and compare hashed token in authenticateToken function
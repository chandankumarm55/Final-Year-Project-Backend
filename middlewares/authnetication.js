import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log('token', token);
    if (!token) {
      return res.status(401).json({ message: "User Not authenticated" });
    }

    const decode = await jwt.verify(token, process.env.JWT_KEY);
    console.log('decode', decode);
    if (!decode) {
      return res.status(401).json({ message: 'Invalid Token' });
    }

    req.id = decode.userId;
    console.log('req.id', req.id);
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default isAuthenticated;

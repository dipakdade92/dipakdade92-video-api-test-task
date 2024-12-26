exports.authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    
    
    if (token === `${process.env.API_TOKEN}`) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
};
  
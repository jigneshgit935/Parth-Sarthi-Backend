import jwt from 'jsonwebtoken';

function checkAuth(req, res, next) {
  // 1. get auth and refresh token from cookies , if they dont exist return error
  // 2. check expiry of Auth Token,  if auth token is not expired then all is well exit function
  // 3. check expiry of Refresh Token, if refresh token is expired then ask for re-login
  // 3. if refresh token is not expired but auth token is expired then regenerate both tokens

  const authToken = req.cookies.authToken;
  const refreshToken = req.cookies.refreshToken;
  console.log('Check Auth-Token Middleware Called');

  if (!authToken || !refreshToken) {
    return res.status(401).json({
      message: 'Authentication failed: No authtoken or refreshToken provided',
    });
  }
  jwt.verify(authToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
    //   expired
    if (err) {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY,
        (refreshErr, refreshDecoded) => {
          // refresh token is expired and access token is expired
          if (refreshErr) {
            // Both token are invalid, send an error message and prompt for login
            return res.status(401).json({
              message: 'Authentication failed: Both tokens are Invalid',
            });
          } else {
            const newAuthToken = jwt.sign(
              { userId: refreshDecoded.userId },
              process.env.JWT_SECRET_KEY,
              { expiresIn: '10m' }
            );
            const newRefreshToken = jwt.sign(
              { userId: refreshDecoded.userId },
              process.env.JWT_REFRESH_SECRET_KEY,
              { expiresIn: '40m' }
            );

            res.cookies('authToken', newAuthToken, { httpOnly: true });
            res.cookies('refreshToken', newRefreshToken, { httpOnly: true });

            req.userId = refreshDecoded.userId;
            next();
          }

          // refresh token is not expired and access token is expired
        }
      );
    }
    // not expired
    else {
      req.userId = decoded.userId;
      next();
    }
  });
}

export default checkAuth;

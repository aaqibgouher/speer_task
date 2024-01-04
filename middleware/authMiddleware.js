const authService = require("../service/authService");

const isAuthenticated = async (req, res, next) => {
  try {
    // take token from the request
    const token = req.headers.authorization?.split(" ")[1];

    // token validation
    if (!token || !token.trim()) throw "Please login to continue";

    // if there, decode it, if not able to decode, throw error
    const decodedTokenObj = await authService.verifyToken({ token });

    // check user exists by that userId or not, if not throw error
    const user = await authService.getUserById(decodedTokenObj?.userId);

    if (!user) throw "User not found, kindly login/register again";

    // if decoded, check token in tokens table, if not found, throw error
    const userToken = await authService.getUserTokenByUserIdAndToken(
      user._id,
      token
    );

    if (!userToken) throw "Please login again";

    // if user exists, token exist then add user in req,
    req.user = user;
    req.token = token;

    // call next
    next();
  } catch (error) {
    console.log(error, "from is authenticated ");
    return res.json({ status: 400, error });
  }
};

module.exports = {
  isAuthenticated,
};

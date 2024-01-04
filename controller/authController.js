const authService = require("../service/authService");

const register = async (req, res) => {
  try {
    // take value
    const { name, email, password } = req.body;

    // calling service
    const data = await authService.register({ name, email, password });

    // returnig response
    return res.json({
      status: 200,
      message: "Successfully register",
      data,
    });
  } catch (err) {
    // returning error
    console.log(err, "from register controller");
    return res.json({ status: 400, error: err });
  }
};

const login = async (req, res) => {
  try {
    // take value
    const { email, password } = req.body;

    // calling service
    const data = await authService.login({ email, password });

    // returnig res
    return res.json({
      status: 200,
      message: "Successfully login",
      data,
    });
  } catch (err) {
    // returnnig error
    console.log(err, "from login controller");
    return res.json({ status: 400, error: err });
  }
};

const logout = async (req, res) => {
  try {
    // calling service
    const data = await authService.logout({
      userId: req.user._id,
      token: req.token,
    });

    // returning res
    return res.json({
      status: 200,
      message: "Successfully logout",
      data,
    });
  } catch (error) {
    // returning error
    console.log(error, "from logout controller");
    return res.json({ status: 400, error });
  }
};

const getMe = async (req, res) => {
  try {
    // taking logged in user value from req, since we already pushed the value in req in middleware
    const data = req.user;

    // returnig res
    return res.json({
      status: 200,
      message: "Successfully get me",
      data,
    });
  } catch (error) {
    // returning error
    console.log(error, "from get me controller");
    return res.json({ status: 400, error });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};

const get404 = (req, res, next) => {
  res.status(400).json({
    message: "Bad request.",
  });
};

module.exports = { get404 };

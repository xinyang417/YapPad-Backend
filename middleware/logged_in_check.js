function logged_in_check_middleware(req, res, next) {
  if (req.session.user_id) {
    next()
  } else {
    res.status(400).json({ message: "Not logged in!" })
    res.redirect('/login'); // Redirect to the login page
  }
}

module.exports = logged_in_check_middleware
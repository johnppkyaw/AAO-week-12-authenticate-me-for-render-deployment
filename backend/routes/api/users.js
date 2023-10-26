const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
  check('firstName')
    .exists({ checkFalsy: true})
    .isLength({min: 1})
    .withMessage('Please provide a first name with at least 1 character.'),
  check('lastName')
    .exists({ checkFalsy: true})
    .isLength({min: 1})
    .withMessage('Please provide a first name with at least 1 character.'),
  check('email')
    .exists({ checkFalsy: true})
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true})
    .isLength({ min: 4})
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({checkFalsy: true})
    .isLength({min: 6})
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
]

//sign up user
router.post('/', validateSignup, async(req, res) => {

  //get email, password, and username submited to req.body
  const{ firstName, lastName, email, username, password } = req.body;

  //signup user using the variables above
  const user = await User.signup({firstName, lastName, email, username, password});

  await setTokenCookie(res, user);

  return res.json({
    user
  });
})

module.exports = router;

const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

//sign up user
router.post('/', async(req, res) => {

  //get email, password, and username submited to req.body
  const{ email, password, username} = req.body;

  //signup user using the variables above
  const user = await User.signup({email, password, username});

  await setTokenCookie(res, user);

  return res.json({
    user
  });
})

module.exports = router;

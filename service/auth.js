const { appError, handleErrorAsync } = require('../service/errorHandler');
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');

const isAuth = handleErrorAsync(async (req, res, next) => {
  // 確認 token 是否存在
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(appError(401, '請輸入帳號密碼進行登入！', "", next));
  }

  // 驗證 token 正確性 - 解密 token
  const getDecryptedJWT = (token) => jwt.verify(token, process.env.JWT_SECRET);
  const decoded = getDecryptedJWT(token);
  if(!decoded){
    return next(appError(401, '請輸入帳號密碼進行登入！', "", next));
  }

  const currentEditor = await User.findById(decoded.id);
  if (!currentEditor) {
    return next(appError(401, '請輸入帳號密碼進行登入！', "", next));
  }

  req.user = currentEditor; // 自訂屬性，傳到下一個 middleware
  next();
});

const getJWT = (user) =>
  // 產生 JWT token
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY
  });

module.exports = {
  isAuth,
  getJWT
}


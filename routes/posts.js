const express = require('express');
const router = express.Router();
const PostsControllers = require('../controllers/postsControllers');
const { isAuth } = require('../service/auth');

// 觀看所有動態
router.get('/', isAuth, PostsControllers.getPosts);

// 張貼個人動態 - 新增貼文
router.post('/', isAuth, PostsControllers.insertPost);

module.exports = router;
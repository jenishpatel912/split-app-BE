import express from 'express'
import { createUserController, loginUserController } from '../controller/user.js';
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json('respond with a resource');
});

router.post("/create",createUserController)
router.post("/login",loginUserController)

export default router;

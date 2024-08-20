import express from 'express'
import { createUserController, loginUserController,getAllUser } from '../controller/user.js';
import { authMiddleware } from '../middleware/auth.middelware.js';
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json('respond with a resource');
});

router.post("/create",createUserController)
router.post("/login",loginUserController)
router.use(authMiddleware);
router.get("/list",getAllUser)


export default router;

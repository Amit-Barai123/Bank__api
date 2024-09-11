import express from "express";
import { allUserController, loginController, paymentController, registerController, userDetailController } from "../controllers/userController.js";


//router object
const router = express.Router();


router.post("/register", registerController);


router.post("/login", loginController);

router.post('/payment',paymentController);

router.post('/user',userDetailController);

router.get('/allUser',allUserController);


export default router;
import { Router } from "express";
import * as controller from '../controllers/apiController'

const router = Router();

router.get('/', controller.home)

export default router;
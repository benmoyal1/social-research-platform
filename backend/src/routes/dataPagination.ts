import { Router } from 'express';
import * as telegramController from '../controllers/telegramController.js';
import * as twitterController from '../controllers/twitterController.js';

const router = Router();

// Telegram pagination
router.post('/paginate/telegram', telegramController.getPaginatedMessages);

// Twitter pagination
router.post('/paginate/twitter', twitterController.getPaginatedPosts);

export default router;

import express from 'express';
import * as telegramController from '../controllers/telegramController.js';
import * as twitterController from '../controllers/twitterController.js';

const router = express.Router();

// Telegram pagination
router.post('/paginate/telegram', telegramController.getPaginatedMessages);

// Twitter pagination
router.post('/paginate/twitter', twitterController.getPaginatedPosts);

export default router;

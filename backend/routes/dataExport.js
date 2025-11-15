import express from 'express';
import * as telegramController from '../controllers/telegramController.js';
import * as twitterController from '../controllers/twitterController.js';

const router = express.Router();

// Telegram export routes
router.get('/export/telegram/all', telegramController.exportAllMessages);
router.post('/export/telegram/filtered', telegramController.exportFilteredMessages);

// Twitter export routes
router.get('/export/twitter/all', twitterController.exportAllPosts);
router.post('/export/twitter/filtered', twitterController.exportFilteredPosts);

// Metadata routes
router.get('/metadata/telegram/channels', telegramController.getChannels);
router.get('/metadata/twitter/users', twitterController.getUsers);

// Stats routes
router.get('/stats/telegram', telegramController.getStats);
router.get('/stats/twitter', twitterController.getStats);

export default router;

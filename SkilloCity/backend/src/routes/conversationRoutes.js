import { Router } from 'express';
import { getConversations, getMessages, sendMessage } from '../controllers/conversationController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/', auth, getConversations);
router.get('/:id/messages', auth, getMessages);
router.post('/:id/messages', auth, sendMessage);

export default router;

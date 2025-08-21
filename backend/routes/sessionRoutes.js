import express from 'express';
import { createNewSession,continueSession,getAllSessions,getSessionById} from '../controllers/sessionController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/newSession', authenticateToken, createNewSession);
router.post('/continueSession/:sessionId', authenticateToken, continueSession);
router.get('/allSessions',authenticateToken, getAllSessions);
router.get('/:sessionId', authenticateToken, getSessionById);

export default router;

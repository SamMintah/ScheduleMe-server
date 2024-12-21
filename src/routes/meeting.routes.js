import express from 'express';
import meetingController from '../controllers/meeting.controller.js';

const router = express.Router();

router.post('/', meetingController.createMeeting);
router.get('/users/:userId/available-slots', meetingController.getAvailableSlots);
router.put('/:meetingId', meetingController.updateMeeting);
router.delete('/:meetingId', meetingController.deleteMeeting);

export default router;
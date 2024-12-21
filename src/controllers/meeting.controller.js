import meetingService from '../services/meeting.service.js';

const meetingController = {
    createMeeting: (req, res) => {
        try {
            const newMeeting = meetingService.createMeeting(req.body);
            res.status(201).json(newMeeting);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getAvailableSlots: (req, res) => {
        try {
            const availableSlots = meetingService.getAvailableSlots(req.params.userId);
            res.json(availableSlots);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    updateMeeting: (req, res) => {
        try {
            const updatedMeeting = meetingService.updateMeeting(req.params.meetingId, req.body);
            res.json(updatedMeeting);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },
    
    deleteMeeting: (req, res) => {
        try {
            meetingService.deleteMeeting(req.params.meetingId);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
};

export default meetingController;
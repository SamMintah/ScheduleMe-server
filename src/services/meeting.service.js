import { v4 as uuidv4 } from 'uuid';
import moment from 'moment-timezone';
import { Meeting } from '../models/meeting.model.js';

const users = [
    { id: 'user1', timezone: 'America/New_York' },
    { id: 'user2', timezone: 'Europe/London' },
    { id: 'user3', timezone: 'Asia/Tokyo' }
];
const meetings = [];

const findUser = (userId) => users.find(user => user.id === userId);

const hasConflict = (newMeeting) => {
    return meetings.some(existingMeeting => {
        if (existingMeeting.participants.includes(newMeeting.participants[0]) || existingMeeting.participants.includes(newMeeting.participants[1])) {
            const newStart = moment.tz(newMeeting.startTime, newMeeting.timezone);
            const newEnd = moment.tz(newMeeting.startTime, newMeeting.timezone).add(newMeeting.duration, 'minutes');
            const existingStart = moment.tz(existingMeeting.startTime, existingMeeting.timezone);
            const existingEnd = moment.tz(existingMeeting.startTime, existingMeeting.timezone).add(existingMeeting.duration, 'minutes');

            return newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
        }
        return false;
    });
};

const meetingService = {
    createMeeting: (meetingData) => {
        const { startTime, duration, participants, title, description } = meetingData;
        if (participants.length !== 2) {
            throw new Error('A meeting must have exactly two participants');
        }
        const user1 = findUser(participants[0]);
        const user2 = findUser(participants[1]);

        if (!user1 || !user2) {
            throw new Error('One or more participants not found');
        }
        const timezone = user1.timezone;

        const newMeeting = new Meeting(uuidv4(), startTime, timezone, parseInt(duration), participants, title, description);

        if (hasConflict(newMeeting)) {
            throw new Error('Meeting time conflicts with existing schedule');
        }

        meetings.push(newMeeting);
        console.log('Meeting Scheduled:', newMeeting);
        return newMeeting;
    },
    
    getAvailableSlots: (userId) => {
        const user = findUser(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Mock data – replace with actual logic later
        return [
            { startTime: '2024-11-20T09:00:00', endTime: '2024-11-20T09:30:00' },
            { startTime: '2024-11-20T10:00:00', endTime: '2024-11-20T10:30:00' },
        ];
    },
    updateMeeting: (meetingId, meetingData) => {
        const meetingIndex = meetings.findIndex(m => m.id === meetingId);
        if (meetingIndex === -1) {
            throw new Error('Meeting not found');
        }
        meetings[meetingIndex] = { ...meetings[meetingIndex], ...meetingData };
        console.log('Meeting Updated:', meetings[meetingIndex]);
        return meetings[meetingIndex];
    },
    deleteMeeting: (meetingId) => {
        const meetingIndex = meetings.findIndex(m => m.id === meetingId);
        if (meetingIndex === -1) {
            throw new Error('Meeting not found');
        }
        meetings.splice(meetingIndex, 1);
        console.log('Meeting Canceled:', meetingId);
    }
};

export default meetingService;
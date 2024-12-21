import moment from 'moment-timezone';
import logger from '../config/logger.js';

class AvailabilityService {
  constructor() {
    this.workingHours = {
      start: 9, // 9 AM
      end: 17   // 5 PM
    };
  }

  getAvailableSlots(userId, date, meetings) {
    try {
      const user = this.findUser(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const slots = this.generateTimeSlots(date, user.timezone);
      const availableSlots = this.filterAvailableSlots(slots, meetings, userId);

      return availableSlots;
    } catch (error) {
      logger.error('Error calculating available slots:', error);
      throw error;
    }
  }

  generateTimeSlots(date, timezone) {
    const slots = [];
    const startTime = moment.tz(date, timezone).hour(this.workingHours.start).startOf('hour');
    const endTime = moment.tz(date, timezone).hour(this.workingHours.end).startOf('hour');

    while (startTime.isBefore(endTime)) {
      slots.push({
        startTime: startTime.format(),
        endTime: startTime.clone().add(30, 'minutes').format()
      });
      startTime.add(30, 'minutes');
    }

    return slots;
  }

  filterAvailableSlots(slots, meetings, userId) {
    return slots.filter(slot => {
      const slotStart = moment(slot.startTime);
      const slotEnd = moment(slot.endTime);

      return !meetings.some(meeting => {
        if (!meeting.participants.includes(userId)) {
          return false;
        }

        const meetingStart = moment(meeting.startTime);
        const meetingEnd = moment(meeting.startTime).add(meeting.duration, 'minutes');

        return slotStart.isBefore(meetingEnd) && slotEnd.isAfter(meetingStart);
      });
    });
  }
}

export default new AvailabilityService();
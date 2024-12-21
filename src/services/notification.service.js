import nodemailer from 'nodemailer';
import logger from '../config/logger.js';

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendMeetingNotification(type, meeting, participants) {
    try {
      const emailPromises = participants.map(participant => {
        const emailContent = this.getEmailContent(type, meeting, participant);
        return this.transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: participant.email,
          subject: emailContent.subject,
          html: emailContent.body
        });
      });

      await Promise.all(emailPromises);
      logger.info(`Meeting notifications sent for meeting: ${meeting.id}`);
    } catch (error) {
      logger.error('Error sending notifications:', error);
      throw new Error('Failed to send notifications');
    }
  }

  getEmailContent(type, meeting, participant) {
    const templates = {
      created: {
        subject: 'New Meeting Scheduled',
        body: `<h1>New Meeting Scheduled</h1>
               <p>A new meeting has been scheduled for ${meeting.startTime}</p>`
      },
      updated: {
        subject: 'Meeting Updated',
        body: `<h1>Meeting Updated</h1>
               <p>The meeting scheduled for ${meeting.startTime} has been updated</p>`
      },
      cancelled: {
        subject: 'Meeting Cancelled',
        body: `<h1>Meeting Cancelled</h1>
               <p>The meeting scheduled for ${meeting.startTime} has been cancelled</p>`
      }
    };

    return templates[type];
  }
}

export default new NotificationService();
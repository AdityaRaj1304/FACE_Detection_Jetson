const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

class EventService {
  /**
   * Insert an attendance log into the PostgreSQL database using Prisma
   * @param {Object} payload 
   * @returns {Object} inserted record
   */
  async logAttendance(payload) {
    try {
      const { student_id, student_name, timestamp, similarity_score, camera_id } = payload;
      
      // Calculate local timestamp just like the MQTT listener did
      // Or we can rely on the Jetson passing the absolute epoch
      const exactTime = new Date(timestamp * 1000);

      const record = await prisma.attendanceLog.create({
        data: {
          student_id,
          student_name: student_name || "Unknown Student",
          camera_id: camera_id ? parseInt(camera_id, 10) : null,
          similarity_score: parseFloat(similarity_score),
          timestamp: exactTime,
        },
      });

      return record;
    } catch (error) {
      logger.error('Error in EventService.logAttendance', error);
      throw error;
    }
  }
}

module.exports = new EventService();

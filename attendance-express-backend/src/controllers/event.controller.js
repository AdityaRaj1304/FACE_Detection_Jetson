const eventService = require('../services/event.service');
const logger = require('../utils/logger');

class EventController {
  /**
   * Handle incoming attendance POST request from the Jetson Nano
   */
  async receiveAttendance(req, res, next) {
    try {
      const { student_id, student_name, timestamp, similarity_score, device_id, camera_id } = req.body;

      // Basic Validation
      if (!student_id || !timestamp || similarity_score === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Invalid payload: missing required fields (student_id, timestamp, similarity_score)',
        });
      }

      logger.info(`Received attendance event from Device [${device_id || 'Unknown'}] for Student: ${student_id}`);

      // Intercept and check for Security Alerts before logging
      const alertService = require('../services/alert.service');
      alertService.checkEvent({
        student_id,
        student_name,
        similarity_score,
        timestamp,
        camera_id
      });

      // Call Service Layer to handle DB logic
      const record = await eventService.logAttendance({
        student_id,
        student_name,
        timestamp,
        similarity_score,
        camera_id,
      });

      // Emit live event to all connected dashboard clients
      try {
        const socketService = require('../services/socket.service');
        const io = socketService.getIO();
        io.emit('new_attendance', record);
      } catch (err) {
        logger.error('Could not emit new_attendance socket event.');
      }

      return res.status(201).json({
        success: true,
        message: 'Attendance logged successfully',
        data: record,
      });
    } catch (error) {
      next(error); // Pass to global error handler
    }
  }

  /**
   * Handle GET request for today's attendance
   */
  async getTodayAttendance(req, res, next) {
    try {
      const records = await eventService.getTodayAttendance();
      return res.status(200).json({
        success: true,
        data: records,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Proxy the live MJPEG video stream from Jetson Nano
   */
  async streamLiveFeed(req, res, next) {
    try {
      const { camera_id } = req.params;
      const jetsonIp = process.env.JETSON_NANO_IP || '192.168.1.100';
      const feedUrl = `http://${jetsonIp}:5001/video_feed_${camera_id}`;

      logger.info(`Proxying video stream from ${feedUrl}`);

      const axios = require('axios');
      
      const response = await axios({
        method: 'get',
        url: feedUrl,
        responseType: 'stream'
      });

      // Forward the headers and stream
      res.setHeader('Content-Type', response.headers['content-type'] || 'multipart/x-mixed-replace; boundary=frame');
      response.data.pipe(res);

    } catch (error) {
      logger.error('Error proxying live feed:', error.message);
      res.status(502).json({ success: false, error: 'Live feed unavailable or Jetson is offline.' });
    }
  }
}

module.exports = new EventController();

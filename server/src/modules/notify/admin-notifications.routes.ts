import { Router } from 'express';
import {
  getAdminNotificationsController,
  sendAdminNotificationController,
} from './admin-notifications.controller.js';

const router = Router();

/**
 * @route   GET /api/admin/notifications
 * @desc    [Admin] 獲取所有通知列表
 */
router.get('/', getAdminNotificationsController);

/**
 * @route   POST /api/admin/notifications/send
 * @desc    [Admin] 發送新通知
 */
router.post('/send', sendAdminNotificationController);

export default router;
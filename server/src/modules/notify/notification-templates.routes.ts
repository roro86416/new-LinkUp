import { Router } from 'express';
import verify from '../../middleware/verify.middleware.js';
import {
  createTemplateSchema,
  updateTemplateSchema,
} from './notification-templates.schema.js';
import {
  createTemplateController,
  deleteTemplateController,
  getAllTemplatesController,
  getTemplateByIdController,
  updateTemplateController,
} from './notification-templates.controller.js';

// 假設您有一個 adminAuth 中介軟體來驗證管理員身份
// import { adminAuth } from '../../middleware/adminAuth.middleware.js';

const router = Router();

// 這裡暫時使用通用的 verify，您應該換成管理員驗證的中介軟體
const adminOnly = verify;

// GET /api/notification-templates - 獲取所有模板
router.get('/', adminOnly, getAllTemplatesController);

// POST /api/notification-templates - 建立新模板
router.post('/', adminOnly(createTemplateSchema), createTemplateController);

// GET /api/notification-templates/:id - 獲取單一模板
router.get('/:id', adminOnly, getTemplateByIdController);

// PATCH /api/notification-templates/:id - 更新模板
router.patch('/:id', adminOnly(updateTemplateSchema), updateTemplateController);

// DELETE /api/notification-templates/:id - 刪除模板
router.delete('/:id', adminOnly, deleteTemplateController);

export default router;
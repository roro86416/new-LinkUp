import { z } from 'zod';

const notificationType = z.enum([
  'system',
  'event',
  'transaction',
  'review',
  'announcement',
]);

const targetRole = z.enum(['user', 'ORGANIZER', 'ALL']);

export const createTemplateSchema = z.object({
  body: z.object({
    title: z.string().min(1, '模板標題不能為空').max(100),
    message: z.string().min(1, '模板內容不能為空'),
    type: notificationType,
    target_role: targetRole.default('ALL'),
    is_active: z.boolean().default(true),
    created_by: z.string(), // 假設由 admin ID 建立
  }),
});

export const updateTemplateSchema = z.object({
  body: z.object({
    title: z.string().min(1, '模板標題不能為空').max(100).optional(),
    message: z.string().min(1, '模板內容不能為空').optional(),
    type: notificationType.optional(),
    target_role: targetRole.optional(),
    is_active: z.boolean().optional(),
  }),
});
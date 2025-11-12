import prisma from '../../utils/prisma-only.js';
import { z } from 'zod';
import {
  createTemplateSchema,
  updateTemplateSchema,
} from './notification-templates.schema.js';

type CreateTemplateInput = z.infer<typeof createTemplateSchema>['body'];
type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>['body'];

export const findAllTemplates = async () => {
  return prisma.notificationTemplate.findMany({
    orderBy: {
      created_at: 'desc',
    },
  });
};

export const findTemplateById = async (id: string) => {
  return prisma.notificationTemplate.findUnique({
    where: { id },
  });
};

export const createTemplate = async (data: CreateTemplateInput) => {
  return prisma.notificationTemplate.create({
    data,
  });
};

export const updateTemplate = async (id: string, data: UpdateTemplateInput) => {
  return prisma.notificationTemplate.update({
    where: { id },
    data,
  });
};

export const deleteTemplate = async (id: string) => {
  // 這裡使用硬刪除，如果需要軟刪除，請修改 schema 並更新這裡的邏輯
  return prisma.notificationTemplate.delete({
    where: { id },
  });
};
import { Request, Response } from 'express';
import {
  createTemplate,
  deleteTemplate,
  findAllTemplates,
  findTemplateById,
  updateTemplate,
} from './notification-templates.service.js';

export const getAllTemplatesController = async (req: Request, res: Response) => {
  try {
    const templates = await findAllTemplates();
    res.json({ status: 'success', data: templates });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};

export const getTemplateByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const template = await findTemplateById(id);
    if (!template) {
      return res
        .status(404)
        .json({ status: 'error', message: '找不到指定的模板' });
    }
    res.json({ status: 'success', data: template });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};

export const createTemplateController = async (req: Request, res: Response) => {
  try {
    const newTemplate = await createTemplate(req.body);
    res.status(201).json({ status: 'success', data: newTemplate });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};

export const updateTemplateController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updatedTemplate = await updateTemplate(id, req.body);
    res.json({ status: 'success', data: updatedTemplate });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};

export const deleteTemplateController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await deleteTemplate(id);
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};
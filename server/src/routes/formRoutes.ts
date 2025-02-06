import { Router } from 'express';
import { FormController } from '../controllers/formController';

const router = Router();

// 表单配置路由
router.get('/forms/:formId', FormController.getFormConfig);
router.get('/forms/:formId/metadata', FormController.getFormMetadata);

// 数据提供者路由
router.get('/forms/data-providers', FormController.getDataProviders);

// 验证路由
router.post('/forms/:formId/sections/:sectionId/validate', FormController.validateFormSection);

// 提交路由
router.post('/submit', FormController.submitForm);

export default router; 
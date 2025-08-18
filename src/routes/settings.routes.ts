import { Router } from 'express';
import {
  getSettings,
  getShippingSettings,
  updateSettings,
  updateShippingSettings,
  resetSettings,
} from '../controllers/settings.controller';

const router: Router = Router();

router.get('/settings', getSettings);
router.get('/settings/shipping', getShippingSettings);
router.put('/settings', updateSettings);
router.put('/settings/shipping', updateShippingSettings);
router.post('/settings/reset', resetSettings);

export default router;
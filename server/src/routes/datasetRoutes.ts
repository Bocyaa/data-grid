import express from 'express';
import multer from 'multer';
import {
  getAllDatasets,
  getDatasetById,
  getDatasetRowById,
  deleteDatasetById,
  deleteRowById,
  uploadDataset,
} from 'controllers/datasetControllers';

import { validateQuery, validateParams } from 'middleware/validate';

import {
  getDatasetQuerySchema,
  datasetIdSchema,
  rowIdSchema,
} from 'validators/datasetValidators';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/datasets', validateQuery(getDatasetQuerySchema), getAllDatasets);
router.get('/dataset/:id', validateParams(datasetIdSchema), getDatasetById);
router.get(
  '/dataset/:datasetId/:rowId',
  validateParams(rowIdSchema),
  getDatasetRowById
);

router.delete(
  '/dataset/:datasetId',
  validateParams(datasetIdSchema),
  deleteDatasetById
);
router.delete(
  '/dataset/:datasetId/:rowId',
  validateParams(rowIdSchema),
  deleteRowById
);

router.post('/dataset', upload.single('file'), uploadDataset);

export default router;

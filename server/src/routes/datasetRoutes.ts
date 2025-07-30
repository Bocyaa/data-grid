import express from 'express';
import multer from 'multer';
import {
  deleteDataset,
  deleteRow,
  getAllDatasets,
  getRow,
  getSingleDataset,
  createDataset,
} from 'controllers/datasetControllers';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/datasets', getAllDatasets);
router.get('/dataset/:id', getSingleDataset);
router.get('/dataset/:datasetId/:rowId', getRow);

router.post('/dataset', upload.single('file'), createDataset);

router.delete('/dataset/:datasetId', deleteDataset);
router.delete('/dataset/:datasetId/:rowId', deleteRow);

export default router;

import express from 'express';
const router = express.Router();

import generalRoutes from './general.js';
import subjectRoutes from './subject.js';
import gradeRoutes from './grade.js';
import accountRoutes from './account.js';
import fileRoutes from './file.js';
import verifyRoutes from './verify.js';
import assessmentRoutes from './assessment.js';
import markRoutes from './mark.js';

// Object routes
router.use("/general", generalRoutes);
router.use("/subject", subjectRoutes);
router.use("/grade", gradeRoutes);
router.use("/account", accountRoutes);
router.use("/file", fileRoutes);
router.use("/verify", verifyRoutes);
router.use("/assessment", assessmentRoutes);
router.use("/mark", markRoutes);

export default router;

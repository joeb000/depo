import { Router } from 'express'
import profiles from './profiles'
import express from 'express'

const router = new Router()

router.use('/profiles', profiles)
router.use('/images', express.static(process.env.UPLOAD_DIR))

export default router

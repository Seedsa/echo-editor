import { Router } from 'express'

const router: Router = Router()

router.get('/hello', (req, res) => {
  return res.send('okok')
})

export default router

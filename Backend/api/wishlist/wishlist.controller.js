import { wishlistService } from './wishlist.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getWishlist(req, res) {
  try {
    const items = await wishlistService.query(req.query)
    res.json(items)
  } catch (err) {
    loggerService.error('Failed to get wishlist', err)
    res.status(500).send({ error: 'Failed to get wishlist' })
  }
}

export async function addWishlist(req, res) {
  try {
    const saved = await wishlistService.add(req.body)
    res.status(201).json(saved)
  } catch (err) {
    loggerService.error('Failed to add wishlist item', err)
    res.status(err.status || 500).send({ error: err.message || 'Failed to add wishlist item' })
  }
}

export async function removeWishlist(req, res) {
  try {
    const { id } = req.params
    await wishlistService.remove(id)
    res.send({ ok: true })
  } catch (err) {
    loggerService.error('Failed to remove wishlist item', err)
    res.status(err.status || 500).send({ error: err.message || 'Failed to remove wishlist item' })
  }
}

export async function clearWishlist(req, res) {
  try {
    const result = await wishlistService.removeMany(req.query)
    res.send({ ok: true, removed: result.deletedCount || 0 })
  } catch (err) {
    loggerService.error('Failed to clear wishlist', err)
    res.status(err.status || 500).send({ error: err.message || 'Failed to clear wishlist' })
  }
}

import express from 'express'
import {
  getWishlist,
  addWishlist,
  removeWishlist,
  clearWishlist,
} from './wishlist.controller.js'

export const wishlistRoutes = express.Router()

wishlistRoutes.get('/', getWishlist)
wishlistRoutes.post('/', addWishlist)
wishlistRoutes.delete('/', clearWishlist)
wishlistRoutes.delete('/:id', removeWishlist)

'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchProductById } from '../api/api'
import { useCart } from '../context/CartContext'
import { Loader } from '../components/Loader'
import WebApp from '@twa-dev/sdk'

import '../styles/ProductDetailPage.css'

const ProductDetailPage = () => {
	const { id } = useParams()
	const [product, setProduct] = useState(null)
	const [loading, setLoading] = useState(true)
	const [quantity, setQuantity] = useState(1)
	const { addToCart } = useCart()

	useEffect(() => {
		const loadProduct = async () => {
			if (!id) return

			setLoading(true)
			try {
				const productData = await fetchProductById(id)
				setProduct(productData)
			} catch (error) {
				console.error('Error loading product:', error)
			} finally {
				setLoading(false)
			}
		}

		loadProduct()
	}, [id])

	const handleAddToCart = () => {
		if (product) {
			addToCart(product, quantity)
			WebApp.showPopup({
				title: 'Added to Cart',
				message: `${product.name} has been added to your cart.`,
				buttons: [{ type: 'ok' }],
			})
		}
	}

	const decreaseQuantity = () => {
		if (quantity > 1) {
			setQuantity(quantity - 1)
		}
	}

	const increaseQuantity = () => {
		setQuantity(quantity + 1)
	}

	if (loading) {
		return <Loader />
	}

	if (!product) {
		return <div className='error-message'>Product not found</div>
	}

	return (
		<div className='product-detail-page'>
			<motion.div
				className='product-image-container'
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5 }}
			>
				<img
					src={product.imageUrl || '/placeholder.svg'}
					alt={product.name}
					className='product-image'
				/>
			</motion.div>

			<motion.div
				className='product-info'
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				<h1 className='product-name'>{product.name}</h1>
				<div className='product-brand'>By {product.brand}</div>
				<div className='product-category'>Category:</div>
				<div className='product-volume'>Volume: {product.volume}</div>
				<p className='product-description'>{product.description}</p>

				<div className='product-price'>
					{product.price.toLocaleString()} so'm
				</div>

				<div className='quantity-selector'>
					<button onClick={decreaseQuantity} className='quantity-btn'>
						-
					</button>
					<span className='quantity'>{quantity}</span>
					<button onClick={increaseQuantity} className='quantity-btn'>
						+
					</button>
				</div>

				<button
					onClick={handleAddToCart}
					className='add-to-cart-btn'
					disabled={!product.inStock}
				>
					{product.inStock ? 'Add to Cart' : 'Out of Stock'}
				</button>
			</motion.div>
		</div>
	)
}

export default ProductDetailPage

'use client'

import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import '../styles/ProductCard.css'

const ProductCard = ({ product }) => {
	const { addToCart } = useCart()

	const handleAddToCart = e => {
		e.preventDefault()
		e.stopPropagation()
		addToCart(product, 1)
	}

	return (
		<motion.div
			className='product-card'
			whileHover={{ y: -5, transition: { duration: 0.2 } }}
		>
			<Link to={`/product/${product._id}`} className='product-link'>
				<div className='product-image-container'>
					<img
						src={product.imageUrl || '/placeholder.svg'}
						alt={product.name}
						className='product-image'
					/>
				</div>

				<div className='product-info'>
					<h3 className='product-name'>{product.name}</h3>
					<p className='product-brand'>{product.brand}</p>
					<p className='product-category'></p>
					<div className='product-price-row'>
						<p className='product-price'>
							{product.price.toLocaleString()} so'm
						</p>
						<button
							className='add-to-cart-icon'
							onClick={handleAddToCart}
							aria-label='Add to cart'
						>
							<ShoppingCart size={18} />
						</button>
					</div>
				</div>
			</Link>
		</motion.div>
	)
}

export default ProductCard

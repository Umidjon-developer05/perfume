'use client'

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import WebApp from '@twa-dev/sdk'

import '../styles/CartPage.css'

const CartPage = () => {
	const { items, removeFromCart, updateQuantity, totalPrice } = useCart()
	const navigate = useNavigate()

	const handleCheckout = () => {
		if (items.length === 0) {
			WebApp.showPopup({
				title: 'Empty Cart',
				message: 'Your cart is empty. Add some products before checkout.',
				buttons: [{ type: 'ok' }],
			})
			return
		}

		navigate('/checkout')
	}

	if (items.length === 0) {
		return (
			<div className='empty-cart'>
				<h2>Your Cart is Empty</h2>
				<p>Add some perfumes to your cart</p>
				<Link to='/' className='continue-shopping-btn'>
					Continue Shopping
				</Link>
			</div>
		)
	}

	return (
		<div className='cart-page'>
			<h1>Your Cart</h1>

			<div className='cart-items'>
				{items.map(item => (
					<motion.div
						key={item.productId}
						className='cart-item'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
					>
						<div className='item-image'>
							<img src={item.imageUrl || '/placeholder.svg'} alt={item.name} />
						</div>

						<div className='item-details'>
							<h3>{item.name}</h3>
							<p className='item-price'>{item.price.toLocaleString()} so'm</p>

							<div className='item-quantity'>
								<button
									onClick={() =>
										updateQuantity(item.productId, item.quantity - 1)
									}
									className='quantity-btn'
								>
									-
								</button>
								<span>{item.quantity}</span>
								<button
									onClick={() =>
										updateQuantity(item.productId, item.quantity + 1)
									}
									className='quantity-btn'
								>
									+
								</button>
							</div>
						</div>

						<div className='item-total'>
							<p>{(item.price * item.quantity).toLocaleString()} so'm</p>
							<button
								onClick={() => removeFromCart(item.productId)}
								className='remove-btn'
							>
								Remove
							</button>
						</div>
					</motion.div>
				))}
			</div>

			<div className='cart-summary'>
				<div className='summary-row'>
					<span>Total:</span>
					<span className='total-price'>
						{totalPrice.toLocaleString()} so'm
					</span>
				</div>

				<button onClick={handleCheckout} className='checkout-btn'>
					Proceed to Checkout
				</button>

				<Link to='/' className='continue-shopping-link'>
					Continue Shopping
				</Link>
			</div>
		</div>
	)
}

export default CartPage

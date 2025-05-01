'use client'

import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { createOrder } from '../api/api'
import WebApp from '@twa-dev/sdk'

import '../styles/CheckoutPage.css'

const CheckoutPage = () => {
	const { items, totalPrice, clearCart } = useCart()
	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		fullName: WebApp.initDataUnsafe?.user?.first_name || '',
		phone: '',
		address: '',
	})
	const [loading, setLoading] = useState(false)
	const [errors, setErrors] = useState({})

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))

		// Clear error when user types
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const validateForm = () => {
		const newErrors = {}

		if (!formData.fullName.trim()) {
			newErrors.fullName = 'Full name is required'
		}

		if (!formData.phone.trim()) {
			newErrors.phone = 'Phone number is required'
		} else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.trim())) {
			newErrors.phone = 'Please enter a valid phone number'
		}

		if (!formData.address.trim()) {
			newErrors.address = 'Delivery address is required'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async e => {
		e.preventDefault()

		if (!validateForm()) {
			return
		}

		setLoading(true)

		try {
			const orderData = {
				items: items.map(item => ({
					productId: item.productId,
					quantity: item.quantity,
				})),
				telegramUserId:
					WebApp.initDataUnsafe?.user?.id?.toString() || 'unknown',
				userName: formData.fullName,
				contactPhone: formData.phone,
				deliveryAddress: formData.address,
			}

			await createOrder(orderData)
			clearCart()
			navigate('/success')
		} catch (error) {
			console.error('Error creating order:', error)
			WebApp.showPopup({
				title: 'Error',
				message: 'There was an error processing your order. Please try again.',
				buttons: [{ type: 'ok' }],
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='checkout-page'>
			<h1>Checkout</h1>

			<div className='checkout-container'>
				<div className='order-summary'>
					<h2>Order Summary</h2>

					<div className='summary-items'>
						{items.map(item => (
							<div key={item.productId} className='summary-item'>
								<div className='item-name'>
									{item.name}{' '}
									<span className='item-quantity'>x{item.quantity}</span>
								</div>
								<div className='item-price'>
									{(item.price * item.quantity).toLocaleString()} so'm
								</div>
							</div>
						))}
					</div>

					<div className='summary-total'>
						<span>Total:</span>
						<span>{totalPrice.toLocaleString()} so'm</span>
					</div>
				</div>

				<motion.form
					className='checkout-form'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					onSubmit={handleSubmit}
				>
					<h2>Delivery Information</h2>

					<div className='form-group'>
						<label htmlFor='fullName'>Full Name</label>
						<input
							type='text'
							id='fullName'
							name='fullName'
							value={formData.fullName}
							onChange={handleChange}
							placeholder='Enter your full name'
							className={errors.fullName ? 'error' : ''}
						/>
						{errors.fullName && (
							<div className='error-message'>{errors.fullName}</div>
						)}
					</div>

					<div className='form-group'>
						<label htmlFor='phone'>Phone Number</label>
						<input
							type='tel'
							id='phone'
							name='phone'
							value={formData.phone}
							onChange={handleChange}
							placeholder='Enter your phone number'
							className={errors.phone ? 'error' : ''}
						/>
						{errors.phone && (
							<div className='error-message'>{errors.phone}</div>
						)}
					</div>

					<div className='form-group'>
						<label htmlFor='address'>Delivery Address</label>
						<textarea
							id='address'
							name='address'
							value={formData.address}
							onChange={handleChange}
							placeholder='Enter your delivery address'
							className={errors.address ? 'error' : ''}
							rows={3}
						/>
						{errors.address && (
							<div className='error-message'>{errors.address}</div>
						)}
					</div>

					<button type='submit' className='place-order-btn' disabled={loading}>
						{loading ? 'Processing...' : 'Place Order'}
					</button>
				</motion.form>
			</div>
		</div>
	)
}

export default CheckoutPage

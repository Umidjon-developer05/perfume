'use client'

import React from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import WebApp from '@twa-dev/sdk'

import { CheckCircle } from 'lucide-react'
import '../styles/OrderSuccessPage.css'

const OrderSuccessPage = () => {
	useEffect(() => {
		// Notify Telegram that the order was successful
		WebApp.MainButton.setText('Continue Shopping')
		WebApp.MainButton.show()
		WebApp.MainButton.onClick(() => {
			window.location.href = '/'
		})

		return () => {
			WebApp.MainButton.hide()
		}
	}, [])

	return (
		<div className='order-success-page'>
			<motion.div
				className='success-container'
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<div className='success-icon'>
					<CheckCircle size={80} color='#4CAF50' />
				</div>

				<h1>Order Placed Successfully!</h1>

				<p>
					Thank you for your order. We have received your order and will process
					it shortly. You will receive updates about your order in the Telegram
					bot.
				</p>

				<Link to='/' className='back-to-home-btn'>
					Continue Shopping
				</Link>
			</motion.div>
		</div>
	)
}

export default OrderSuccessPage

'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import WebApp from '@twa-dev/sdk'

import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import ReferralPage from './pages/ReferralPage'
import Navbar from './components/Navbar'
import { CartProvider } from './context/CartContext'
import { saveUser } from './api/api'
import './styles/App.css'
import SearchPage from './pages/SearchPage'

const App = () => {
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		// Initialize Telegram WebApp
		WebApp.ready()
		WebApp.expand()

		// Save user data if available
		const saveUserData = async () => {
			try {
				if (WebApp.initDataUnsafe?.user) {
					const user = WebApp.initDataUnsafe.user

					// Get referral parameter from start_param if available
					const startParam = WebApp.initDataUnsafe.start_param || ''
					let referredBy = null

					if (startParam && startParam.startsWith('ref_')) {
						referredBy = startParam.substring(4)
					}

					await saveUser({
						telegramId: user.id.toString(),
						username: user.username,
						firstName: user.first_name,
						lastName: user.last_name,
						referredBy: referredBy,
					})
				}
			} catch (error) {
				console.error('Error saving user data:', error)
			} finally {
				setIsLoaded(true)
			}
		}

		saveUserData()
	}, [])

	if (!isLoaded) {
		return <div className='loading'>Loading...</div>
	}

	return (
		<CartProvider>
			<div className='app'>
				<Navbar />
				<main className='main-content'>
					<Routes>
						<Route path='/' element={<HomePage />} />
						<Route path='/search' element={<SearchPage />} />
						<Route path='/category/:id' element={<CategoryPage />} />
						<Route path='/product/:id' element={<ProductDetailPage />} />
						<Route path='/cart' element={<CartPage />} />
						<Route path='/checkout' element={<CheckoutPage />} />
						<Route path='/success' element={<OrderSuccessPage />} />
						<Route path='/referral' element={<ReferralPage />} />
					</Routes>
				</main>
			</div>
		</CartProvider>
	)
}

export default App

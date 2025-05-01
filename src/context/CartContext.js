'use client'

import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(undefined)

export const CartProvider = ({ children }) => {
	const [items, setItems] = useState([])
	const [totalItems, setTotalItems] = useState(0)
	const [totalPrice, setTotalPrice] = useState(0)

	// Load cart from localStorage on initial render
	useEffect(() => {
		const savedCart = localStorage.getItem('cart')
		if (savedCart) {
			setItems(JSON.parse(savedCart))
		}
	}, [])

	// Update localStorage and totals when cart changes
	useEffect(() => {
		localStorage.setItem('cart', JSON.stringify(items))

		const itemCount = items.reduce((total, item) => total + item.quantity, 0)
		const price = items.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		)

		setTotalItems(itemCount)
		setTotalPrice(price)
	}, [items])

	const addToCart = (product, quantity) => {
		setItems(prevItems => {
			const existingItem = prevItems.find(
				item => item.productId === product._id
			)

			if (existingItem) {
				return prevItems.map(item =>
					item.productId === product._id
						? { ...item, quantity: item.quantity + quantity }
						: item
				)
			} else {
				return [
					...prevItems,
					{
						productId: product._id,
						name: product.name,
						price: product.price,
						imageUrl: product.imageUrl,
						quantity,
					},
				]
			}
		})
	}

	const removeFromCart = productId => {
		setItems(prevItems =>
			prevItems.filter(item => item.productId !== productId)
		)
	}

	const updateQuantity = (productId, quantity) => {
		if (quantity <= 0) {
			removeFromCart(productId)
			return
		}

		setItems(prevItems =>
			prevItems.map(item =>
				item.productId === productId ? { ...item, quantity } : item
			)
		)
	}

	const clearCart = () => {
		setItems([])
	}

	return (
		<CartContext.Provider
			value={{
				items,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
				totalItems,
				totalPrice,
			}}
		>
			{children}
		</CartContext.Provider>
	)
}

export const useCart = () => {
	const context = useContext(CartContext)
	if (context === undefined) {
		throw new Error('useCart must be used within a CartProvider')
	}
	return context
}

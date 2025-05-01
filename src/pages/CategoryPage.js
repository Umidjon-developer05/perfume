'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchCategoryById, fetchProductsByCategory } from '../api/api'
import ProductCard from '../components/ProductCard'
import { Loader } from '../components/Loader'
import { AlertCircle, RefreshCw } from 'lucide-react'
import '../styles/CategoryPage.css'

const CategoryPage = () => {
	const { id } = useParams()
	const [category, setCategory] = useState(null)
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	console.log(products)
	const loadData = async () => {
		if (!id) return

		setLoading(true)
		setError(null)

		try {
			// Try to fetch category data
			const categoryData = await fetchCategoryById(id)
			setCategory(categoryData)

			const productsData = await fetchProductsByCategory(id)
			const filteredProducts = productsData.filter(
				product => product.category === id
			)
			setProducts(filteredProducts)
		} catch (error) {
			console.error('Error loading category data:', error)

			// Check if it's a connection error
			if (error.message === 'Network Error') {
				setError(
					'Cannot connect to the server. Please make sure the backend server is running at http://localhost:5000'
				)
			} else {
				setError(`Error: ${error.message}`)
			}
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadData()
	}, [id])

	if (loading) {
		return <Loader />
	}

	if (error) {
		return (
			<div className='error-container'>
				<AlertCircle size={48} className='error-icon' />
				<h2>Connection Error</h2>
				<p>{error}</p>

				<div className='error-actions'>
					<button onClick={loadData} className='retry-button'>
						<RefreshCw size={16} />
						Retry Connection
					</button>
					<Link to='/' className='home-button'>
						Return to Home
					</Link>
				</div>
				<div className='error-help'>
					<h3>Troubleshooting Steps:</h3>
					<ol>
						<li>
							Make sure your backend server is running with{' '}
							<code>npm start</code> in the backend directory
						</li>
						<li>Check that the server is running on port 5000</li>
						<li>Verify your MongoDB connection in the backend</li>
						<li>Check for any error messages in the backend console</li>
					</ol>
				</div>
			</div>
		)
	}

	if (!category) {
		return <div className='error-message'>Category not found</div>
	}

	return (
		<div className='category-page'>
			<div className='category-header'>
				<h1>{category.name}</h1>
				<p>{category.description}</p>
			</div>

			{products.length === 0 ? (
				<div className='no-products'>No products found in this category</div>
			) : (
				<div className='products-grid'>
					{products.map(product => (
						<motion.div
							key={product._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							<ProductCard product={product} />
						</motion.div>
					))}
				</div>
			)}
		</div>
	)
}

export default CategoryPage

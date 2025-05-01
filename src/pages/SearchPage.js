'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchProducts } from '../api/api'
import ProductCard from '../components/ProductCard'
import { Loader } from '../components/Loader'
import { Search } from 'lucide-react'
import '../styles/SearchPage.css'

const SearchPage = () => {
	const [searchParams] = useSearchParams()
	const query = searchParams.get('q') || ''

	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const searchProducts = async () => {
			if (!query) {
				setProducts([])
				setLoading(false)
				return
			}

			setLoading(true)
			try {
				// Search products by name
				const productsData = await fetchProducts({ search: query })
				setProducts(productsData)
			} catch (error) {
				console.error('Error searching products:', error)
			} finally {
				setLoading(false)
			}
		}

		searchProducts()
	}, [query])

	if (loading) {
		return <Loader />
	}

	return (
		<div className='search-results-page'>
			<div className='search-header'>
				<Search size={24} />
				<h1>Search Results for "{query}"</h1>
			</div>

			{products.length === 0 ? (
				<div className='no-results'>
					<p>No products found matching "{query}"</p>
					<p>Try a different search term or browse our categories</p>
				</div>
			) : (
				<>
					<p className='results-count'>{products.length} products found</p>
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
				</>
			)}
		</div>
	)
}

export default SearchPage

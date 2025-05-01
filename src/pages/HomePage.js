'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchCategories, fetchFeaturedProducts } from '../api/api'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/CategoryCard'
import Carousel from '../components/Carousel'
import { Loader } from '../components/Loader'
import '../styles/HomePage.css'

const HomePage = () => {
	const [categories, setCategories] = useState([])
	const [featuredProducts, setFeaturedProducts] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadData = async () => {
			try {
				const [categoriesData, productsData] = await Promise.all([
					fetchCategories(),
					fetchFeaturedProducts(),
				])

				setCategories(categoriesData)
				setFeaturedProducts(productsData)
			} catch (error) {
				console.error('Error loading homepage data:', error)
			} finally {
				setLoading(false)
			}
		}

		loadData()
	}, [])

	if (loading) {
		return <Loader />
	}

	return (
		<div className='home-page'>
			<Carousel />

			<section className='categories-section'>
				<div className='section-header'>
					<h2>Categories</h2>
					<Link to='/categories' className='view-all'>
						View All
					</Link>
				</div>

				<div className='categories-grid'>
					{categories &&
						categories?.map(category => (
							<motion.div
								key={category._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
							>
								<CategoryCard category={category} />
							</motion.div>
						))}
				</div>
			</section>

			<section className='featured-section'>
				<div className='section-header'>
					<h2>Featured Perfumes</h2>
					<Link to='/products' className='view-all'>
						View All
					</Link>
				</div>

				<div className='products-grid'>
					{featuredProducts &&
						featuredProducts?.map(product => (
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
			</section>
		</div>
	)
}

export default HomePage

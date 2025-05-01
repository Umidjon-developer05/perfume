'use client'

import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../styles/CategoryCard.css'

const CategoryCard = ({ category }) => {
	return (
		<motion.div
			className='category-card'
			whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
		>
			<Link to={`/category/${category._id}`} className='category-link'>
				<div className='category-image-container'>
					<img
						src={category.imageUrl || '/placeholder.svg'}
						alt={category.name}
						className='category-image'
					/>
				</div>
				<h3 className='category-name'>{category.name}</h3>
			</Link>
		</motion.div>
	)
}

export default CategoryCard

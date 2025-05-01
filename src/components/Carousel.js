'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import '../styles/Carousel.css'

const banners = [
	{
		id: 1,
		title: 'Premium Perfumes',
		subtitle: 'Discover our exclusive collection',
		imageUrl: '/images/banner1.jpg',
		bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
	},
	{
		id: 2,
		title: 'New Arrivals',
		subtitle: 'Check out our latest fragrances',
		imageUrl: '/images/banner2.jpg',
		bgColor: 'bg-gradient-to-r from-blue-500 to-teal-500',
	},
	{
		id: 3,
		title: 'Special Offers',
		subtitle: 'Limited time discounts on selected items',
		imageUrl: '/images/banner3.jpg',
		bgColor: 'bg-gradient-to-r from-amber-500 to-red-500',
	},
]

const Carousel = () => {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [direction, setDirection] = useState(0)

	useEffect(() => {
		const interval = setInterval(() => {
			setDirection(1)
			setCurrentIndex(prevIndex => (prevIndex + 1) % banners.length)
		}, 5000)

		return () => clearInterval(interval)
	}, [])

	const handlePrev = () => {
		setDirection(-1)
		setCurrentIndex(
			prevIndex => (prevIndex - 1 + banners.length) % banners.length
		)
	}

	const handleNext = () => {
		setDirection(1)
		setCurrentIndex(prevIndex => (prevIndex + 1) % banners.length)
	}

	const variants = {
		enter: direction => ({
			x: direction > 0 ? 1000 : -1000,
			opacity: 0,
		}),
		center: {
			x: 0,
			opacity: 1,
		},
		exit: direction => ({
			x: direction < 0 ? 1000 : -1000,
			opacity: 0,
		}),
	}

	return (
		<div className='carousel'>
			<AnimatePresence initial={false} custom={direction} mode='wait'>
				<motion.div
					key={currentIndex}
					custom={direction}
					variants={variants}
					initial='enter'
					animate='center'
					exit='exit'
					transition={{
						x: { type: 'spring', stiffness: 300, damping: 30 },
						opacity: { duration: 0.2 },
					}}
					className={`carousel-slide ${banners[currentIndex].bgColor}`}
				>
					<div className='carousel-content'>
						<h2>{banners[currentIndex].title}</h2>
						<p>{banners[currentIndex].subtitle}</p>
					</div>
				</motion.div>
			</AnimatePresence>

			<button
				className='carousel-button prev'
				onClick={handlePrev}
				aria-label='Previous slide'
			>
				<ChevronLeft size={24} />
			</button>

			<button
				className='carousel-button next'
				onClick={handleNext}
				aria-label='Next slide'
			>
				<ChevronRight size={24} />
			</button>

			<div className='carousel-indicators'>
				{banners.map((_, index) => (
					<button
						key={index}
						className={`indicator ${index === currentIndex ? 'active' : ''}`}
						onClick={() => {
							setDirection(index > currentIndex ? 1 : -1)
							setCurrentIndex(index)
						}}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</div>
	)
}

export default Carousel

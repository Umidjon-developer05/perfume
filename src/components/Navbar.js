'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, Home, Search, Users } from 'lucide-react'
import { useCart } from '../context/CartContext'
import '../styles/Navbar.css'

const Navbar = () => {
	const { totalItems } = useCart()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const location = useLocation()
	const navigate = useNavigate() // Add this line

	useEffect(() => {
		// Close menu when route changes
		setIsMenuOpen(false)
		setIsSearchOpen(false)
	}, [location])

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
		if (isSearchOpen) {
			setIsSearchOpen(false)
		}
	}

	const toggleSearch = () => {
		setIsSearchOpen(!isSearchOpen)
		if (isMenuOpen) {
			setIsMenuOpen(false)
		}
	}

	const handleSearch = e => {
		e.preventDefault()
		if (searchQuery.trim()) {
			navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
			setIsSearchOpen(false)
		}
	}

	return (
		<nav className='navbar'>
			<div className='navbar-container'>
				<div className='navbar-left'>
					<button
						className='menu-toggle'
						onClick={toggleMenu}
						aria-label='Toggle menu'
					>
						{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>

					<Link to='/' className='logo'>
						Atir Market
					</Link>
				</div>

				<div className='navbar-right'>
					<button
						className='search-toggle'
						onClick={toggleSearch}
						aria-label='Toggle search'
					>
						<Search size={24} />
					</button>

					<Link to='/cart' className='cart-icon'>
						<ShoppingCart size={24} />
						{totalItems > 0 && <span className='cart-badge'>{totalItems}</span>}
					</Link>
				</div>
			</div>

			{isSearchOpen && (
				<div className='search-container'>
					<form onSubmit={handleSearch}>
						<input
							type='text'
							placeholder='Search perfumes...'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							autoFocus
						/>
						<button type='submit'>Search</button>
					</form>
				</div>
			)}

			{isMenuOpen && (
				<div className='mobile-menu'>
					<Link to='/' className='menu-item'>
						<Home size={20} />
						Home
					</Link>
					<Link to='/categories' className='menu-item'>
						Categories
					</Link>
					<Link to='/products' className='menu-item'>
						All Perfumes
					</Link>
					<Link to='/cart' className='menu-item'>
						Cart ({totalItems})
					</Link>
					<Link to='/referral' className='menu-item'>
						<Users size={20} />
						Referral Program
					</Link>
				</div>
			)}
		</nav>
	)
}

export default Navbar

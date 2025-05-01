'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import WebApp from '@twa-dev/sdk'

import { Share2, Users } from 'lucide-react'
import { fetchReferralStats } from '../api/api'
import { Loader } from '../components/Loader'
import '../styles/ReferralPage.css'

const ReferralPage = () => {
	const [loading, setLoading] = useState(true)
	const [stats, setStats] = useState(null)
	const [referralLink, setReferralLink] = useState('')

	useEffect(() => {
		const loadReferralData = async () => {
			try {
				if (WebApp.initDataUnsafe?.user?.id) {
					const telegramId = WebApp.initDataUnsafe.user.id.toString()
					const data = await fetchReferralStats(telegramId)
					setStats(data)

					// Generate referral link
					const botUsername = WebApp.initDataUnsafe.user?.username || 'your_bot'
					setReferralLink(`https://t.me/${botUsername}?start=ref_${telegramId}`)
				}
			} catch (error) {
				console.error('Error loading referral data:', error)
			} finally {
				setLoading(false)
			}
		}

		loadReferralData()
	}, [])

	const handleShare = () => {
		if (WebApp.platform === 'web') {
			// For web version, copy to clipboard
			navigator.clipboard
				.writeText(referralLink)
				.then(() => {
					WebApp.showPopup({
						title: 'Link copied!',
						message: 'Referral link copied to clipboard',
						buttons: [{ type: 'ok' }],
					})
				})
				.catch(err => {
					console.error('Could not copy text: ', err)
				})
		} else {
			// For mobile app, use Telegram's native sharing
			WebApp.openTelegramLink(
				`https://t.me/share/url?url=${encodeURIComponent(
					referralLink
				)}&text=${encodeURIComponent(
					'Join Atir Market and discover premium perfumes!'
				)}`
			)
		}
	}

	if (loading) {
		return <Loader />
	}

	return (
		<div className='referral-page'>
			<motion.div
				className='referral-card'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
			>
				<div className='referral-header'>
					<Users size={32} className='referral-icon' />
					<h1>Referral Program</h1>
				</div>

				<p className='referral-description'>
					Invite friends to Atir Market and help them discover premium perfumes!
				</p>

				<div className='referral-stats'>
					<div className='stat-item'>
						<span className='stat-value'>{stats?.referralCount || 0}</span>
						<span className='stat-label'>Friends Invited</span>
					</div>
				</div>

				<div className='referral-link-container'>
					<p className='link-label'>Your Referral Link:</p>
					<div className='link-box'>
						<p className='link-text'>{referralLink}</p>
						<button className='share-button' onClick={handleShare}>
							<Share2 size={20} />
						</button>
					</div>
				</div>

				{stats && stats.referrals.length > 0 ? (
					<div className='referrals-list'>
						<h2>Your Referrals</h2>
						{stats.referrals.map((referral, index) => (
							<motion.div
								key={referral.telegramId}
								className='referral-item'
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
							>
								<div className='referral-user-avatar'>
									{(referral.firstName || referral.username || '?')
										.charAt(0)
										.toUpperCase()}
								</div>
								<div className='referral-user-info'>
									<p className='referral-user-name'>
										{referral.firstName ||
											referral.username ||
											'Anonymous User'}
									</p>
									<p className='referral-join-date'>
										Joined: {new Date(referral.joinedAt).toLocaleDateString()}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				) : (
					<div className='no-referrals'>
						<p>
							You haven't invited anyone yet. Share your referral link to get
							started!
						</p>
					</div>
				)}

				<button className='share-referral-btn' onClick={handleShare}>
					Share Your Referral Link
				</button>
			</motion.div>
		</div>
	)
}

export default ReferralPage

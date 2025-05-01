'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { isServerRunning, getServerStatus } from '../utils/serverCheck'
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import '../styles/ServerStatus.css'

const ServerStatus = ({ onRetry }) => {
	const [status, setStatus] = useState({
		isRunning: false,
		loading: true,
	})

	const checkServer = async () => {
		setStatus(prev => ({ ...prev, loading: true }))

		try {
			const serverRunning = await isServerRunning()

			if (serverRunning) {
				// If server is running, get more detailed status
				const detailedStatus = await getServerStatus()
				setStatus({
					isRunning: true,
					dbStatus: detailedStatus.dbStatus,
					message: detailedStatus.message,
					loading: false,
				})
			} else {
				setStatus({
					isRunning: false,
					message: 'Backend server is not running or not accessible',
					loading: false,
				})
			}
		} catch (error) {
			setStatus({
				isRunning: false,
				message: 'Error checking server status',
				loading: false,
			})
		}
	}

	useEffect(() => {
		checkServer()
	}, [])

	const handleRetry = () => {
		checkServer()
		if (onRetry) onRetry()
	}

	return (
		<div className={`server-status ${status.isRunning ? 'success' : 'error'}`}>
			<div className='status-icon'>
				{status.loading ? (
					<RefreshCw size={24} className='loading-icon' />
				) : status.isRunning ? (
					<CheckCircle size={24} />
				) : (
					<AlertCircle size={24} />
				)}
			</div>
			<div className='status-content'>
				<h3>
					{status.loading
						? 'Checking server...'
						: status.isRunning
						? 'Server is running'
						: 'Server is not running'}
				</h3>
				{status.dbStatus && <p>Database: {status.dbStatus}</p>}
				{status.message && <p>{status.message}</p>}
			</div>
			<button
				onClick={handleRetry}
				className='retry-button'
				disabled={status.loading}
			>
				<RefreshCw size={16} className={status.loading ? 'spin' : ''} />
				{status.loading ? 'Checking...' : 'Retry'}
			</button>
		</div>
	)
}

export default ServerStatus

import axios from 'axios'

const API_BASE_URL =
	process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Add response interceptor for better error handling
api.interceptors.response.use(
	response => response,
	error => {
		console.error('API Error:', error.response?.data || error.message)
		return Promise.reject(error)
	}
)

// Products
export const fetchProducts = async (params = {}) => {
	try {
		const response = await api.get('/products', { params })
		return response.data
	} catch (error) {
		console.error('Error fetching products:', error)
		throw error
	}
}

export const fetchProductById = async id => {
	try {
		const response = await api.get(`/products/${id}`)
		return response.data
	} catch (error) {
		console.error(`Error fetching product ${id}:`, error)
		throw error
	}
}

export const fetchProductsByCategory = async categoryId => {
	try {
		const response = await api.get(
			`/products/categories?category=${categoryId}`
		)
		return response.data
	} catch (error) {
		console.error(`Error fetching products for category ${categoryId}:`, error)
		throw error
	}
}

export const fetchFeaturedProducts = async () => {
	try {
		const response = await api.get('/products', { params: { featured: true } })
		return response.data
	} catch (error) {
		console.error('Error fetching featured products:', error)
		throw error
	}
}

// Categories
export const fetchCategories = async () => {
	try {
		const response = await api.get('/categories')
		return response.data
	} catch (error) {
		console.error('Error fetching categories:', error)
		throw error
	}
}

export const fetchCategoryById = async id => {
	try {
		const response = await api.get(`/categories/${id}`)
		return response.data
	} catch (error) {
		console.error(`Error fetching category ${id}:`, error)
		throw error
	}
}

// Orders
export const createOrder = async orderData => {
	try {
		const response = await api.post('/orders', orderData)
		return response.data
	} catch (error) {
		console.error('Error creating order:', error)
		throw error
	}
}

export const fetchOrdersByUser = async telegramUserId => {
	try {
		const response = await api.get(`/orders/user/${telegramUserId}`)
		return response.data
	} catch (error) {
		console.error(`Error fetching orders for user ${telegramUserId}:`, error)
		throw error
	}
}

// Users and Referrals
export const saveUser = async userData => {
	try {
		const response = await api.post('/users', userData)
		return response.data
	} catch (error) {
		console.error('Error saving user:', error)
		throw error
	}
}

export const fetchUser = async telegramId => {
	try {
		const response = await api.get(`/users/${telegramId}`)
		return response.data
	} catch (error) {
		console.error(`Error fetching user ${telegramId}:`, error)
		throw error
	}
}

export const fetchReferralStats = async telegramId => {
	try {
		const response = await api.get(`/users/${telegramId}/referrals`)
		return response.data
	} catch (error) {
		console.error(`Error fetching referrals for user ${telegramId}:`, error)
		throw error
	}
}

// Debug endpoints
export const checkDatabaseStatus = async () => {
	try {
		const response = await api.get('/debug/status')
		return response.data
	} catch (error) {
		console.error('Error checking database status:', error)
		throw error
	}
}

export const listCategoryIds = async () => {
	try {
		const response = await api.get('/debug/categories')
		return response.data
	} catch (error) {
		console.error('Error listing category IDs:', error)
		throw error
	}
}

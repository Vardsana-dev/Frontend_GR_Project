import axios from 'axios'
import { getStoredUserData, getAuthToken } from '@/lib/auth'

const ALLPRO_ENDPOINT = process.env.ALLPRO_ENDPOINT || '/api/product/allProduct'

const createApiInstance = () => {
    const userData = getStoredUserData()
    const token = getAuthToken()
    
    if (!userData || !token) {
        throw new Error('User not authenticated')
    }
    
    return axios.create({
        baseURL: userData.selectedApiUrl,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}

const extractProductsData = (responseData) => {
    const paths = [
        responseData?.message?.rows,
        responseData?.rows,
        responseData?.data,
        responseData?.products,
        responseData
    ]
    return paths.find(data => Array.isArray(data)) || []
}

export const getAllProducts = async (params = {}) => {
    try {
        const queryParams = {
            page: params.page || 1,
            limit: params.limit || 100,
            search: params.search || ''
        }
        
        const api = createApiInstance()
        const response = await api.get(ALLPRO_ENDPOINT, { params: queryParams })
        
        const productsData = extractProductsData(response.data)
        
        return {
            success: true,
            data: productsData,
            total: response.data?.message?.count || response.data?.total || productsData.length,
            page: response.data?.page || queryParams.page,
            limit: response.data?.limit || queryParams.limit
        }
        
    } catch (error) {
        console.error('❌ Error fetching products:', error)
        
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນສິນຄ້າ'
        
        return {
            success: false,
            error: errorMessage,
            data: []
        }
    }
}
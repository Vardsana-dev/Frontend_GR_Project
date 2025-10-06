import axios from 'axios'
import { getStoredUserData, getAuthToken } from '@/lib/auth'

const ALLPO_ENDPOINT = process.env.ALLPO_ENDPOINT || '/api/po/allPO'

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

const extractPOData = (responseData) => {
    const paths = [
        responseData?.message?.data,
        responseData?.message?.rows,
        responseData?.rows,
        responseData?.data,
        responseData?.po,
        responseData?.message,
        responseData
    ]
    return paths.find(data => Array.isArray(data)) || []
}

export const getAllPO = async (params = {}) => {
    try {
        const queryParams = {
            page: params.page || 1,
            limit: params.limit || 100,
            levels: params.levels || 0,
            search: params.search || ''
        }
        
        const api = createApiInstance()
        const response = await api.get(ALLPO_ENDPOINT, { params: queryParams })
        
        const poData = extractPOData(response.data)
        
        return {
            success: true,
            data: poData,
            total: response.data?.message?.count || response.data?.total || poData.length,
            page: response.data?.page || queryParams.page,
            limit: response.data?.limit || queryParams.limit
        }
        
    } catch (error) {
        console.error('❌ Error fetching PO:', error)
        
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນສັ່ງຊື້'
        
        return {
            success: false,
            error: errorMessage,
            data: []
        }
    }
}

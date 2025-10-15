import axios from 'axios'
import { getStoredUserData, getAuthToken } from '@/lib/auth'

const ALLPR_ENDPOINT = process.env.ALLPR_ENDPOINT || '/api/pr/ALLPR'

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

const extractPRData = (responseData) => {
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

export const getAllPR = async (params = {}) => {
    try {
        const queryParams = {
            page: params.page || 1,
            limit: params.limit || 100,
            departments: params.departments || ''
        }
        
        const api = createApiInstance()
        const response = await api.get(ALLPR_ENDPOINT, { params: queryParams })

        const prData = extractPRData(response.data)

        return {
            success: true,
            data: prData,
            total: response.data?.message?.count || response.data?.total || prData.length,
            page: response.data?.page || queryParams.page,
            limit: response.data?.limit || queryParams.limit,
            departments: response.data?.departments || queryParams.departments
        }
        
    } catch (error) {
        console.error('❌ Error fetching PR:', error)
        
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

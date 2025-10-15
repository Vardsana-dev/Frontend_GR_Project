import axios from 'axios'
import { getStoredUserData, getAuthToken } from '@/lib/auth'

const ALLPRBYDOCNO_ENDPOINT = process.env.ALLPRBYDOCNO_ENDPOINT || '/api/pr/ALLPRbyDocno'

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

const extractPRByDocNoData = (responseData) => {
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

export const getAllPrByDocNo = async (params = {}) => {
    try {
        const queryParams = {
            page: params.page || 1,
            limit: params.limit || 100,
            Docno: params.docNo || ''
        }
        
        const api = createApiInstance()
        const response = await api.get(ALLPRBYDOCNO_ENDPOINT, { params: queryParams })

        const prByDocNoData = extractPRByDocNoData(response.data)

        return {
            success: true,
            data: prByDocNoData,
            total: response.data?.message?.totalCount || response.data?.total || prByDocNoData.length,
            page: response.data?.page || queryParams.page,
            limit: response.data?.limit || queryParams.limit
        }
        
    } catch (error) {
        console.error('❌ Error fetching Pr by DocNo:', error)
        
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນສັ່ງຊື້ຕາມເລກທີ່ເອກະສານ'
        
        return {
            success: false,
            error: errorMessage,
            data: []
        }
    }
}

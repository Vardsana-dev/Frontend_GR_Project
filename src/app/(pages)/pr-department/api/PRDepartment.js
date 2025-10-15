import axios from 'axios'
import { getStoredUserData, getAuthToken } from '@/lib/auth'

const PR_DEPARTMENT_ENDPOINT = process.env.PR_DEPARTMENT_ENDPOINT || '/api/pr/PRDepartment'

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

export const getPRDepartments = async () => {
    try {
        const api = createApiInstance()
        const response = await api.get(PR_DEPARTMENT_ENDPOINT)
        
        const departments = response.data?.message || []
        
        return {
            success: true,
            data: departments
        }
        
    } catch (error) {
        console.error('❌ Error fetching PR Departments:', error)
        
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນแผนก'
        
        return {
            success: false,
            error: errorMessage,
            data: []
        }
    }
}
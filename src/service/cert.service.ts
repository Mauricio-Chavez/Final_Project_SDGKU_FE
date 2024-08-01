import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

class CertService {
    async deleteCertification(id: number) {
        try {
            const response: AxiosResponse = await axios.delete(`http://localhost:8000/api/deletecert/${id}`, {
                headers: {
                    Authorization: `Token ${Cookies.get('token')}`
                }
            });
            return response.data;
        }catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data || error.message);
            } else {
                console.error('Unexpected error:', error);
            }
            throw error; 
        }
    }
}

export default new CertService();
import { useHttp } from '@inertiajs/vue3';
import CesantiaController from '@/actions/App/Http/Controllers/CesantiaController';

interface CesantiaRequest {
    age: number;
}

export interface CesantiaResponse {
    message: string;
    data: number;
}

export const useCesantiaService = () => {
    const http = useHttp<CesantiaRequest, CesantiaResponse>({ age: 0 });

    const getCesantiaByAge = async (
        age: number,
    ): Promise<CesantiaResponse> => {
        http.age = age;

        return http.submit(CesantiaController.index());
    };

    return {
        getCesantiaByAge,
    };
};

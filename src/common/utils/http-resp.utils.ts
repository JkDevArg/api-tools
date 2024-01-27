import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';

export async function axiosErrorHandler<T>(
    axiosPromise: Promise<AxiosResponse<T>>,
): Promise<T> {
    try {
        const response = await axiosPromise;
        return response.data;
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            throw new HttpException(data, status);
        } else if (error.request) {
            throw new HttpException('No se recibió respuesta del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            throw new HttpException('Error en la configuración de la solicitud', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

export function filterCircularProps(obj: any) {
    const seen = new WeakSet();

    function replacer(key: string, value: any) {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular]';
            }
            seen.add(value);
        }
        return value;
    }

    return JSON.parse(JSON.stringify(obj, replacer));
}
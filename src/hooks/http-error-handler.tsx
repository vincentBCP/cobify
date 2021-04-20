import { AxiosError, AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';

export default (httpClient: AxiosInstance): [AxiosError | null, () => void] => {
    const[error, setError] = useState<AxiosError | null>(null);

    const requestInterceptor = httpClient.interceptors.request.use(
        (req: AxiosRequestConfig) => {
            setError(null);
            return req;
        }
    );
    
    const responseInterceptor = httpClient.interceptors.response.use(
        (res: AxiosResponse) => res, 
        (error: AxiosError) => {
            const _error = error || { response: { data: { error: "Error occured."} } } as AxiosError;

            setError(_error);

            throw _error;
        }
    );

    useEffect(() => {
        return () => {
            httpClient.interceptors.request.eject(requestInterceptor);
            httpClient.interceptors.response.eject(responseInterceptor);
        }
    }, [ httpClient.interceptors.request, requestInterceptor,
        httpClient.interceptors.response, responseInterceptor ]);

    const errorComfirmedHandler = () => {
        setError(null);
    }
    
    return [error, errorComfirmedHandler];
}
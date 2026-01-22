import axios from 'axios';

const api = axios.create({
    baseURL: 'https://dummyjson.com',
});

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export const fetchProducts = async (page: number = 0, limit: number = 10): Promise<ProductsResponse> => {
    const skip = page * limit;
    const { data } = await api.get<ProductsResponse>('/products', {
        params: { limit, skip },
    });
    return data;
};

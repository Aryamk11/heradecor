// src/assets/js/product-service.js
import { supabase } from './supabaseClient.js';

/**
 * Fetches a specified number of products from the database.
 * @param {number} limit - The maximum number of products to fetch.
 * @returns {Promise<Array>} A promise that resolves to an array of products.
 */
export async function fetchProducts(limit = 4) {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .limit(limit);

        if (error) {
            throw error;
        }
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return []; // Return an empty array on failure
    }
}
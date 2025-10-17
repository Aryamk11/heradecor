// app/lib/product-service.js
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

/**
 * Fetches all products from the database, ordered by ID.
 * @returns {Promise<Array>} A promise that resolves to an array of all products.
 */
export async function fetchAllProducts() {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            throw error;
        }
        return products;
    } catch (error) {
        console.error('Error fetching all products:', error);
        return [];
    }
}

/**
 * Fetches a single product by its unique ID.
 * @param {string|number} id - The ID of the product to fetch.
 * @returns {Promise<Object|null>} A promise that resolves to the product object or null if not found.
 */
export async function fetchProductById(id) {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single(); // Use .single() to get one object instead of an array

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        return null; // Return null on failure
    }
}
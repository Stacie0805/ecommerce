import * as React from 'react';
import { client } from '../../../Lib/client';
import ProductDetails from './productDetails';
import { useStateContext } from '../../../context/StateContext';

const ProductDetailsQuery = async({ params }) => {

    const { slug } = await params;
    
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const productsQuery = '*[_type == "product"]';

    const product = await client.fetch(query);
    const products = await client.fetch(productsQuery);

    return (
        <ProductDetails product={product} products={products} />
    );
};

export default ProductDetailsQuery;
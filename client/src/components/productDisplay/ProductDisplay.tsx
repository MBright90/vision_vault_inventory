import React, { useEffect } from "react";

import style from './ProductDisplay.module.scss';
import Genre from "@custom_types/genre";
// import type Product from "@custom_types/product";

interface ProductDisplayProps {
    genreId: string;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ genreId }) => {
    // const [products, setProducts] = useState<Product[]>([]);
    // const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const retrieveProducts = async(): Promise<void> => {
            console.log('inEffect');
            try {
                if (genreId !== 'all') {
                    const response = await fetch(`http://localhost:3000/genres/${genreId}`);
                    const data = await response.json();
                    console.log(data);

                } else {
                    console.log('cry');
                }
            } catch(err) {
                console.log(err);
            }
        };

        void retrieveProducts();
    }, [genreId]);

    return (
        <div className={style.productDisplay}>

        </div>
    );
};

export default ProductDisplay;

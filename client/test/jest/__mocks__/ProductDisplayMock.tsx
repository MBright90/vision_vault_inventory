import React from "react";

interface ProductDisplayMockProps {
    genreId: string
}

const ProductDisplayMock: React.FC<ProductDisplayMockProps> = ({ genreId }) => {
    return (
        <p>{genreId}</p>
    )
};

export default ProductDisplayMockProps
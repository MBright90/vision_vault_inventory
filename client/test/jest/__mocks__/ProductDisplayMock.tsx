import React from "react";

interface ProductDisplayMockProps {
    genreId: string
}

const ProductDisplayMock: React.FC<ProductDisplayMockProps> = ({ genreId }) => {
    return (
        <div data-testid="mock-product-display" >mock-product-display - Genre ID: {genreId}</div>
    )
};

export default ProductDisplayMock

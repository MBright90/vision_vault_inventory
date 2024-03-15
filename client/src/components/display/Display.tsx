import React, { useEffect, useState } from "react";

import style from './Display.module.scss';
import type Genre from "src/custom_types/genre";

const allGenre: Genre = {
    __id: '',
    __v: 0,
    name: 'All',
    products: []
};

const Display: React.FC = () => {
    const [genreSelection, setGenreSelection] = useState<Genre[]>([allGenre]);
    // const [genreNodes, setGenreNodes] = useState<React.ReactNode[]>([]);

    // Fetch genres
    useEffect( (): void => {
        const retrieveGenres = async (): Promise<void> => {
            try {
                const response = await fetch('http://localhost:3000/genres/');
            if (!response.ok) throw new Error('Failed to retrieve genres');
                const data = await response.json();
                
                // Add all products from each genre to allGenre
                let allProducts: string[] = [];
                data.forEach((genre: Genre) => { 
                    allProducts = allProducts.concat(genre.products);
                });
                allGenre.products = allProducts;

                setGenreSelection([allGenre, ...data]);
            } catch(err) {
                console.log(err);
            }
        };

        void retrieveGenres();
    }, []);

    // Change genreSelection to nodes
    useEffect((): void => {
        genreSelection.forEach((genre: Genre) => {
            console.log(genre.name, genre.products.length);
        });
    }, [genreSelection]);

    return (
        <main className={style.display}>
            <div className={style.displayControls}>
                {/* <button onClick={() => { void retrieveGenres(); }}>Call api</button> */}
                {/* {genreNodes} */}
            </div>
            <div className={style.displayScreen}>
            </div>
        </main>
    );
};

export default Display;

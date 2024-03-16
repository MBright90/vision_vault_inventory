import React, { useEffect, useState } from "react";

import style from './Display.module.scss';
import type Genre from "src/custom_types/genre";

const allGenre: Genre = {
    __id: 'all',
    __v: 0,
    name: 'All',
    products: []
};

const capitalize = (string: string): string => {
    const splitString = string.trim().split('');
    splitString[0].toUpperCase();
    return splitString.join().replaceAll(',', '');
};

const Display: React.FC = () => {
    const [genreSelection, setGenreSelection] = useState<Genre[]>([allGenre]);
    const [selectionNodes, setSelectionNodes] = useState<React.ReactNode[]>([]);

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
        const nodeArr = genreSelection.map((genre: Genre) => {
            return (
                <ul className={style.selectionItem} key={genre.__id}>
                    <button>{capitalize(genre.name)} ({genre.products.length})</button>
                </ul>
            );
        });
        setSelectionNodes(nodeArr);
    }, [genreSelection]);

    return (
        <main className={style.display}>
            <div className={style.displaySelection}>
                <ul className={style.selectionList}>{selectionNodes}</ul>
            </div>
            <div className={style.displayScreen}>
            </div>
        </main>
    );
};

export default Display;

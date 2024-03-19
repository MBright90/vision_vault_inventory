import React, { useEffect, useState } from "react";

import style from './Display.module.scss';
import type Genre from "@custom_types/genre";
import ProductDisplay from "@components/productDisplay/ProductDisplay";
import endpoint from "@utilities/endpoint";
import capitalize from "@utilities/capitalize";

const allGenre: Genre = {
    _id: 'all',
    __v: 0,
    name: 'All',
    products: []
};

const Display: React.FC = () => {
    const [genreSelection, setGenreSelection] = useState<Genre[]>([allGenre]);
    const [selectionNodes, setSelectionNodes] = useState<React.ReactNode[]>([]);
    const [currentlySelected, setCurrentlySelected] = useState<string>('all');

    const toggleItemSelection = (genreId: string): void => {
        setCurrentlySelected(genreId);
    };

    // Set genreSelection
    useEffect( (): void => {
        const retrieveGenres = async (): Promise<void> => {
            try {
                const response = await fetch(`${endpoint}/genres/`);
                if (!response.ok) throw new Error('Failed to retrieve genres');
                const data = await response.json();
                
                // Add all products from each genre to allGenre
                let allProducts: string[] = [];
                data.forEach((genre: Genre) => { 
                    allProducts = allProducts.concat(genre.products);
                });

                allGenre.products = [...new Set(allProducts)]; // Remove duplicates

                setGenreSelection([allGenre, ...data]);
            } catch(err) {
                console.log(err);
            }
        };

        void retrieveGenres();
    }, []);

    // Node creation from genreSelection
    useEffect((): void => {
        const nodeArr = genreSelection.map((genre: Genre) => {
            return (
                <ul className={`${style.selectionItem} ${genre._id === currentlySelected ? style.selectedItem : null }`} key={genre._id}>
                    <button key={genre._id} onClick={() => {toggleItemSelection(genre._id);}}>{capitalize(genre.name)} ({genre.products.length})</button>
                </ul>
            );
        });
        setSelectionNodes(nodeArr);
    }, [genreSelection, currentlySelected]);

    return (
        <main className={style.display}>
            <div className={style.displaySelection}>
                <ul className={style.selectionList}>{selectionNodes}</ul>
            </div>
            <div className={style.displayScreen}>
                <ProductDisplay genreId={currentlySelected}/>
            </div>
        </main>
    );
};

export default Display;

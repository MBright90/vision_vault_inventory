import React, { useEffect, useState } from "react";

import style from './Display.module.scss';
import type Genre from "src/custom_types/genre";

const allGenre: Genre = {
    __id: '',
    __v: 0,
    name: 'All',
    products: ['']
};

const Display: React.FC = () => {
    const [genreSelection, setGenreSelection] = useState<Genre[]>([allGenre]);
    const [genreNodes, setGenreNodes] = useState<React.ReactNode[]>([]);

    // Fetch genres
    useEffect(() => {
        (async () => {
            let data: Genre[] = [];
            try {
                const response = await fetch('http://localhost:3000/genres/');
                if (!response.ok) throw new Error('Failed to retrieve genres');
                data = await response.json();
            } catch(err) { console.log(err); }
            setGenreSelection((prev) => [...prev, ...data]);
        })();
    }, []);

    // Change genreSelection to nodes
    useEffect(() => {

    }, []);

    const retrieveGenres = async (): Promise<Genre[]> => {
        let data: Genre[] = [];
        try {
            const result = await fetch('http://localhost:3000/genres/');
            if (!result.ok) {
                throw new Error('Failed to retrieve genres');
            }
            data = await result.json();
        } catch(err) {
            console.log(err);
        }
        return data;
    };

    return (
        <main className={style.display}>
            <div className={style.displayControls}>
                <button onClick={() => { void retrieveGenres(); }}>Call api</button>
                {genreNodes}
            </div>
            <div className={style.displayScreen}>
            </div>
        </main>
    );
};

export default Display;

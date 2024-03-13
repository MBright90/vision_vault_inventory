import React from "react";

import style from './Display.module.scss';
import type Genre from "src/custom_types/genre";

const Display: React.FC = () => {
    const retrieveGenres = async (): Promise<Genre[]> => {
        let data: Genre[] = [];
        try {
            const result = await fetch('http://localhost:3000/genres/');
            if (!result.ok) {
                throw new Error('Failed to retrieve genres');
            }
            data = await result.json();
            console.log(data);
        } catch(err) {
            console.log(err);
        }
        return data;
    };

    return (
        <main className={style.display}>
            <div className={style.displayControls}>
                <button onClick={() => { void retrieveGenres(); }}>Call api</button>
            </div>
            <div className={style.displayScreen}>
            </div>
        </main>
    );
};

export default Display;

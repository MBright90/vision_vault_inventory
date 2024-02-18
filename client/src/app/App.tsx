import React from "react";
import '@style/style.scss';

import Footer from "@components/footer";
import Navbar from "@components/navbar";

const App: React.FC = () => {
    return (
        <>
            <Navbar />
            <div>hello world!</div>
            <Footer />
        </>
    );
};

export default App;
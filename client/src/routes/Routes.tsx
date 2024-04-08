import Display from "@components/display/Display";
import NewProductForm from "@components/newProductForm/NewProductForm";
import React from "react";

import { HashRouter, Route, Routes } from "react-router-dom";

const RouteSwitch: React.FC = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Display />} />
                <Route path="/new" element={<NewProductForm />} />
            </Routes>
        </HashRouter>
    );
};

export default RouteSwitch;

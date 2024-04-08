import Display from "@components/display";
import NavBar from "@components/navbar";
import NewProductForm from "@components/newProductForm";
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";



const RouteSwitch: React.FC = () => {
    return (
        <HashRouter basename="/">
            <NavBar />
            <Routes>
                <Route path="/" element={<Display />} />
                <Route path="/new" element={<NewProductForm />} />
            </Routes>
        </HashRouter>
    );
};

export default RouteSwitch;

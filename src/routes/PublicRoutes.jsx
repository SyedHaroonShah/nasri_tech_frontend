import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

import Home from '../pages/Home/Home';
import ProductDetails from '../pages/Products/ProductDetails';
import WarrantyClaim from '../pages/Warranty/WarrantyClaim';
import Quotation from '../pages/Quotation/Quotation';
import Contact from '../pages/Contact/Contact';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/warranty-claim" element={<WarrantyClaim />} />
        <Route path="/quotation" element={<Quotation />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;

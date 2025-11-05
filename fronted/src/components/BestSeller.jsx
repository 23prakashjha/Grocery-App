import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products = [] } = useAppContext(); // ✅ Prevent undefined error

  const bestSellers = products
    .filter((product) => product.inStock) // ✅ Safe now
    .slice(0, 5);

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Best Sellers</p>

      <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center justify-center">
        {bestSellers.length > 0 ? (
          bestSellers.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No best sellers available.
          </p>
        )}
      </div>
    </div>
  );
};

export default BestSeller;

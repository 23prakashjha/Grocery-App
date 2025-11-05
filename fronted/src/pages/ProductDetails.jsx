import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";


const ProductDetails = () => {
  const { products, currency, addToCart } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((item) => item._id == id);

  useEffect(() => {
    if (products.length > 0 && product) {
      const related = products.filter(
        (item) => item.category === product.category && item._id !== product._id
      );
      setRelatedProducts(related.slice(0, 5));
    }
  }, [products, product]);

  useEffect(() => {
    if (product?.image?.length > 0) {
      setThumbnail(product.image[0]);
    } else {
      setThumbnail(null);
    }
  }, [product]);

  if (!product) return <p className="mt-12 text-center">Product not found.</p>;

  return (
    <div className="mt-12">
      <p>
        <Link to="/">Home</Link> /
        <Link to="/products"> Products</Link> /
        <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link> /
        <span className="text-primary-500"> {product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16 mt-4">
        {/* Left: Images */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {product.image?.map((img, i) => (
              <div
                key={i}
                onClick={() => setThumbnail(img)}
                className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} />
              </div>
            ))}
          </div>

          <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
            {thumbnail ? (
              <img src={thumbnail} alt="Main" className="w-full h-full object-cover" />
            ) : (
              <div className="p-8 text-center text-gray-400">No image available</div>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium">{product.name}</h1>

          <div className="flex items-center gap-0.5 mt-1">
            {Array(5).fill("").map((_, i) => (
              <img
                key={i}
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt="star"
                className="md:w-4 w-3.5"
              />
            ))}
            <p className="text-base ml-2">(5)</p>
          </div>

          <div className="mt-6">
            <p className="text-gray-500/70 line-through">
              MRP: {currency} {product.price}
            </p>
            <p className="text-2xl font-medium">
              MRP: {currency} {product.offerPrice}
            </p>
            <span className="text-gray-500/70">(inclusive of all taxes)</span>
          </div>

          <p className="text-base font-medium mt-6">About Product</p>
          <ul className="list-disc ml-4 text-gray-500/70">
            {product.description?.map((desc, i) => (
              <li key={i}>{desc}</li>
            ))}
          </ul>

          <div className="flex items-center mt-10 gap-4 text-base">
            <button
  onClick={() => {
    if (addToCart) {
      addToCart(product._id);
    }
  }}
  className="w-full py-3.5 font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
>
  Add to Cart
</button>

<button
  onClick={() => {
    if (addToCart) {
      addToCart(product._id);
      navigate("/cart");
    }
  }}
  className="w-full py-3.5 font-medium bg-primary text-white hover:bg-primary/90 transition"
>
  Buy now
</button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="flex flex-col items-center mt-20">
        <div className="flex flex-col items-center w-max">
          <p className="text-3xl font-medium">Related Products</p>
          <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-8 mt-6 w-full">
          {relatedProducts
            .filter((p) => p.inStock)
            .map((p, i) => (
              <ProductCard key={i} product={p} />
            ))}
        </div>

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
        >
          See More
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;

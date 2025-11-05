import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Cart = () => {
  const {
    products = [],
    cartItems = {},
    setCartItems,
    removeFromCart,
    updateCartItem,
    axios,
    user,
  } = useAppContext();

  const navigate = useNavigate();

  const [cartArray, setCartArray] = useState([]);
  const [address, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  const getCart = () => {
    const tempArray = [];
    for (const key in cartItems) {
      const product = products.find((p) => p._id === key);
      if (product) {
        tempArray.push({ ...product, quantity: cartItems[key] });
      }
    }
    setCartArray(tempArray);
  };

  const getAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddress(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getAddress();
    }
  }, [user]);

  useEffect(() => {
    if (products.length > 0 && cartItems && Object.keys(cartItems).length > 0) {
      getCart();
    } else {
      setCartArray([]);
    }
  }, [products, cartItems]);

  const cartAmount = cartArray.reduce(
    (acc, item) => acc + item.offerPrice * item.quantity,
    0
  );
  const tax = (cartAmount * 2) / 100;
  const totalAmount = cartAmount + tax;

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }
      if (cartArray.length === 0) {
        return toast.error("Your cart is empty");
      }

      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
          toast.success(data.message);
          setCartItems({}); // clear cart on success
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      } else {
        toast.info("Online payment is not implemented yet");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (products.length === 0 || Object.keys(cartItems).length === 0) {
    return (
      <div className="text-center mt-16">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 bg-primary cursor-pointer text-white px-4 py-2 rounded"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row mt-16">
      {/* Left: Cart Items */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary-500">{cartArray.length} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                  window.scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 border border-gray-300 rounded overflow-hidden flex items-center justify-center"
              >
                <img
                  src={product.image?.[0] || ""}
                  alt={product.name}
                  className="max-w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>Weight: {product.weight || "N/A"}</p>
                  <div className="flex items-center">
                    <p>Qty:&nbsp;</p>
                    <select
                      className="outline-none"
                      value={product.quantity}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value, 10);
                        updateCartItem(product._id, qty);
                      }}
                    >
                      {Array.from({ length: Math.max(9, product.quantity) }).map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center">₹{product.offerPrice * product.quantity}</p>

            <button
              className="cursor-pointer mx-auto"
              onClick={() => {
                removeFromCart(product._id);
              }}
            >
              <img
                src={assets.remove_icon}
                alt="remove"
                className="inline-block w-6 h-6"
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate("/products");
            window.scrollTo(0, 0);
          }}
          className="group flex items-center mt-8 gap-2 text-primary-500 font-medium"
        >
          <img
            src={assets.arrow_right_icon_colored}
            alt=""
            className="group-hover:-translate-x-1 transition"
          />
          Continue Shopping
        </button>
      </div>

      {/* Right: Summary */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 mt-16 md:mt-0 border border-gray-300/70">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500 text-sm w-4/5">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary-500 hover:underline cursor-pointer text-sm"
            >
              Change
            </button>

            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10">
                {address.map((addr, idx) => (
                  <p
                    key={idx}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {addr.street}, {addr.city}, {addr.state}, {addr.country}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="text-primary-500 text-center cursor-pointer p-2 hover:bg-primary-500/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />
        <div className="text-gray-500 mt-4 space-y-2 text-sm">
          <p className="flex justify-between">
            <span>Price</span>
            <span>₹{cartAmount.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 bg-primary text-white font-medium hover:bg-primary cursor-pointer transition"
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Cart;

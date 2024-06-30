"use client"
import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [wishlist, setWishlist] = useState(true);
  const [cart, setCart] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [navNum, setNavNum] = useState(0);
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(true);

  const handleWishlist = () => {
    setWishlist(!wishlist);
    setCart(true);
  };
  const handleCart = () => {
    setCart(!cart);
    setWishlist(true);
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <>
      <div className="navbar bg-[#1E1E1E] text-white flex items-center justify-center px-2 md:px-10">
          <img src={"/admin-logo.png"} priority={true} alt="" className=" w-20 md:w-36" />
      </div>
      
    </>
  );
};

export default Navbar;

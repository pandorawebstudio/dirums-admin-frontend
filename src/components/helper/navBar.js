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
      <div className="navbar bg-[#1E1E1E] text-white flex items-center justify-between px-2 md:px-10">
        <div className="flex-1">
          <img src={"/admin-logo.png"} priority={true} alt="" className=" w-20 md:w-36" />
        </div>
        <div className="flex-none hidden sm:flex">
          <ul className="menu menu-horizontal px-1 flex gap-5 items-center">
            {/* <li className=" rounded-none">
              <h1 className=" bg-transparent hidden md:flex font-semibold text-[15px] font-montserrat">
                Enter your Phone Number
              </h1>
              <div className="form-control bg-transparent">
                <label className="input-group">
                  <select
                    value={selectedOption}
                    onChange={handleChange}
                    className=" bg-black w-14"
                  >
                    <option value="">Se</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </select>
                  <input
                    type="number"
                    placeholder="8888888888"
                    className="input input-bordered text-black font-montserrat font-semibold"
                    value={navNum}
                    onChange={(e) => setNavNum(e.target.value)}
                  />
                </label>
              </div>
            </li> */}

            <li>
              <Link
                href="/signup"
                
              >
               <p className="btn bg-transparent border-2 border-white font-semibold px-5 py-2 rounded-md hover:bg-white hover:text-black">Start Selling</p> 
              </Link>
            </li>

            <li>
              <a
                href="/login"
                className="btn bg-[#FFCC7E] border-2 border-transparent text-black font-semibold  px-5 py-2 rounded-md hover:bg-black hover:text-[#FFCC7E]"
              >
                Login
              </a>
            </li>
          </ul>
        </div>

        <div className=" sm:hidden flex flex-1 justify-end items-center py-3">
          <img
            src={"/images/menu.svg"}
            alt="menu"
            className={`${
              toggle ? "hidden" : ""
            } w-7 h-7 object-contain cursor-pointer`}
            onClick={() => setToggle(!toggle)}
          />
          <Link href="/signup">
            <p
              className={`${
                toggle ? "flex" : "hidden"
              } btn bg-transparent border-2 px-5 py-1 rounded-md border-white font-semibold font-montserrat hover:bg-white hover:text-black`}
            >
              Start Selling
            </p>
          </Link>
        </div>
      </div>
      <div
        className={`${
          !toggle ? "hidden" : "flex"
        } py-3 px-2 sm:hidden flex black-gradient top-16 rounded-t-none right-0 w-full items-center justify-between z-10  bg-gray-400 `}
      >
        <p className="text-black w-full text-sm">Already have an account?</p>
        <ul className=" list-none flex justify-end items-start flex-col gap-4 ">
          <li className="text-white font-medium cursor-pointer text-base">
            <Link href="/login">
              <p className="btn bg-[#FFCC7E] border-2 px-5 py-1 rounded-md text-center border-transparent text-black font-semibold font-montserrat hover:bg-black hover:text-[#FFCC7E]">
                Login
              </p>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;

import React from "react";
import "../App.css";
import { Sun, User, Settings } from "lucide-react";

const Navbar = () => {
  return (
    <nav class="navbar">
      <div class="logo font-sans font-extralight">UIForge</div>

      <div class="nav-icons text-white">
        <button class="icon-btn">
          <Sun />
        </button>
        <button class="icon-btn">
          <User />
        </button>
        <button class="icon-btn">
          <Settings />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

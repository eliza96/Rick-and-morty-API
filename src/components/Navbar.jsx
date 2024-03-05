import { HeartIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar__logo">😎</div>
      <input type="text" className="text-field" placeholder="search..." />
      <div className="navbar__result">found x characters</div>
      <button className="heart">
        <HeartIcon className="icon" />
      </button>
    </div>
  );
}

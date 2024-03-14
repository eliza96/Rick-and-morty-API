import { HeartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Character } from "./CharacterList";
import Modal from "./Modal";

export default function Navbar({ children }) {
  return (
    <div className="navbar">
      <div className="navbar__logo">😎</div>
      {children}
    </div>
  );
}

export function Search({ query, setQuery }) {
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      type="text"
      className="text-field"
      placeholder="search..."
    />
  );
}

export function SearchResult({ characters }) {
  return (
    <div className="navbar__result">found {characters.length} characters</div>
  );
}

export function Favourite({ favourite, onDeleteFav }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Modal title="Favourite list" open={isOpen} onOpen={setIsOpen}>
        {favourite.map((item) => {
          return (
            <Character key={item.id} item={item}>
              <button className="icon red" onClick={() => onDeleteFav(item.id)}>
                <TrashIcon />
              </button>
            </Character>
          );
        })}
      </Modal>
      <button className="heart" onClick={() => setIsOpen(true)}>
        <HeartIcon className="icon" />
        <span className="badge">{favourite.length}</span>
      </button>
    </>
  );
}

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Loader from "./Loader";
export default function CharacterList({
  characters,
  isLoading,
  onSelectedChar,
  selectedId,
}) {
  if (isLoading)
    return (
      <div className="characters-list" style={{ color: "#fff" }}>
        <Loader />
      </div>
    );
  return (
    <div className="characters-list">
      {characters.map((item) => {
        return (
          <Character key={item.id} item={item}>
            <button
              className="icon red"
              onClick={() => onSelectedChar(item.id)}
            >
              {selectedId === item.id ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </Character>
        );
      })}
    </div>
  );
}

export function Character({ item, children }) {
  return (
    <div className="list__item">
      <img src={item.image} alt={item.name} />
      <h3 className="name">
        <span>{item.gender === "Male" ? "👨" : "👩"}</span>
        {item.name}
      </h3>
      <div className="list-item__info info">
        <span
          className={`status ${item.status === "Dead" ? "red" : " "}`}
        ></span>
        <span> {item.status}</span>
        <span> - {item.species}</span>
      </div>
      {children}
    </div>
  );
}

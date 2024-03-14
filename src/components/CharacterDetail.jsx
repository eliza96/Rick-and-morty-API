import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";

export default function CharacterDetail({ selectedId, onAddFavourite, isFav }) {
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchSingleChar() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character/${selectedId}`,
          { signal }
        );
        setCharacter(data);
        const episodesId = data.episode.map((e) => e.split("/").at(-1));
        const { data: episodesData } = await axios.get(
          `https://rickandmortyapi.com/api/episode/${episodesId}`,
          { signal }
        );
        setEpisodes([episodesData].flat(Infinity).slice(0, 6));
      } catch (error) {
        if (!axios.isCancel) {
          toast.error(error.response.data.error);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (selectedId) fetchSingleChar();
    return () => {
      controller.abort();
    };
  }, [selectedId]);

  if (isLoading)
    <div style={{ flex: 1, color: "#fff" }}>
      <Loader />
    </div>;

  if (!character || !selectedId)
    return <p style={{ flex: 1, color: "#fff" }}>Please select a character</p>;

  return (
    <div style={{ flex: 1 }}>
      <CharacterSubInfo
        character={character}
        onAddFavourite={onAddFavourite}
        isFav={isFav}
      />
      <Episodes episodes={episodes} />
    </div>
  );
}

export function CharacterSubInfo({ character, onAddFavourite, isFav }) {
  return (
    <div className="character-detail">
      <img
        src={character.image}
        alt={character.name}
        className="character-detail__img"
      />
      <div className="character-detail__info">
        <h3 className="name">
          <span>{character.gender === "Male" ? "👨" : "👩"}</span>
          <span>&nbsp;{character.name}</span>
        </h3>
        <div className="info">
          <span
            className={`status ${character.status === "Dead" ? "red" : ""}`}
          ></span>
          <span>&nbsp;{character.status}</span>
          <span> - &nbsp;{character.species}</span>
        </div>
        <div className="location">
          <p>Last known locations:</p>
          <p>{character.location.name}</p>
        </div>
        <div className="actions">
          {isFav ? (
            <p>Already added to favourite ✔</p>
          ) : (
            <button
              className="btn btn--primary"
              onClick={() => onAddFavourite(character)}
            >
              Add to favourite
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function Episodes({ episodes }) {
  const [isSort, setIsSort] = useState(true);
  let sortedEpisodes;
  if (isSort) {
    sortedEpisodes = episodes.sort(
      (a, b) => new Date(a.created) - new Date(b.created)
    );
  } else {
    sortedEpisodes = episodes.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );
  }
  return (
    <div className="character-episodes">
      <div className="title">
        <h2>List of episodes:</h2>
        <button onClick={() => setIsSort((is) => !is)}>
          <ArrowUpCircleIcon
            className="icon"
            style={{ rotate: isSort ? "0deg" : "180deg" }}
          />
        </button>
      </div>
      <ul>
        {sortedEpisodes.map((item, index) => {
          return (
            <li key={index}>
              <div>
                {String(index + 1).padStart(2, "0")} {item.episode}:
                <strong>{item.name}</strong>
              </div>
              <div className="badge badge--secondary">{item.air_date}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

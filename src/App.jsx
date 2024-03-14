import Navbar, { SearchResult, Search, Favourite } from "./components/Navbar";
import CharacterList from "./components/CharacterList";
import CharacterDetail from "./components/CharacterDetail";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [favourite, setFavourite] = useState(
    () => JSON.parse(localStorage.getItem("FAVOURITE")) || []
  );

  useEffect(() => {
    localStorage.setItem("FAVOURITE", JSON.stringify(favourite));
  }, [favourite]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchData() {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character/?name=${query}`,
          { signal }
        );

        setCharacters(data.results.slice(0, 5));
      } catch (err) {
        if (!axios.isCancel) {
          setCharacters([]);
          toast.error(err.response.data.error);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
    return () => {
      controller.abort();
    };
  }, [query]);

  const handleSelectCharachter = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  const handleAddToFavourite = (char) => {
    setFavourite((prevFav) => [...prevFav, char]);
  };

  const handleRemoveFavourite = (id) => {
    setFavourite((prevFav) => prevFav.filter((item) => item.id !== id));
  };
  const isFav = favourite.map((f) => f.id).includes(selectedId);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       setIsLoading(true);
  //       const response = await fetch(
  //         "https://rickandmortyapi.com/api/character"
  //       );
  //       if (!response.ok) {
  //         throw new Error("Something went wrong!");
  //       }
  //       const data = await response.json();
  //       setCharacters(data.results.slice(0, 5));
  //     } catch (error) {
  //       toast.error(error.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, []);
  return (
    <div className="app">
      <Toaster />

      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <SearchResult characters={characters} />
        <Favourite favourite={favourite} onDeleteFav={handleRemoveFavourite} />
      </Navbar>
      <div className="main">
        <CharacterList
          characters={characters}
          isLoading={isLoading}
          onSelectedChar={handleSelectCharachter}
          selectedId={selectedId}
        />
        <CharacterDetail
          selectedId={selectedId}
          isFav={isFav}
          onAddFavourite={handleAddToFavourite}
        />
      </div>
    </div>
  );
}

export default App;

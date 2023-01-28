import { useCallback, useState } from "react";
import "./App.css";
import { FernApi, FernApiClient } from "./api";

const BACKEND_CLIENT = new FernApiClient({
  environment: "http://localhost:8080",
});

function App() {
  const [movie, setMovie] = useState<FernApi.Movie>();

  const onClick = useCallback(async () => {
    try {
      const movie = await BACKEND_CLIENT.imdb.getMovie("goodwill-hunting");
      setMovie(movie);
    } catch (e) {
      console.error("Failed to get movie", e);
    }
  }, []);

  return (
    <div className="App">
      <div className="button-container">
        <button onClick={onClick}>Load movie</button>
      </div>
      {movie != null && <pre>{JSON.stringify(movie, undefined, 4)}</pre>}
    </div>
  );
}

export default App;

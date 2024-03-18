import { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import "./App.css";

function App() {
  const [data, setData] = useState([]);

  function fetchApi() {
    fetch("http://localhost:3000")
      .then((response) => response.json())
      .then((data) => setData(data.data.tPhoto));
  }

  useEffect(() => {
    fetchApi();
  }, []);

  function dateLocale(date) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(date).toLocaleDateString("fr-FR", options);
  }

  return (
    <>
      <Carousel>
        {data.map((photo) => (
          <div key={photo.date} className="container">
            <img src={`https:${photo.path}`} alt={photo.date} />
            <p className="legend">{dateLocale(photo.date)}</p>
          </div>
        ))}
      </Carousel>
    </>
  );
}

export default App;

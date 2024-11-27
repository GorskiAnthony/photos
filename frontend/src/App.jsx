import { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import "./App.css";
import ZoomableImage from "./components/ZoomableImage";

function App() {
	const [data, setData] = useState([]);

	useEffect(() => {
		function fetchApi() {
			fetch("http://localhost:3000")
				.then((response) => response.json())
				.then((data) => setData(data.data.tPhoto));
		}
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
			<Carousel showThumbs={false}>
				{data.map((photo) => (
					<ZoomableImage
						key={photo.date}
						src={photo.path}
						alt={photo.date}
						date={dateLocale(photo.date)}
					/>
				))}
			</Carousel>
		</>
	);
}

export default App;

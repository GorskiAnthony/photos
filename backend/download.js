const fs = require("fs");
const https = require("https");

// Votre fonction fetchUrl existante...
const fetchUrl = require("./services/fetch");

// Fonction pour télécharger et sauvegarder une image
function downloadImage(url, filename) {
	return new Promise((resolve, reject) => {
		https
			.get(url, (res) => {
				const stream = fs.createWriteStream(filename);
				res.pipe(stream);
				stream.on("finish", () => {
					stream.close(resolve);
				});
			})
			.on("error", (e) => {
				console.error(`Got error: ${e.message}`);
				reject(e);
			});
	});
}

async function processImages() {
	try {
		const url =
			"https://www.devisubox.com/dv/dv.php5?pgl=Project/interface&sRef=HYP54PJK";
		const data = await fetchUrl(url);

		if (data && data.success) {
			const photos = data.data.tPhoto;
			console.log(`Nombre d'images trouvées : ${photos.length}`);
			for (let i = 0; i < photos.length; i++) {
				const photo = photos[i];
				const imageUrl = `https:${photo.path}`;
				const filename = `downloads/image_${i}.jpg`;
				await downloadImage(imageUrl, filename);
				console.log(`Image téléchargée: ${filename}`);
			}
		} else {
			console.error(
				"Aucune donnée ou succès non trouvé dans la réponse."
			);
		}
	} catch (error) {
		console.error("Erreur lors du traitement des images: ", error);
	}
}

processImages();

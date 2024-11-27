import React, { useState, useRef, useEffect } from "react";

const ZoomableImage = ({ src, alt, date }) => {
	const [zoom, setZoom] = useState(1); // Niveau de zoom
	const [position, setPosition] = useState({ x: 0, y: 0 }); // Position de l'image
	const [dragging, setDragging] = useState(false); // État du déplacement
	const [startPosition, setStartPosition] = useState({ x: 0, y: 0 }); // Position initiale pour le déplacement
	const containerRef = useRef(null); // Référence du conteneur
	const imgRef = useRef(null); // Référence de l'image

	// Calculer les limites pour bloquer les bords
	const getBounds = () => {
		const container = containerRef.current;
		const img = imgRef.current;

		if (!container || !img) return { xMin: 0, xMax: 0, yMin: 0, yMax: 0 };

		const containerWidth = container.offsetWidth;
		const containerHeight = container.offsetHeight;

		const imgWidth = img.offsetWidth * zoom;
		const imgHeight = img.offsetHeight * zoom;

		const xMin = Math.min(0, (containerWidth - imgWidth) / 2);
		const xMax = Math.max(0, (imgWidth - containerWidth) / 2);

		const yMin = Math.min(0, (containerHeight - imgHeight) / 2);
		const yMax = Math.max(0, (imgHeight - containerHeight) / 2);

		return { xMin, xMax, yMin, yMax };
	};

	// Gestion du zoom avec la molette
	const handleWheel = (e) => {
		e.preventDefault();
		const zoomChange = e.deltaY > 0 ? -0.1 : 0.1; // Zoom arrière ou avant
		setZoom((prevZoom) => {
			const newZoom = Math.min(Math.max(prevZoom + zoomChange, 1), 5); // Limiter le zoom entre 1x et 5x
			if (newZoom !== prevZoom) {
				setPosition((prevPosition) => {
					const { xMin, xMax, yMin, yMax } = getBounds();
					return {
						x: Math.min(Math.max(prevPosition.x, xMin), xMax),
						y: Math.min(Math.max(prevPosition.y, yMin), yMax),
					};
				});
			}
			return newZoom;
		});
	};

	// Commencer le déplacement
	const handleMouseDown = (e) => {
		setDragging(true);
		setStartPosition({
			x: e.clientX - position.x,
			y: e.clientY - position.y,
		});
	};

	// Déplacer l'image avec contrainte
	const handleMouseMove = (e) => {
		if (dragging) {
			const { xMin, xMax, yMin, yMax } = getBounds();
			setPosition({
				x: Math.min(Math.max(e.clientX - startPosition.x, xMin), xMax),
				y: Math.min(Math.max(e.clientY - startPosition.y, yMin), yMax),
			});
		}
	};

	// Arrêter le déplacement
	const handleMouseUp = () => {
		setDragging(false);
	};

	// Réinitialiser les limites au redimensionnement ou au zoom
	useEffect(() => {
		const { xMin, xMax, yMin, yMax } = getBounds();
		setPosition((prevPosition) => ({
			x: Math.min(Math.max(prevPosition.x, xMin), xMax),
			y: Math.min(Math.max(prevPosition.y, yMin), yMax),
		}));
	}, [zoom]);

	// Ajouter et retirer l'écouteur "wheel" avec { passive: false }
	useEffect(() => {
		const container = containerRef.current;

		if (container) {
			container.addEventListener("wheel", handleWheel, {
				passive: false,
			});

			return () => {
				container.removeEventListener("wheel", handleWheel);
			};
		}
	}, [zoom]);

	return (
		<div
			ref={containerRef}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp}
			style={{
				cursor: dragging ? "grabbing" : "grab",
				overflow: "hidden",
				width: "100%",
				height: "auto",
				border: "1px solid #ccc",
				zIndex: 1,
			}}
		>
			<img
				ref={imgRef}
				src={src}
				alt={alt}
				style={{
					transform: `scale(${zoom}) translate(${
						position.x / zoom
					}px, ${position.y / zoom}px)`,
					transformOrigin: "center",
					transition: dragging ? "none" : "transform 0.2s ease",
					cursor: "inherit",
					width: "100%", // Rendre l'image fluide
					height: "auto", // Maintenir le ratio d'aspect
				}}
				draggable={false} // Empêche le comportement natif de drag de l'image
			/>
			<p className="legend">{date}</p>
		</div>
	);
};

export default ZoomableImage;

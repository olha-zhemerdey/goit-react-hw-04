import { useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import "./App.css";
import fetchGalleryPhotos from "./services/api";

import SearchBar from "./components/SearchBar/SearchBar";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import LoadMoreBtn from "./components/LoadMoreBtn/LoadMoreBtn";
import ImageModal from "./components/ImageModal/ImageModal";

function App() {
  const [page, setPage] = useState(1);
  const [queryValue, setQueryValue] = useState("");
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [altDescription, setAltDescription] = useState("");

  const ref = useRef(null);

  useEffect(() => {
    if (!queryValue) return;

    const handleSearch = async () => {
      try {
        setIsLoading(true);
        const data = await fetchGalleryPhotos(queryValue, page);
        setGallery((prevGallery) => [...prevGallery, ...data.results]);
        setTotalPages(data.total_pages);
        if (!data.results.length) {
          toast.error(`Nothing was found for the word "${queryValue}"`);
        }
      } catch (error) {
        setIsError(true);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    handleSearch();
  }, [page, queryValue]);

  useEffect(() => {
    if (page === 1) return;

    ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [page, gallery]);

  const handleQuery = (newQuery) => {
    setQueryValue(newQuery);
    setGallery([]);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const isActive = useMemo(() => page === totalPages, [page, totalPages]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const updateModalStateData = (src, alt) => {
    setModalImage(src);
    setAltDescription(alt);
  };

  return (
    <div ref={ref}>
      <SearchBar onSubmit={handleQuery} />
      {gallery.length > 0 && (
        <ImageGallery
          gallery={gallery}
          openModal={openModal}
          updateModalStateData={updateModalStateData}
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {gallery.length > 0 && !isLoading && !isError && (
        <LoadMoreBtn handleLoadMore={handleLoadMore} isActive={isActive} />
      )}
      <ImageModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        src={modalImage}
        alt={altDescription}
      />
      <Toaster position="top-right" reverseOrder={true} />
    </div>
  );
}

export default App;

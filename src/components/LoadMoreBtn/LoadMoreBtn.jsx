import css from "./LoadMoreBtn.module.css";

const LoadMoreBtn = ({ handleLoadMore, isActive }) => {
  return (
    <button
      className={css.loadBtn}
      onClick={handleLoadMore}
      type="button"
      disabled={isActive}
    >
      Load more
    </button>
  );
};

export default LoadMoreBtn;

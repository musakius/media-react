import React, { useEffect } from "react";
import { useUpgradeState } from "../../hooks";
import { withService, withToken } from "../../hocs";
import { Link } from "react-router-dom";
import MiniSpinner from "../mini-spinner";
import PropTypes from "prop-types";
import "./buttons.scss";

function ButtonLike({ mrService, isToken, data, onChange }) {
  const { favoritesCount, favorited, loadLike, slug, text = "" } = data;
  const [like, setLike] = useUpgradeState(favorited, !!slug);
  const [likeCount, setLikeCount] = useUpgradeState(favoritesCount, !!slug);
  const [load, setLoad] = useUpgradeState(loadLike, !!slug);
  const [widthBtn, setWidthBtn] = useUpgradeState(0, !!slug);
  const ref = React.createRef();

  useEffect(() => {
    setLike(favorited);
    setLikeCount(favoritesCount);
    setLoad(loadLike);
  }, [favorited, favoritesCount, loadLike, setLike, setLikeCount, setLoad]);

  useEffect(() => {
    if (ref.current !== null) setWidthBtn(ref.current.offsetWidth);
  }, [ref, setWidthBtn]);

  function toggleFavorited(slug) {
    setLoad(true);
    if (!like) {
      mrService
        .postFavorited(slug)
        .then(updateFavorited)
        .catch((error) => console.error(error));
    } else {
      mrService
        .deleteFavorited(slug)
        .then(updateFavorited)
        .catch((error) => console.error(error));
    }
  }

  function updateFavorited(article) {
    setLike(article.favorited);
    setLikeCount(article.favoritesCount);
    if (onChange) onChange("like");
    setLoad(false);
  }

  let className = "btn-like";
  let textForLike = text;
  if (text) textForLike = ` F${text} `;

  if (like) {
    className += " bg-primary text-white";
    if (text) textForLike = ` Unf${text} `;
  }

  if (load) {
    return (
      <button
        type="button"
        className={className}
        style={{ minWidth: widthBtn + "px" }}>
        <MiniSpinner />
      </button>
    );
  }

  if (isToken) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => toggleFavorited(slug)}
        ref={ref}>
        <i className="fas fa-heart" />
        <span>
          {textForLike}
          {likeCount}
        </span>
      </button>
    );
  }

  return (
    <Link to="/login">
      <button type="button" className={className}>
        <i className="fas fa-heart" />
        <span>
          {textForLike}
          {likeCount}
        </span>
      </button>
    </Link>
  );
}

ButtonLike.propTypes = {
  mrService: PropTypes.object,
  isToken: PropTypes.bool,
  onChange: PropTypes.func,
  data: PropTypes.shape({
    favoritesCount: PropTypes.number,
    favorited: PropTypes.bool,
    loadLike: PropTypes.bool,
    slug: PropTypes.string,
    text: PropTypes.string
  })
};

export default withService()(withToken(ButtonLike));

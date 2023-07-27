import PropTypes from "prop-types";
import Icons from "../../assets/svg/icons.svg";
import { useRef } from "react";

export default function Icon({ icon, classes }) {
  const iconRef = useRef();
  return (
    <>
      <svg
        aria-hidden="true"
        className={`icon ${classes ? classes : ""}`}
        ref={iconRef}
      >
        <use xlinkHref={`${Icons}#icon-${icon}`} />
      </svg>
    </>
  );
}

Icon.propTypes = {
  icon: PropTypes.string,
  classes: PropTypes.string,
};

export default function Logo() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 800 800"
        className="main-logo"
      >
        <defs>
          <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="nnneon-grad">
            <stop
              className="logo-stop-secondary"
              stopOpacity="1"
              offset="0%"
            ></stop>
            <stop
              className="logo-stop-primary"
              stopOpacity="1"
              offset="100%"
            ></stop>
          </linearGradient>
          <filter
            id="nnneon-filter"
            x="-100%"
            y="-100%"
            width="400%"
            height="400%"
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur
              stdDeviation="17 8"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              in="SourceGraphic"
              edgeMode="none"
              result="blur"
            ></feGaussianBlur>
          </filter>
          <filter
            id="nnneon-filter2"
            x="-100%"
            y="-100%"
            width="400%"
            height="400%"
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur
              stdDeviation="10 17"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              in="SourceGraphic"
              edgeMode="none"
              result="blur"
            ></feGaussianBlur>
          </filter>
        </defs>
        <g strokeWidth="16" stroke="url(#nnneon-grad)" fill="none">
          <polygon
            points="400,250 250,550 550,550"
            filter="url(#nnneon-filter)"
          ></polygon>
          <polygon
            points="412,250 262,550 562,550"
            filter="url(#nnneon-filter2)"
            opacity="0.25"
          ></polygon>
          <polygon
            points="388,250 238,550 538,550"
            filter="url(#nnneon-filter2)"
            opacity="0.25"
          ></polygon>
          <polygon points="400,250 250,550 550,550"></polygon>
        </g>
      </svg>
    </>
  );
}

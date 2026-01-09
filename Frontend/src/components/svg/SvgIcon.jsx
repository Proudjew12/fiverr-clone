export function SvgIcon({ icon }) {
  const svg = _getIcon(icon)
  return <>{svg || null}</>
}

function _getIcon(icon) {
  const icons = {
    arrowRight: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 17"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="m10.531 13.037 4.219-4.219m0 0L10.531 4.6m4.219 4.218H1.25"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    ),
  }

  return icons[icon]
}

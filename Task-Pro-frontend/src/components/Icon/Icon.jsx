export const Icon = ({ name, className, ...rest }) => (
  <svg className={className} aria-hidden="true" {...rest}>
    <use href={`${import.meta.env.BASE_URL}icons.svg#${name}`} />
  </svg>
);

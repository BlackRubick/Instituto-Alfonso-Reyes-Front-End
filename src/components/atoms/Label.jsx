export const Label = ({ htmlFor = '', children, className = '', ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-semibold text-neutral-dark mb-2 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

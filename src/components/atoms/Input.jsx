export const Input = ({ 
  type = 'text', 
  placeholder = '', 
  className = '',
  ...props 
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`
        w-full px-4 py-3 border-2 border-neutral-medium rounded-xl
        focus:border-primary-main focus:outline-none transition-colors
        bg-neutral-white text-neutral-dark placeholder:text-neutral-dark/50
        ${className}
      `}
      {...props}
    />
  );
};

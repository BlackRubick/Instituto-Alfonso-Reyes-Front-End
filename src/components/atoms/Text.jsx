export const Text = ({ 
  as = 'p', 
  variant = 'body', 
  className = '', 
  children,
  ...props 
}) => {
  const variants = {
    body: 'text-base text-neutral-dark leading-relaxed',
    small: 'text-sm text-neutral-dark/70',
    large: 'text-lg text-neutral-dark',
    subtitle: 'text-xl font-semibold text-neutral-dark',
  };

  const Component = as;

  return (
    <Component 
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

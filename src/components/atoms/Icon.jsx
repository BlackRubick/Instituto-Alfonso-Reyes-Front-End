import * as Icons from 'lucide-react';

export const Icon = ({ name, size = 24, color = 'currentColor', className = '', ...props }) => {
  const IconComponent = Icons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent 
      size={size} 
      color={color}
      className={className}
      {...props}
    />
  );
};

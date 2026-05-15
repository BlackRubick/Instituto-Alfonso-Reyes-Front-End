import { Icon, Text } from '../atoms';

export const Card = ({ 
  icon = null, 
  title = '', 
  description = '', 
  className = '',
  onClick = null,
  ...props 
}) => {
  return (
    <div
      className={`
        card-default cursor-pointer
        ${onClick ? 'hover:scale-105' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {icon && (
        <div className="mb-4 text-primary-main">
          {typeof icon === 'string' ? (
            <Icon name={icon} size={32} color="#1A9E96" />
          ) : (
            icon
          )}
        </div>
      )}
      {title && (
        <h3 className="text-xl font-bold text-neutral-dark mb-2">{title}</h3>
      )}
      {description && (
        <Text className="text-neutral-dark/70">{description}</Text>
      )}
    </div>
  );
};

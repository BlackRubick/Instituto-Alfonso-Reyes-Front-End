import { Icon, Text } from '../atoms';

export const ContactItem = ({ 
  icon = '', 
  label = '', 
  value = '',
  link = null,
  className = '' 
}) => {
  const content = (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="text-accent-gold mt-1">
        <Icon name={icon} size={24} color="#E8A800" />
      </div>
      <div>
        <Text as="p" className="text-sm font-semibold text-neutral-dark">
          {label}
        </Text>
        <Text as="p" className="text-neutral-dark/70 mt-1">
          {value}
        </Text>
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} className="hover:opacity-80 transition-opacity">
        {content}
      </a>
    );
  }

  return content;
};

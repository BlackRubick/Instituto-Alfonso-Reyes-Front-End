import { Label, Input } from '../atoms';

export const FormField = ({ 
  label, 
  id, 
  type = 'text', 
  placeholder = '',
  error = '',
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className={error ? 'border-red-500' : ''}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

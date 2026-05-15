import { Link } from 'react-router-dom';

export const NavbarItem = ({ to, label, active = false, onClick = () => {} }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        px-4 py-2 font-semibold transition-all duration-300
        ${active 
          ? 'text-primary-main border-b-2 border-primary-main' 
          : 'text-neutral-dark hover:text-primary-main'
        }
      `}
    >
      {label}
    </Link>
  );
};

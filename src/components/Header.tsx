import { ChevronLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  userName?: string;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}

const Header = ({ userName, title, subtitle, showBack }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="px-4 py-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {userName ? (
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-primary">EcoConsumo</h1>
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-bold">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {userName && (
            <span className="text-sm text-muted-foreground">Olá, {userName}</span>
          )}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import { useNavigate } from 'react-router-dom';
import { HOME_PATH } from '../data/navigation';
import './LovePage.css';

const floatingHeartEmojis = ['💕', '💖', '💗', '💓', '💝', '❤️', '💘', '💞', '💟', '🩷'];

export const LovePage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(HOME_PATH);
  };

  return (
    <div className="love-page">
      <div aria-hidden="true" className="love-page__hearts">
        {floatingHeartEmojis.map((emoji, index) => {
          return (
            <span
              className="love-page__heart"
              key={`${emoji}-${index}`}
              style={{
                animationDelay: `${index * 0.35}s`,
                left: `${(index * 11) % 92}%`,
              }}
            >
              {emoji}
            </span>
          );
        })}
      </div>

      <div className="love-page__content">
        <p className="love-page__emoji-row">💕 ❤️ 💖 ❤️ 💕</p>
        <h1 className="love-page__message">Keka, o Lucas te ama muito.</h1>
        <p className="love-page__emoji-row">💖 💗 💓 💗 💖</p>
        <button className="love-page__back" onClick={handleBackClick} type="button">
          💌 voltar
        </button>
      </div>
    </div>
  );
};

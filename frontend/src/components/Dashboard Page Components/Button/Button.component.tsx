

import React from 'react';

interface ButtonComponentProps {
  text: string;
  onClick: () => void;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ text, onClick }) => {
  return (
    <div>
      <button className="btn btn-primary text-white" onClick={onClick}>
        {text}
      </button>
    </div>
  );
};

export default ButtonComponent;

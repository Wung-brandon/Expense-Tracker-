

import React from 'react';

interface ButtonComponentProps {
  text: string;
  onClick: () => void;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ text, onClick }) => {
  return (
    <div>
      <button className="btn text-white" style={{backgroundColor:"#4a148c"}} onClick={onClick}>
        {text}
      </button>
    </div>
  );
};

export default ButtonComponent;

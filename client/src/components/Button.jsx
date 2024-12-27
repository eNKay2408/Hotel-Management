const Button = ({
  color,
  text,
  disabled = false,
  onClick = () => {},
  type = 'button',
}) => {
  return (
    <button
      className={`${
        color === 'green'
          ? 'text-green'
          : color === 'red'
          ? 'text-red'
          : color === 'orange'
          ? 'text-orange'
          : color === 'yellow'
          ? 'text-yellow'
          : color === 'gray'
          ? 'text-gray'
          : `text-${color}`
      } bg-zinc-200 border-2 px-2 py-1 md:text-xl text-base hover:bg-white font-bold rounded-lg font-play whitespace-nowrap transition-all duration-300 ${
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      } `}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  );
};

export default Button;

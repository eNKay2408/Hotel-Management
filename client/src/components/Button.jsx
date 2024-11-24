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
          : `text-${color}`
      } bg-zinc-200 border-2 px-2 py-1 md:text-xl text-base hover:bg-white font-bold rounded-lg font-play ${
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

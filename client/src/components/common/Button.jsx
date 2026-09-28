function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) {
  const base =
    'touch-target inline-flex items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50';
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-hover',
    secondary: 'border border-line bg-white text-ink hover:bg-surface',
    ghost: 'text-accent hover:bg-teal-50',
  };

  return (
    <button type={type} disabled={disabled} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;

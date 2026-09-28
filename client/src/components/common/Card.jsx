function Card({ children, className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={`overflow-hidden rounded-2xl border border-line bg-white shadow-card ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default Card;

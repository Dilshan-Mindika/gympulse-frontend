function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 ${className}`}>
      {children}
    </div>
  );
}

export default Card;
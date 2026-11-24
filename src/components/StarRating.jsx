export default function StarRating({ rating }) {
  const full = Math.round(rating)
  return (
    <span className="star-rating" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? 'star filled' : 'star'}>
          ★
        </span>
      ))}
      <span className="rating-value">{rating.toFixed(1)}</span>
    </span>
  )
}

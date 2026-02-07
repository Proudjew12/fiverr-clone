import { ReviewPreview } from './ReviewPreview'
import { useMemo } from 'react'

export function ReviewList({ reviews = [], filterBy = {} }) {
  const filteredReviews = useMemo(() => {
    if (!Array.isArray(reviews)) return []
    if (!filterBy.rating) return reviews
    return reviews.filter((review) => review.rate === filterBy.rating)
  }, [filterBy.rating, reviews])

  if (reviews.length === 0) return <div>There are no reviews for this gig yet</div>

  return (
    <ul className="reviews">
      {filteredReviews.map((review) => (
        <ReviewPreview key={review.id} review={review} />
      ))}
    </ul>
  )
}

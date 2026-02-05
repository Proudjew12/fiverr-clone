import { Loader } from 'lucide-react'
import { ReviewPreview } from './ReviewPreview'
import { useEffect, useState } from 'react'

export function ReviewList({ reviews = [], filterBy = {} }) {
  const [filteredReviews, setFilteredReviews] = useState([...reviews])

  useEffect(() => {
    if (reviews) filterReviews()
  }, [filterBy, reviews])

  function filterReviews() {
    setFilteredReviews([...reviews])
    if (filterBy.rating) {
      setFilteredReviews(reviews.filter((review) => review.rate === filterBy.rating))
    }
  }

  if (!filteredReviews) return <Loader />
  if (reviews.length === 0) return <div>There are no reviews for this gig yet</div>

  return (
    <ul className="reviews">
      {filteredReviews.map((review) => (
        <ReviewPreview key={review.id} review={review} />
      ))}
    </ul>
  )
}

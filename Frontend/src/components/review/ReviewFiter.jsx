import { useState } from "react"

export function ReviewFilter({reviews,filterBy, onSetFilterBy}){
    const ratings = [5,4,3,2,1]
    const [selectedRating,setSelectedRating] = useState(null)
    function getPrecentOfRating(rating){
    const count = getCount(rating)
    const precent = 100* count/reviews.length
    return precent+'%'
    }
    function getCount(rating){
     const count = reviews.filter(review=>rating === review.rate).length
     return count
    }
    function onSetSelectedRating(rating){
     if(rating === selectedRating) setSelectedRating(null)
     else setSelectedRating(rating)
    onSetFilterBy({...filterBy,rating:rating})
    }
return(
    <section className="review-filter">
    <ul className="review-stats">
     {
        ratings.map(rating=>
            <li key={rating} className={(getCount(rating) === 0)?' disable':''} onClick={()=>{onSetSelectedRating(rating)}}>
           { (getCount(rating)>0) ?<button  className={(selectedRating === rating)?'rating-btn clicked':'rating-btn'}>{rating} Stars</button>
           : <span className="rating-span">{rating} Stars</span>
           }
            <div className="progress-bar-container">
                <span className="progress-bar" style={{width:getPrecentOfRating(rating)}}></span>
            </div>
            <span className="reviews-count">({reviews.filter(review=>rating === review.rate).length})</span>
            </li>
        )
     }   
    </ul>
    </section>
)
}
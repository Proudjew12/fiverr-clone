import { EmptyState } from "../ui/EmptyState";
import { ReviewPreview } from "./ReviewPreview";

export function ReviewList({reviews}){
    if(reviews.length === 0) return <div>There are no reviews for this gig yet</div>
    return(
        <ul className="reviews">
            {
             reviews.map(
               review=><ReviewPreview key={review.id} review={review}/> 
             )   
            }
        </ul>
    )
}
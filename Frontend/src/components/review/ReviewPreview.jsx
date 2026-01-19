import { RatingByStars } from "@/pages/GigDetails";

export function ReviewPreview({review}){
    
return(
    <section className="review-preview">
    <div className="user-container">
     <div className="profile-img-container">
        <img src={review.by.imgUrl}/>
        </div>
     <div className="user-details-container">
        <p className="fullname">{review.by.fullname}</p>
     </div>
    </div>
    <div className="review-details">
     <div className="rate">
     <RatingByStars rate={review.rate}/><span>{review.rate}</span>
     </div>
     <p className="review-txt">
        {review.txt}
    </p>  
    </div> 
    </section>
)
}
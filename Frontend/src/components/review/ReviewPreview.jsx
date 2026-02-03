import { RatingByStars } from "@/pages/GigDetails";
import { utilService } from "@/services/util.service";

export function ReviewPreview({ review }) {
   const nation = getRandomNation()
   function getRandomNation() {
      const nations = ['IL', 'DE', 'RU', 'FR', 'JP']
      const idx = utilService.getRandomIntInclusive(0, nations.length - 1)
      return nations[idx]
   }
   function getCountryNameByCode(countryCode){
     const countriesMap = {
      IL: 'Israel',
      DE: 'Germany',
      RU: 'Russia',
      FR: 'France',
      JP :'Japan'
     }
     return countriesMap[countryCode]
   }
   function getFlagUrl(countryCode) {
      return `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;
   }
   
   return (
      <section className="review-preview">
         <div className="user-container">
            <div className="profile-img-container">
               <img src={review.by.imgUrl} />
            </div>
            <div className="user-details-container">
               <p className="fullname">{review.by.fullname}</p>
               <div className="user-nation">
                  <div className="img-container">
                     <img src={getFlagUrl(nation)} alt="nation"/>
                  </div>
                  <p>{getCountryNameByCode(nation)}</p>
               </div>
            </div>
         </div>
         <div className="review-details">
            <div className="rate">
               <RatingByStars rate={review.rate} /><span>{review.rate}</span>
            </div>
            <p className="review-txt">
               {review.txt}
            </p>
            <div className="review-price-duration">
               <div className="price">
               <p className="number">${utilService.getRandomIntInclusive(100,300)+'-'+utilService.getRandomIntInclusive(300,500)}</p>
               <p>Price</p>
               </div>
               <div className="duration">
               <p className="number">{utilService.getRandomIntInclusive(1,2)+'-'+utilService.getRandomIntInclusive(3,4)} days</p>
               <p>Duration</p>
               </div>
            </div>
         </div>
      </section>
   )
}
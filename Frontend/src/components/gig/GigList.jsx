

import { GigPreview } from './GigPreview'

export function GigList({gigs}) {

   return (
        <section className="gig-list-container">
            <ul className="gig-list">
                {gigs.map(gig => (
                    <li key={gig._id} className="gig-card-wrapper">
                        <GigPreview gig={gig} />
                        <div className="remove-container">
                            <button onClick={() => onRemoveGig(gig._id)}>Remove</button>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}


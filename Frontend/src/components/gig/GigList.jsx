
import { useNavigate } from 'react-router-dom';

import { GigPreview } from './GigPreview.jsx'

export function GigList({ gigs }) {

    const navigate = useNavigate()

    function handleClick(id) {
        navigate(`/gig/${id}`)
    }

    return (
        <section className="gig-list-container">
            <ul className="gig-list">
                {gigs.map(gig => (
                    <li key={gig._id} className="gig-card-wrapper" onClick={() => handleClick(gig._id)}>
                        <GigPreview gig={gig} />
                    </li>
                ))}
            </ul>
        </section>
    )
}


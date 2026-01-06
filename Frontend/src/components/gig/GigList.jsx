

import { data, Link } from 'react-router-dom'
import { GigPreview } from './GigPreview'
import { useEffect, useState } from 'react'


export function GigList() {
    const [gigs, setGigs] = useState(null)

    useEffect(() => {
        query()
        .then(setGigs)
    },)

    return (
        <section className="gig-list container">
            <ul>
                {gigs.map(gig => (
                    <li key={gig._id}>
                        <GigPreview gig={gig} />
                        <div>
                            <button>
                                <Link>Edit</Link>
                            </button>
                            <button>Remove</button>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}


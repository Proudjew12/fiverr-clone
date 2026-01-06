

import { data, Link } from 'react-router-dom'
import { GigPreview } from './GigPreview'
import { useEffect, useState } from 'react'
import { gigService } from '@/services/fiverr.service.local.js'

export function GigList() {
    const [gigs, setGigs] = useState([])

 useEffect(() => {
        loadGigs()
    }, [])

    async function loadGigs() {
        try {
            const data = await gigService.query()
            setGigs(data)
        } catch (err) {
            console.error('err', err)
        }
    }

    console.log(gigs)
   if (!gigs || !gigs.length) return <div>Loading...</div>

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


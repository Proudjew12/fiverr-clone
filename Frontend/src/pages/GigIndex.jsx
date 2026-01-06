import { GigList } from "@/components/gig/GigList";
import { data, Link } from 'react-router-dom'
import { gigService } from '@/services/fiverr.service.local.js'
import { useEffect, useState } from 'react'

export function GigIndex() {

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
       <div className="main-layout-index">
            
            
            <aside className="side-col left">
               
            </aside>

            <main>
                <GigList gigs={gigs} />
            </main>

         
            <aside className="side-col right">
        
            </aside>
            
        </div>
       
    )

}
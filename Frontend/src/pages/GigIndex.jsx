import { GigList } from "@/components/gig/GigList";
import { data, Link } from 'react-router-dom'
import { gigService } from '@/services/fiverr.service.local.js'
import { useEffect, useState } from 'react'
import { GigFilter } from "@/components/filter/GigFilter.jsx";
import { utilService } from "@/services/util.service";

export function GigIndex() {

    const [gigs, setGigs] = useState([])
    const [filterBy, setFilterBy] = useState({topRated: "", basic: "", level1: "", level2: ""})


    useEffect(() => {
        loadGigs()
    }, [filterBy])

    async function loadGigs() {
        try {
            const data = await gigService.query(filterBy)
            setGigs(data)
        } catch (err) {
            console.error('err', err)
        }
    }
    function onSetFilter(filterBy) {
        setFilterBy(filterBy)
    }


    console.log(gigs)
    if (!gigs || !gigs.length) return <div>Loading...</div>

    return (
        <div className="main-layout-index">


            <aside className="side-col left">

            </aside>

            <main>
                <GigFilter filterBy={filterBy} onSetFilter={onSetFilter} />
                <button onClick={() => { utilService.makeRandomGig() }}>Random Gig</button>
                <GigList gigs={gigs} />
            </main>


            <aside className="side-col right">

            </aside>

        </div>

    )

}
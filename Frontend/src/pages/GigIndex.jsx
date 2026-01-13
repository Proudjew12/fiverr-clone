import { GigList } from '@/components/gig/GigList'
import { data, Link } from 'react-router-dom'
import { gigService } from '@/services/leo.service.local.js'
import { useEffect, useState } from 'react'
import { GigFilter } from '@/components/filter/GigFilter.jsx'
import { utilService } from '@/services/util.service'
import { useSearchParams } from 'react-router-dom'

export function GigIndex() {
  const [gigs, setGigs] = useState([])
  const [searchParams,setSearchParams] = useSearchParams()

  const filterBy = {
    txt: searchParams.get('txt') || searchParams.get('q') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    tags: searchParams.getAll('tags') || [],
    topRated: searchParams.get('topRated') === 'true',
    basic: searchParams.get('basic') === 'true',
    level1: searchParams.get('level1') === 'true',
    level2: searchParams.get('level2') === 'true',
  }

  useEffect(() => {
    loadGigs()
  }, [searchParams])

  async function loadGigs() {
    try {
      const data = await gigService.query(filterBy)
      setGigs(data)
    } catch (err) {
      console.error('err', err)
    }
  }

  function onSetFilter(filterUpdate) {
    setSearchParams(prevParams => {
        const newParams = new URLSearchParams(prevParams)
        
        
        for (const field in filterUpdate) {
            const value = filterUpdate[field]
      
            if (value === '' || value === null || value === undefined || value === false) {
                newParams.delete(field)
            } else {
                newParams.set(field, value)
            }
        }
        return newParams
    })
  }

  console.log(gigs)
  if (!gigs || !gigs.length) return <div>Loading...</div>

 

  return (
    <div className="main-layout-index">
      <aside className="side-col left"></aside>

      <main>
        <GigFilter filterBy={filterBy}  onSetFilter={onSetFilter}/>
        <button
          onClick={() => {
            utilService.makeRandomGig()
          }}
        >
          Random Gig
        </button>
        <GigList gigs={gigs} />
      </main>

      <aside className="side-col right"></aside>
    </div>
  )
}

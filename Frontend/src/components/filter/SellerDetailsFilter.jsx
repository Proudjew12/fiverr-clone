import { useSearchParams } from 'react-router-dom'





export function SellerDetailsFilter({ handleChange }) {

  const [searchParams] = useSearchParams()

  return (
    <>
      
        <div className="dropdown-container" onClick={(ev) => ev.stopPropagation()}>

          <h2 className="drop-name">Seller Details</h2>

          <div className="checks-container">
            <label className="check-filter">
              <input type="checkbox" name="topRated" checked={searchParams.get('topRated') === 'true'|| false} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <span style={{ fontWeight: 'bold' }}>Top Rated Seller</span>
            </label>

            <label className="check-filter">
              <input type="checkbox" name="level2" checked={searchParams.get('level2') === 'true'|| false} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <span style={{ fontWeight: 'bold' }}>Level 2</span>
            </label>
          </div>

          <div className="checks-container">

            <label className="check-filter">
              <input type="checkbox" name="level1" checked={searchParams.get('level1') === 'true'|| false} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <span style={{ fontWeight: 'bold' }}>Level 1</span>
            </label>

            <label className="check-filter">
              <input type="checkbox" name="basic" checked={ searchParams.get('basic') === 'true'|| false} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <span style={{ fontWeight: 'bold' }}>New seller</span>
            </label>

          </div>
        </div>
      
    </>
  )
}
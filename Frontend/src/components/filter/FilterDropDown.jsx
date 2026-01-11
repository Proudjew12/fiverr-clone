


export function FilterDropDown({ filterName }) {

  return (

    <>
    {filterName === "Seller details" && (
     <div className="dropdown-container">

      <h2 className="drop-name">{filterName}</h2>

      <div className="checks-container">
        <label className="check-filter">
          <input type="checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
          <span style={{ fontWeight: 'bold' }}>Top Rated Seller</span>
        </label>

        <label className="check-filter">
          <input type="checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
        <span style={{ fontWeight: 'bold' }}>Level 2</span>
        </label>
      </div>

      <div className="checks-container">

        <label className="check-filter">
          <input type="checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
          <span style={{ fontWeight: 'bold' }}>Level 1</span>
        </label>

        <label className="check-filter">
          <input type="checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
          <span style={{ fontWeight: 'bold' }}>New seller</span>
        </label>

      </div>
    </div> 
    )}
    </>
  )
}
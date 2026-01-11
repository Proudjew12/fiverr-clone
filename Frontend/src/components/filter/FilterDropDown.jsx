
export function FilterDropDown({ handleChange, filterName, filterByToEdit }) {



  return (
    <>
      {filterName === "Seller details" && (
        <div className="dropdown-container" onClick={(ev) => ev.stopPropagation()}>

          <h2 className="drop-name">{filterName}</h2>

          <div className="checks-container">
            <label className="check-filter">
              <input type="checkbox" name="topRated" checked={filterByToEdit.topRated || false} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <span style={{ fontWeight: 'bold' }}>Top Rated Seller</span>
            </label>

            <label className="check-filter">
              <input type="checkbox" name="level2" checked={filterByToEdit.level2 || false} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <span style={{ fontWeight: 'bold' }}>Level 2</span>
            </label>
          </div>

          <div className="checks-container">

            <label className="check-filter">
              <input type="checkbox" name="level1" checked={filterByToEdit.level1 || false} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <span style={{ fontWeight: 'bold' }}>Level 1</span>
            </label>

            <label className="check-filter">
              <input type="checkbox" name="basic" checked={filterByToEdit.basic || false} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <span style={{ fontWeight: 'bold' }}>New seller</span>
            </label>

          </div>
        </div>
      )}
    </>
  )
}
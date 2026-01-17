import { useSearchParams } from 'react-router-dom'
import { useState } from 'react';


export function BudgetFilter({ handleChange }) {

    const [searchParams] = useSearchParams()

    const [localPrice, setLocalPrice] = useState(searchParams.get('maxPrice') || '');




    return (
        <div className="filter-budget" onClick={(ev) => ev.stopPropagation()}>

            <div className="input-section">
                <label htmlFor="maxPrice" className="input-label">Up to</label>
                <div className="input-wrapper">
                    <span className="currency-symbol">₪</span>
                    <input
                        type="number"
                        id="maxPrice"
                        name="maxPrice"
                        value={localPrice}
                        onChange={(e) => setLocalPrice(e.target.value)}
                        className="price-input"
                        placeholder=""
                        className="price-input"
                    />
                </div>
            </div>

            <div className="divider"></div>


            <div className="actions-footer">
                <button className="btn-clear" onClick={() => {
                    handleChange({
                        target: {
                            name: 'maxPrice',
                            value: '',
                            type: 'number'
                        }
                    })
                    setLocalPrice(0)
                }}>
                    Clear all
                </button>
                <button className="btn-apply" onClick={() => {

                    handleChange({ target: { name: 'maxPrice', value: localPrice, type: 'number' } })
                }}>
                    Apply
                </button>
            </div>
        </div>
    )
}

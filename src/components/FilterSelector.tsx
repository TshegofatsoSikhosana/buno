import { FilterType } from "@/util/utils";

interface FilterSelectorProps {
    filterType:FilterType
    setFilterType: (value:any)=> void
}
 
function FilterSelector(props: FilterSelectorProps){

    return (  <select className="text-white p-2"
                    style={{borderRadius: '5px', backgroundColor: 'rgb(70, 70, 80,180)'}}
                    value={props.filterType}
                    onChange={(e)=> props.setFilterType(Number(e.target.value))}>
                <option value={-1}>No filter</option>
                <option value={FilterType.STILL_NEED_TO_PAY}>Still need to pay</option>
                <option value={FilterType.UNEXPECTED}>Unexpected</option>
                <option value={FilterType.OVERSPENT}>Overspent</option>
                <option value={FilterType.DISCOUNTED}>Discounted</option>
            </select> );
}
 
export default FilterSelector;
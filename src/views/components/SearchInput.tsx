import { IoSearch } from "react-icons/io5"
import { Dispatch, SetStateAction, SyntheticEvent } from "react"

export type TSetSearch = Dispatch<SetStateAction<string>>|((search:string) => void)

export const SearchInput = ({setSearch}:{setSearch:TSetSearch}) => {

    let searchTimeout:NodeJS.Timeout

    const onSearchInput = (e: SyntheticEvent<HTMLInputElement>) => {
        if(searchTimeout) clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
            const {value} = e.target as HTMLInputElement
            setSearch(value)
        }, 500)
    }

    return (
        <div className="input-group">
            <div className="input-group-text"><IoSearch/></div>
            <input className="form-control bg-white" placeholder="cari..." onInput={onSearchInput} />
        </div>
    )
}
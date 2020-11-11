import React, { useState } from 'react';

type SearchProps = {
	searchQuery: (v:string) => void;
	searchDate: (v:string) => void;
	title: string;
}

const Search: React.FC<SearchProps> = (props: SearchProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchDate, setSearchDate] = useState("");

	const handleSearchQueryInputChanges: ((e:React.ChangeEvent<HTMLInputElement>) => void) = (e) => {
		setSearchQuery(e.target.value);
	}

	const handleSearchDateInputChanges: ((e:React.ChangeEvent<HTMLInputElement>) => void) = (e) => {
		setSearchDate(e.target.value);
	}

	const resetInputField = () => {
		setSearchQuery("");
		setSearchDate("");
	}

	const callSearchQueryFunction: ((e: React.MouseEvent<HTMLInputElement>) => void) = (e) => {
		e.preventDefault();
		props.searchQuery(searchQuery);
		resetInputField();
	}

	const callSearchDateFunction: ((e: React.MouseEvent<HTMLInputElement>) => void) = (e) => {
		e.preventDefault();
		props.searchDate(searchDate);
		resetInputField();
	}

	return (
		<div>
			<div>
			<input type="text" value={searchQuery}
		onChange={handleSearchQueryInputChanges}
			/>
			<input type="submit" value="Query" onClick={callSearchQueryFunction}/>
			</div>

			<div>
			<input type="date" value={searchDate}
		onChange={handleSearchDateInputChanges}
			/>
			<input type="submit" value="AfterDate" onClick={callSearchDateFunction}/>
			</div>
			</div>
	);
}
export default Search;

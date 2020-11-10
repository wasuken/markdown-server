import React, { useState } from 'react';

// 参考元:
// https://www.freecodecamp.org/news/how-to-build-a-movie-search-app-using-react-hooks-24eb72ddfaf7/

type Props = {
	search: (v:string) => void;
	title: string;
}

const Search: React.FC<Props> = (props) => {
	const [searchValue, setSearchValue] = useState("");

	const handleSearchInputChanges: ((e:React.ChangeEvent<HTMLInputElement>) => void) = (e) => {
		setSearchValue(e.target.value);
	}

	const resetInputField = () => {
		setSearchValue("");
	}

	const callSearchFunction: ((e: React.MouseEvent<HTMLInputElement>) => void) = (e) => {
		e.preventDefault();
		props.search(searchValue);
		resetInputField();
	}

	return (
		<div>
			{props.title}:
			<input type="text" value={searchValue}
		onChange={handleSearchInputChanges}
			/>
			<input type="submit" value="検索" onClick={callSearchFunction}/>
			</div>
	);
}

export default Search;

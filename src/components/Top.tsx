import React, { useReducer, useEffect } from "react";
import Search from "./Search"

type InitialStateType = {
	loading: boolean,
	links: Array<string>,
	searchLinks: Array<string>,
	errorMessage: string,
	query: string,
}

const initialState = {
	loading: true,
	links: [],
	searchLinks: [],
	errorMessage: "",
	query: "",
}

type ActionType = {
	type: string,
	query: string,
	error: string,
	payload: Array<string>,
}

const reducer: ((state: InitialStateType, action: ActionType) => InitialStateType) = (state, action) => {
	switch(action.type){
		case "REQUEST":
			return {
				...state,
				loading: true,
				errorMessage: ""
			};
		case "SUCCESS":
			return {
				...state,
				loading: false,
				links: action.payload,
				searchLinks: action.payload
			};
		case "FAILURE":
			return {
				...state,
				loading: false,
				errorMessage: action.error
			};
		case "SEARCH":
			return {
				...state,
				searchLinks: state.links.filter(link => link.indexOf(action.query) >= 0),
				query: action.query,
			}
		default:
			return state;
	}
}


function Top(){
	const [state, dispatch] = useReducer(reducer, initialState);
	useEffect(() => {
		fetch("/api/v1/index")
			.then(response => response.json())
			.then(jsonResponse => {
				if(Array.isArray(jsonResponse)){
					const action: ActionType = {
						type: "SUCCESS",
						query: "",
						error: "",
						payload: jsonResponse,
					}
					dispatch(action);
				}else{
					const action: ActionType = {
						type: "FAILURE",
						query: "",
						error: "JSON Response Not Array.",
						payload: [],
					}
					dispatch(action);
				}
			});
	}, []);

	let { searchLinks, loading, errorMessage } = state;

	const search = ( query: string ) => {
		const action: ActionType = {
			type: "SEARCH",
			error: "",
			query: query,
			payload: [],
		}
		dispatch(action);
	}

	return (
		<div>
			<p>
			<Search search={search} title="title検索" />
			</p>
			{
				loading? ( <p>Loading...</p> )
					:
					( <ul>
						{ searchLinks.map((link, i) => <li key={i}><a href={link}>{link.split('/').slice(4).join('/')}</a></li>) }
						</ul> )
			}
			</div>
	);
}

export default Top;

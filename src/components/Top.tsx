import React, { useReducer, useEffect } from "react";
import Search from "./Search.tsx";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc.js'
dayjs.extend(utc);

type FileType = {
	link: string,
	path: string,
	updated_at: string,
}

type InitialStateType = {
	loading: boolean,
	files: Array<FileType>,
	searchFiles: Array<FileType>,
	errorMessage: string,
	query: string,
}

const initialState = {
	loading: true,
	files: [],
	searchFiles: [],
	errorMessage: "",
	query: "",
}

type ActionType = {
	type: string,
	query: string,
	error: string,
	payload: Array<FileType>,
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
				files: action.payload,
				searchFiles: action.payload
			};
		case "FAILURE":
			return {
				...state,
				loading: false,
				errorMessage: action.error
			};
		case "SEARCH_QUERY":
			return {
				...state,
				searchFiles: state.files.filter(file => file.link.indexOf(action.query) >= 0),
				query: action.query,
			}
		case "SEARCH_DATE":
			const dt = dayjs(action.query);
			return {
				...state,
				searchFiles: state.files.filter(file => dt.isBefore(dayjs(file.updated_at))),
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

	let { searchFiles, loading, errorMessage } = state;

	const searchQuery: ((query:string) => void) = ( query: string ) => {
		const action: ActionType = {
			type: "SEARCH_QUERY",
			error: "",
			query: query,
			payload: [],
		}
		dispatch(action);
	}

	const searchDate: ((query:string) => void) = ( query: string ) => {
		const action: ActionType = {
			type: "SEARCH_DATE",
			error: "",
			query: query,
			payload: [],
		}
		dispatch(action);
	}

	return (
		<div>
			<div>
			<Search searchQuery={searchQuery} searchDate={searchDate} title="title検索" />
			</div>
			<div>
			query: { state.query }
			</div>
			{
				loading? ( <p>Loading...</p> )
					:
					( <ul>
						{ state.searchFiles.map((file, i) => {
							return (
								<li key={i}>
									<a href={file.link}>
									{file.path}({file['updated_at']})
								</a>
									</li>
							)
						}) }
						</ul> )
			}
			</div>
	);
}

export default Top;

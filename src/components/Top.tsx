import React, { useReducer, useEffect } from "react";
import Search from "./Search";
import Content from "./Content";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc.js'
dayjs.extend(utc);

interface FileInterface {
	link: string;
	path: string;
	updated_at: string;
}

type InitialStateType = {
	loading: boolean;
	files: Array<FileInterface>;
	searchFiles: Array<FileInterface>;
	errorMessage: string;
	currentPath: string;
	query: string;
}

const initialState = {
	loading: true,
	files: [],
	searchFiles: [],
	errorMessage: "",
	currentPath: "",
	query: "",
}

type ActionType = {
	type: string;
	orderKey: number;
	query: string;
	error: string;
	payload: Array<FileInterface>;
	currentPath: string;
}

let initialAction = {
	type: "",
	orderKey: 1,
	query: "",
	error: "",
	payload: [],
	currentPath: "",
}

const reducer: ((state: InitialStateType, action: ActionType) => InitialStateType) = (state, action) => {
	let lst: Array<FileInterface> = [];
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
		case "FILES_ORDER_BY_DATE":
			lst = JSON.parse(JSON.stringify(state.files));
			return {
				...state,
				loading: false,
				searchFiles: lst.sort((a, b) => {
					const a_d = dayjs(a.updated_at);
					const b_d = dayjs(b.updated_at);
					if(a_d.isBefore(b_d)){
						return action.orderKey;
					}else if(a_d.isAfter(b_d)){
						return -action.orderKey;
					}else{
						return 0;
					}
				})
			};
		case "FILES_ORDER_BY_NAME":
			lst = JSON.parse(JSON.stringify(state.files));
			return {
				...state,
				loading: false,
				searchFiles: lst.sort((a, b) => -(action.orderKey * a.path.localeCompare(b.path)))
			};
		case "CHANGE_CURRENT_FILEPATH":
			return {
				...state,
				currentPath: action.currentPath,
			};
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
						...initialAction,
						type: "SUCCESS",
						query: "",
						error: "",
						payload: jsonResponse,
					}
					dispatch(action);
				}else{
					const action: ActionType = {
						...initialAction,
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
			...initialAction,
			type: "SEARCH_QUERY",
			error: "",
			query: query,
			payload: [],
		}
		dispatch(action);
	}

	const searchDate: ((query:string) => void) = ( query: string ) => {
		const action: ActionType = {
			...initialAction,
			type: "SEARCH_DATE",
			error: "",
			query: query,
			payload: [],
		}
		dispatch(action);
	}

	const callFilesOrderByDateFunction: ((e: React.MouseEvent<HTMLInputElement>) => void) = (e) => {
		e.preventDefault();
		const action: ActionType = {
			...initialAction,
			type: "FILES_ORDER_BY_DATE",
			error: "",
			query: "",
			payload: [],
		}
		dispatch(action);
	}

	const callFilesOrderByNameFunction: ((e: React.MouseEvent<HTMLInputElement>) => void) = (e) => {
		e.preventDefault();
		const action: ActionType = {
			...initialAction,
			type: "FILES_ORDER_BY_NAME",
			error: "",
			query: "",
			payload: [],
		}
		dispatch(action);
	}

	const radioChangeValue: ((e:React.ChangeEvent<HTMLInputElement>) => void) = (e) => {
		if(e.target.value === "asc"){
			initialAction.orderKey = -1;
		}else{
			initialAction.orderKey = 1;
		}
	}

	const changeCurrentPath: ((path:string) => void) = (path) => {
		const action: ActionType = {
			...initialAction,
			type: "CHANGE_CURRENT_FILEPATH",
			currentPath: path,
		}
		dispatch(action);
	}

	return (
		<div>
			<div style={{width: "100%"}}>
				<div style={{float: "left", width: "20%", height: "90%", overflow: "scroll"}}>
					<div>
						<div>
							<Search searchQuery={searchQuery} searchDate={searchDate} title="title検索" />
							<input className="uk-button-primary"
								   type="submit"
								   value="FilesOrderByDate"
								   onClick={callFilesOrderByDateFunction} />
							<input style={{marginLeft: "10px"}}
								   className="uk-button-danger"
								   type="submit"
								   value="FilesOrderByName"
								   onClick={callFilesOrderByNameFunction} />

							<div onChange={radioChangeValue}>
								<p>
									<input type="radio" id="asc" name="orderKey" value="asc" defaultChecked={initialAction.orderKey !== 1} />
									<label htmlFor="asc">asc</label>
								</p>

								<p>
									<input type="radio" id="desc" name="orderKey" value="desc" defaultChecked={initialAction.orderKey === 1}/>
									<label htmlFor="desc">desc</label>
								</p>
							</div>
						</div>
					</div>
					<div>
						query: { state.query }
					</div>
					{
						loading? ( <p>Loading...</p> )
						:
						( <ul className="uk-list">
							{ state.searchFiles.map((file, i) => {
								  return (
									  <li key={i}>
										  <a href={file.link}>
											  {file.path}({file['updated_at']})
										  </a>
										  <button className="uk-button-primary"
												  onClick={() => changeCurrentPath(file.path)}>
											  Preview
										  </button>
									  </li>
								  )
							}) }
						</ul> )
					}
				</div>
				<div style={{float: "left", width: "70%", height: "90%"}}>
					{state.currentPath ? (<Content path={state.currentPath} />) : (<div></div>)}
				</div>
			</div>
		</div>
	);
}

export default Top;

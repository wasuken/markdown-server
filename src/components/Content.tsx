import React, { useReducer, useEffect } from "react";
import marked from 'marked';

type Props = {
	path: string;
}

type InitialStateType = {
	loading: boolean,
	path: string,
	content: string,
	error: string,
}

const initialState = {
	loading: true,
	path: "",
	content: "",
	error: "",
}

type ActionType = {
	type: string,
	error: string,
	payload: string,
}

const initialAction = {
	type: "",
	error: "",
	payload: "",
}

const reducer: ((state: InitialStateType, action: ActionType) => InitialStateType) = (state, action) => {
	switch(action.type){
		case "REQUEST":
			return {
				...state,
				loading: true,
			}
		case "SUCCESS":
			console.log(action.payload);
			return {
				...state,
				loading: false,
				content: action.payload,
			}
		case "FAILURE":
			return {
				...state,
				loading: false,
				error: action.error,
			}
		default:
			return state;
	}
}

const Content: React.FC<Props> = (props: Props) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	useEffect(() => {
		fetch("/api/v1/content" + props.path)
			.then(response => response.json())
			.then(jsonResponse => {
				if(jsonResponse["content"]){
					const action: ActionType = {
						...initialAction,
						type: "SUCCESS",
						payload: jsonResponse["content"],
					}
					dispatch(action);
				}else{
					const action: ActionType = {
						...initialAction,
						type: "FAILURE",
						error: "JSON Response Unknown Type.",
					}
					dispatch(action);
				}
			});
	}, [props.path]);
	return (
		<div className="markdown-body"
			 style={{float: "left",
					 overflow: "scroll",
					 width: "100%",
					 height: "100%"}}>
			{(state.error? state.error :
			  (<div>
				  <h3>{props.path}</h3>
				  <div>
					  <div dangerouslySetInnerHTML={{
						  __html: marked(state.content)
					  }}></div>
				  </div>
			  </div>))}
		</div>
	);
}

export default Content;

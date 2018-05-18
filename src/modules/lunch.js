import { combineReducers } from 'redux'
import * as api from '../utils/api'

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_PEOPLE = 'FETCH_PEOPLE'
export const ADD_SUCCESS = 'ADD_SUCCESS'
export const ADD_FAILURE = 'ADD_FAILURE'
export const LOADED_PEOPLE = 'LOADED_PEOPLE'
export const DELETE_PERSON = 'DELETE_PERSON'
export const DELETE_FAILURE = 'DELETE_FAILURE'
export const GROUPING_SUCCESS = 'GROUPING_SUCCESS'
export const GROUPING_FAILURE = 'GROUPING_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------
export const addPerson = (name) => async (dispatch) => {
  const res = await api.addPerson(name);
  if(res.status === 201)
    return dispatch(addSuccess(name));
  if(res.status === 202)
    return dispatch(addFailure("already exists"));
  
    addFailure("error");
}
export function addSuccess(name) {
  return { type: ADD_SUCCESS, name }
}

export function addFailure(error) {
  return { type: ADD_FAILURE, error }
}

export const deletePerson = name => async (dispatch) => {
  const res = await api.deletePerson(name);
  if(res.status !== 204) {
    dispatch({ type: DELETE_FAILURE, error: res.error}); 
    return;
  }
  dispatch({ type: DELETE_PERSON, name });
}

export function loadedPeople(people) {
  return { type: LOADED_PEOPLE, people }
}

export const fetchPeople = () => async (dispatch) => {
  const people = await api.fetchPeople();
  dispatch({ type: FETCH_PEOPLE, people });
};

export const groupingPeople = num => async (dispatch) => {
  const res = await api.groupingPeople(num);
  console.log(res);
  if ('error' in res) {
    dispatch(groupingFailure(res.error));
    return;
  }
  dispatch(groupingSuccess(res.people));
}

export function groupingSuccess(people) {
  return { type: GROUPING_SUCCESS, people }
}

export function groupingFailure(error) {
  return { type: GROUPING_FAILURE, error }
}

// ------------------------------------
// Reducer
// ------------------------------------

export const LUNCH_DEFAULT_STATE = {
  saving: false,
  error: '',
  people: []
}

function people(state = LUNCH_DEFAULT_STATE, action) {
  switch (action.type) {
    case FETCH_PEOPLE: {
      return { ...state, people: action.people }
    }
    case ADD_SUCCESS:
      return {
        ...state,
        people: state.people.concat({name: action.name, group: 0}),
        error: ''
      }
    case ADD_FAILURE:
      return { ...state, error: action.error }
    case DELETE_FAILURE:
      return { ...state, error: action.error }
    case DELETE_PERSON:
      return {
        ...state,
        people: state.people.filter(person => person.name !== action.name)
      }
    case GROUPING_SUCCESS:
      return {
        ...state,
        people: action.people,
        error: ''
      }
    case GROUPING_FAILURE:
      return { ...state,  error: action.error }
    default:
      return state
  }
}

const lunchReducer = combineReducers({
  people
})

export const getPeople = state => state.lunch.people

export default lunchReducer

import React, {useState, useReducer, useEffect, useContext} from 'react';
import './App.css';


export const Actions = {
  LOAD_SEATS: 'load_seats',
  SELECT_SEAT: 'select_seat',
  FETCHING: 'fetching',
  FIELD_CHANGE: 'field_change',
  FIELD_ERRORS: 'field_errors',
  ERROR: 'error'
};

export function reducer(state, action) {
  let newState;
  function selected_seats(newState) {
    newState.seats_selected = [];
      for(let i in newState.rows) {
        let r = newState.rows[i];
        for(let j in r) {
          if(r[j].selected) {
            newState.seats_selected.push(r[j].number);
          }
        }
      }
  }
  switch(action.type) {
    case Actions.SELECT_SEAT:
      newState = cloneState(state);
      newState.rows[action.row][action.col].selected = !newState.rows[action.row][action.col].selected;
      newState.error = null;
      selected_seats(newState);
      return newState;
    case Actions.LOAD_SEATS:
      newState = {...state, rows: action.rows, isLoading: false, error: null};
      selected_seats(newState);
      // console.trace(newState);
      return newState;
    case Actions.FETCHING:
      return {...state, isLoading: true};
    case Actions.FIELD_CHANGE:
      newState = cloneState(state);
      newState.fields = {...state.fields};
      newState.fields[action.field] = {
        value: action.value, error: null
      };
      return newState;
    case Actions.ERROR:
      newState = {...state, error: action.error, isLoading: false};
      return newState;
    case Actions.FIELD_ERRORS:
      newState = {...state, isLoading: false};
      newState.fields = {...state.fields};
      newState.fields[action.field] = {
        ...newState.fields[action.field], error: action.error
      };
      return newState;
    default:
      throw new Error();
  }
}
export const initialState = {
  rows: [],
  seats_selected: [],
  isLoading: false,
  isError: false,
  fields: {
    first_name: {
      value: '', error: ''
    },
    last_name: {
      value: '', error: ''
    },
    phone: {
      value: '', error: ''
    },
    email: {
      value: '', error: ''
    }
  },
  error: null
};

function cloneState(state) {
  return {...state, rows: state.rows.map(x => [...x].map(e => { return {...e} }))}
}

export const Dispatch = React.createContext(null);
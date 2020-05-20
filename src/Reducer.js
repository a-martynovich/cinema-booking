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
      newState = {...cloneState(state), error: null, success: null};
      newState.rows[action.row][action.col].selected = !newState.rows[action.row][action.col].selected;
      newState.error = null;
      selected_seats(newState);
      return newState;
    case Actions.LOAD_SEATS:
      newState = {...state, rows: action.rows, isLoading: false};
      if(action.fields)
        newState.fields = action.fields;
      selected_seats(newState);
      newState.have_booking = !!action.fields;
      newState.have_booked_seat = newState.seats_selected.length > 0 && newState.have_booking;
      newState.booked_seats = [...newState.seats_selected];
      // console.trace(newState);
      return newState;
    case Actions.FETCHING:
      return {...state, isLoading: true, error: null, success: null};
    case Actions.FIELD_CHANGE:
      newState = {...state, error: null, success: null};
      newState.fields = {...state.fields};
      newState.fields[action.field] = action.value;
      return newState;
    case Actions.ERROR:
      newState = {...state, error: action.error, field_errors: action.field_errors, isLoading: false};
      if(!action.error && !action.field_errors)
        newState.success = true;
      return newState;
    default:
      throw new Error();
  }
}
export const initialState = {
  rows: [],
  seats_selected: [],
  booked_seats: [],
  isLoading: false,
  isError: false,
  fields: {
    first_name: '',
    last_name: '',
    phone: '',
    email: ''
  },
  field_errors: null,
  error: null,
  have_booking: false,
  have_booked_seat: false
};

function cloneState(state) {
  return {...state, rows: state.rows.map(x => [...x].map(e => { return {...e} }))}
}

export const Dispatch = React.createContext(null);
import React, {useState, useReducer, useEffect, useContext} from 'react';
import './App.css';


export const Actions = {
  SET_SEAT_SELECTION: 'set_seat_selection',
  LOAD_SEATS: 'load_seats',
  SELECT_SEAT: 'select_seat',
  FETCHING: 'fetching'
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
    case Actions.SET_SEAT_SELECTION:
      newState = cloneState(state);
      newState.rows[action.row][action.col].selected = action.selection;
      return newState;
    case Actions.SELECT_SEAT:
      newState = cloneState(state);
      newState.rows[action.row][action.col].selected = !newState.rows[action.row][action.col].selected;
      selected_seats(newState);
      return newState;
    case Actions.LOAD_SEATS:
      newState = {...initialState, rows: action.rows, isLoading: false};
      selected_seats(newState);
      console.trace(newState);
      return newState;
    case Actions.FETCHING:
      return {...state, isLoading: true};
    default:
      throw new Error();
  }
}
export const initialState = {
  rows: [],
  seats_selected: [],
  isLoading: false,
  isError: false
};

function cloneState(state) {
  return {...state, rows: state.rows.map(x => [...x].map(e => { return {...e} }))}
}

export const Dispatch = React.createContext(null);
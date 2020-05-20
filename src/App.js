import React, {useState, useReducer, useEffect, useContext, useRef} from 'react';
import {render} from "react-dom";
import {Actions, reducer, initialState, Dispatch} from './Reducer'
import {ButtonGrid} from "./ButtonGrid";
import {Form} from "./Form"
import './App.css';


const URL = '/booking/';

function arrays_equal(a, b) {
  return !!a && !!b && !(a<b || b<a);
}

function Alert(props) {
  const [state, dispatch] = useContext(Dispatch);

  const text = state.success? "Success": state.error;
  const visible = state.error || state.success? "": "d-none";
  let color;
  if(state.error)
    color = "danger";
  else if(state.success)
    color = "success";
  else
    color="secondary";
  return (
      <div className={`alert alert-${color} text-center ${visible}`} role="alert">
        {text}
      </div>
  )
}

function BookButton(props) {
  const [state, dispatch] = useContext(Dispatch);
  const isDisabled = (!state.have_booked_seat && !state.seats_selected.length) ||
      state.isLoading ||
      arrays_equal(state.seats_selected, state.booked_seats);
  const text = (state.have_booked_seat && !state.seats_selected.length)? "Unbook": "Book";
  return (
      <button type="button" className="btn btn-primary btn-lg"
              disabled={isDisabled} onClick={props.onSubmit}>
        {text}
      </button>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadSeats = async () => {
      try {
        let res = await fetch(URL);
        if(res.status != 200)
          throw new Error(`HTTP error: ${res.statusText}`);
        let json = await res.json();
        console.log(json);
        let rows = json.rows, fields = json.booking;
        dispatch({type: Actions.LOAD_SEATS, rows, fields});
      } catch (e) {
        dispatch({type: Actions.ERROR, error: e.message});
      }
  };

  const submit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const data = {
      book_seats: state.seats_selected
    };
    if(state.seats_selected.length)
      data.booking = state.fields;
    console.log('SUBMIT', data);

    dispatch({type: Actions.FETCHING });
    console.log(state.fields);

    let json;
    try {
      let res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if(res.status != 200)
        throw new Error(`HTTP error: ${res.statusText}`);
      json = await res.json();
      console.log(json);
    } catch(e) {
      dispatch({type: Actions.ERROR, error: e.message});
      return;
    }

    dispatch({
      type: Actions.ERROR,
      error: json.error || null,
      field_errors: json.field_errors? json.field_errors.booking: null
    });
    if(json.rows && !json.field_errors)
      dispatch({type: Actions.LOAD_SEATS, rows: json.rows, fields: json.booking});
  };

  useEffect(() => {
    loadSeats();
  }, []);

  let seat_selection = state.seats_selected.length? `Seats selected: ${state.seats_selected.join(', ')}`: "Select your seats";
  return (
    <Dispatch.Provider value={[state, dispatch]}>
      <div className="cotainer">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card bg-light shadow p-3 mb-5 bg-white rounded">
              <div className="card-body">
                <h5 className="card-title text-center">The Booking System</h5>
                <hr />

                <ButtonGrid/>
                <h6 className="card-subtitle mt-2 text-muted">{seat_selection}</h6>

                <hr />

                <Form onSubmit={submit} />

                <hr />

                <div className="d-flex flex-nowrap">
                  <div className="flex-shrink-1">
                    <BookButton onSubmit={submit}/>
                  </div>
                  <div className="ml-1 w-100">
                    <Alert text={state.error} color="danger" visible={state.error !== null}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dispatch.Provider>
  );
}

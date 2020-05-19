import React, {useState, useReducer, useEffect, useContext, useRef} from 'react';
import {render} from "react-dom";
import {Actions, reducer, initialState, Dispatch} from './Reducer'
import {ButtonGrid} from "./ButtonGrid";
import {Form} from "./Form"
import './App.css';


const URL = 'http://localhost:8000/booking/';

function Alert(props) {
  return (
      <div className={`alert alert-${props.color} text-center ${props.visible? "": "d-none"}`} role="alert">
        {props.text}
      </div>
  )
}

function BookButton(props) {
  const [state, dispatch] = useContext(Dispatch);

  return (
      <button type="button" className="btn btn-primary btn-lg"
              disabled={!state.seats_selected.length} onClick={props.onSubmit}>
        Book
      </button>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const formRef = useRef(null);

  const loadSeats = async () => {
    let rows = [];
      try {
        let res = await fetch(URL);
        let json = await res.json();
        // console.log(json.rows);
        rows = json.rows;
        dispatch({type: Actions.LOAD_SEATS, rows});
      } catch (e) {
        dispatch({type: Actions.ERROR, e});
      }
  };

  const submit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('SUBMIT');

    dispatch({type: Actions.FETCHING });
    console.log(state.fields);

    let res = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        book_seats: state.seats_selected,
        booking: state.fields
      })
    });
    let json = await res.json();
    console.log(json);
    if(json.field_errors) {
      dispatch({type: Actions.FIELD_ERRORS, errors: json.field_errors});
      dispatch({type: Actions.ERROR, error: 'FIELD ERROR'})
    } else if(json.error) {
      dispatch({type: Actions.ERROR, error: json.error})
    } else {
      dispatch({type: Actions.LOAD_SEATS, rows: json.rows});
    }
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

                <form onSubmit={submit} action="">
                  <Form />
                  <input type="submit" style={{display: 'none'}}/>
                </form>

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

import React, {useState, useReducer, useEffect, useContext} from 'react';
import {render} from "react-dom";
import {Actions, reducer, initialState, Dispatch} from './Reducer'
import {ButtonGrid} from "./ButtonGrid";
import './App.css';


function FormField(props) {
  const [state, dispatch] = useContext(Dispatch);

  let feedback_style, input_class;
  if(props.valid === true) {
    feedback_style = "valid-feedback";
    input_class = "is-valid";
  } else if(props.valid === false) {
    feedback_style = "invalid-feedback";
    input_class = "is-invalid";
  } else {
    feedback_style = "d-none";
    input_class = "";
  }
  return (
      <div className="form-group col-md-6">
        <label htmlFor={props.id}>{props.label}</label>
        <input type={props.type || "text"} className={`form-control ${input_class}`} placeholder={props.placeholder} id={props.id}/>
        <div className={feedback_style}>
          {props.feedback}
        </div>
      </div>
  )
}

function Form(props) {
  const [state, dispatch] = useContext(Dispatch);
  const blurred = !state.seats_selected.length || state.isLoading;

  return (
      <form>
        <fieldset disabled={blurred} style={ {filter: blurred? 'blur(1px)': 'none'} }>
        <div className="form-row">
          <FormField id="firstname" label="First Name" placeholder="First name" feedback="all ok" valid={true}/>
          <FormField id="lastname" label="Last Name" placeholder="Last name" feedback="not ok" valid={false}/>
        </div>
        <div className="form-row">
          <FormField id="email" label="E-Mail" placeholder="E-mail" />
          <FormField id="phone" label="Phone No." placeholder="+1" />
        </div>
        </fieldset>
      </form>
  )
}

function Alert(props) {
  return (
      <div className={`alert alert-${props.color} text-center ${props.visible? "": "d-none"}`} role="alert">
        {props.text}
      </div>
  )
}

function BookButton(props) {
  const [state, dispatch] = useContext(Dispatch);

  async function onClick() {
      dispatch({type: Actions.FETCHING });

      let res = await fetch('http://localhost:3000/rows');
      let json = await res.json();
      const rows = json;
      console.log(rows);

      dispatch({type: Actions.LOAD_SEATS, rows});
  }
  return (
      <button type="submit" className="btn btn-primary btn-lg"
              disabled={!state.seats_selected.length} onClick={onClick}>
        Book
      </button>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function loadSeats() {
      let res = await fetch('http://localhost:3000/rows');
      let json = await res.json();
      const rows = json;
      console.log(rows);

      dispatch({type: Actions.LOAD_SEATS, rows});
  }

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

                <Form disabled={false}/>

                <hr />
                <div className="d-flex flex-nowrap">
                  <div className="flex-shrink-1">
                    <BookButton/>
                  </div>
                  <div className="ml-1 w-100">
                    <Alert text="Welcome" color="danger" visible={false}/>
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

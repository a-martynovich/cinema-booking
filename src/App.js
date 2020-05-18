import React, {useState, useReducer} from 'react';
import logo from './logo.svg';
import './App.css';

function reducer(state, action) {
  switch(action.type) {

  }
}
const Actions = {
  SELECT_SEAT: 'select_seat',
};
const initialState = {

};

function Button(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // let {number, setNumber} = useState(0);
  const color = props.available? "light": "secondary";
  return (
      <button type="button" className={`btn btn-${color} rounded-0 border-secondary col text-nowrap`}
      onClick={(e) => props.onClick(e, this)}>
        {props.available? props.number: ""}
      </button>
  )
}

function ButtonRow(props) {
  return (
      <>
        {props.numbers.map(v => <Button number={v.number} available={v.available} onClick={(e, b) => props.onSelect(e, b)}/>)}
        <div className="w-100"></div>
      </>
  )
}

function FormField(props) {
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
  return (
      <form>
        <fieldset disabled={props.disabled} style={ {filter: props.disabled? 'blur(1px)': 'none'} }>
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

function App() {
  function onSeatSelect(e, b) {
    console.log(e, b);
  }

  const rc = 5, sc = 5;
  let rows = [...Array(rc).keys()].map(
      r => [...Array(sc).keys()].map(
          i => {return {number: sc*r+i+1, available: true}}
      )
  );
  rows[0][0].available = false;
  rows[1][1].available = false;
  console.log(rows);

  return (
      <div className="cotainer">
        <div className="row justify-content-center">

          <div className="col-md-6">
            <div className="card bg-light shadow p-3 mb-5 bg-white rounded">
              <div className="card-body">
                <h5 className="card-title text-center">The Booking System</h5>
                <hr />

                <h6 className="card-subtitle mb-2 text-muted">Select your seat</h6>
                {/*<hr />*/}

                <div className="row mr-0 ml-0">
                  {rows.map((v, i) => <ButtonRow numbers={v} onSelect={onSeatSelect}/>)}
                </div>


                <hr />

                <Form disabled={false}/>

                <hr />
                <div className="d-flex flex-nowrap">
                  <div className="flex-shrink-1">
                    <button type="submit" className="btn btn-primary btn-lg">Book</button>
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
  );
}

export default App;

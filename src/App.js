import React, {useState, useReducer, useEffect, useContext} from 'react';
import logo from './logo.svg';
import './App.css';

const Actions = {
  SET_SEAT_SELECTION: 'set_seat_selection',
  LOAD_SEATS: 'load_seats',
  SELECT_SEAT: 'select_seat'
};

function reducer(state, action) {
  let newState;
  switch(action.type) {
    case Actions.SET_SEAT_SELECTION:
      newState = cloneState(state);
      newState.rows[action.row][action.col].selected = action.selection;
      // console.trace(action, state, action.selection);
      return newState;
    case Actions.SELECT_SEAT:
      newState = cloneState(state);
      newState.rows[action.row][action.col].selected = !newState.rows[action.row][action.col].selected;

      newState.seats_selected = [];
      for(let i in newState.rows) {
        let r = newState.rows[i];
        for(let j in r) {
          if(r[j].selected) {
            newState.seats_selected.push(r[j].number);
          }
        }
      }
      console.trace(action, state, newState.rows[action.row][action.col].selected);
      // console.trace(action, state, newState.selected);
      return newState;
    case Actions.LOAD_SEATS:
      newState = {...initialState, rows: action.rows}
      console.trace(newState);
      return newState;
    default:
      throw new Error();
  }
}
const initialState = {
  rows: [],
  seats_selected: []
};

function cloneState(state) {
  return {...state, rows: state.rows.map(x => [...x].map(e => { return {...e} }))}
}

function Button(props) {
  const [state, dispatch] = useContext(Dispatch);
  let myState = state.rows.length? state.rows[props.row][props.col]: {};

  function onSelect(e) {
    console.log(e);
    // e.preventDefault();
    // e.stopPropagation();
    dispatch({
      type: Actions.SELECT_SEAT,
      row: props.row,
      col: props.col
    });
    e.target.blur();
  }
  // console.log(state);
  const color = myState.available? "light": "secondary";
  const active = myState.selected? "active": "";
  return (
      <button type="button"
              style={{pointerEvents: myState.available? "unset": "none"}}
              className={`btn btn-${color} ${active} rounded-0 border-secondary col text-nowrap`}
      onClick={onSelect}>
        {myState.available? props.number: ""}
      </button>
  )
}

function ButtonRow(props) {
  const [state, dispatch] = useContext(Dispatch);

  useEffect(() => {
    console.log(state);
  });
  return (
      <>
        {props.numbers.map((v, i) => <Button number={v.number} row={props.row} col={i} key={`${props.row}:${i}`}
                                             onClick={(e, b) => props.onSelect(e, b)}/>)}
        <div className="w-100"></div>
      </>
  )
}

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

  return (
      <form>
        <fieldset disabled={!state.seats_selected.length} style={ {filter: !state.seats_selected.length? 'blur(1px)': 'none'} }>
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

  return (
      <button type="submit" className="btn btn-primary btn-lg" disabled={!state.seats_selected.length}>
        Book
      </button>
  )
}

const Dispatch = React.createContext(null);

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function onSeatSelect(e, b) {
    console.log(e, b);
  }

  function execute() {
    loadSeats();
  }

  function toggle() {
    dispatch({type: Actions.SELECT_SEAT, row: 1, col: 1});
  }

  function loadSeats() {
    const rc = 5, sc = 5;
    let rows = [...Array(rc).keys()].map(
      r => [...Array(sc).keys()].map(
          i => {return {number: sc*r+i+1, available: true}}
      )
    );
    rows[0][0].available = false;
    rows[1][1].available = false;
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

                <div className="row mr-0 ml-0">
                  {state.rows.map((v, i) => <ButtonRow numbers={v} row={i} key={i}/>)}
                </div>
                <h6 className="card-subtitle mt-2 text-muted">{seat_selection}</h6>


                <hr />

                <Form disabled={false}/>

                <hr />
                <div className="d-flex flex-nowrap">
                  <div className="flex-shrink-1">
                    <BookButton/>
                    {/*<button type="submit" className="btn btn-primary btn-lg" onClick={toggle}>Book</button>*/}
                    {/*<button type="button" className="btn btn-primary btn-lg" onClick={execute}>Test</button>*/}
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



function myReducer(state, action) {
  switch(action.type) {
    case 'my':
      console.log(action, state);
      return {selected: !state.selected};
  }
}
function App1() {
  const [state, dispatch] = useReducer(myReducer, {});

  return (
      <button type="button" onClick={() => dispatch({type: 'my'})}>Test</button>
  )
}

export default App;

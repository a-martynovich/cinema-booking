import React, {useContext} from "react";
import {Actions, Dispatch} from "./Reducer";


function FormField(props) {
  const [state, dispatch] = useContext(Dispatch);
  const onChange = (e) => {
    dispatch({type: Actions.FIELD_CHANGE, field: props.id, value: e.target.value})
  };

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
        <input type={props.type || "text"} className={`form-control ${input_class}`}
               placeholder={props.placeholder} id={props.id}
               onChange={onChange} value={state.fields[props.id].value}/>
        <div className={feedback_style}>
          {props.feedback}
        </div>
      </div>
  )
}

export function Form(props) {
  const [state, dispatch] = useContext(Dispatch);
  const blurred = !state.seats_selected.length || state.isLoading;

  return (
      <fieldset disabled={blurred} style={ {filter: blurred? 'blur(1px)': 'none'} }>
        <div className="form-row">
          <FormField id="first_name" label="First Name" placeholder="First name" feedback="all ok" valid={true}/>
          <FormField id="last_name" label="Last Name" placeholder="Last name" feedback="not ok" valid={false}/>
        </div>
        <div className="form-row">
          <FormField id="email" label="E-Mail" placeholder="E-mail" />
          <FormField id="phone" label="Phone No." placeholder="+1" />
        </div>
      </fieldset>
  )
}
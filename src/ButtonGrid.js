import React, {useContext, useEffect} from "react";
import {Actions, Dispatch} from './Reducer'


function Button(props) {
  const [state, dispatch] = useContext(Dispatch);
  let myState = state.rows.length? state.rows[props.row][props.col]: {};

  function onSelect(e) {
    console.log(e);
    dispatch({
      type: Actions.SELECT_SEAT,
      row: props.row,
      col: props.col
    });
    e.target.blur();
  }
  const active = myState.selected? "active": "";
  const color = myState.available? "light": "secondary";
  const text_color = myState.available? "": "text-secondary";
  return (
      <button type="button"
              style={{pointerEvents: myState.available? "unset": "none"}}
              className={`btn btn-${color} ${active} rounded-0 border-secondary col text-nowrap ${text_color}`}
      onClick={onSelect}>
        {myState.available? props.number: "x"}
      </button>
  )
}

function ButtonRow(props) {
  const [state, dispatch] = useContext(Dispatch);

  useEffect(() => {
    // console.log(state);
  });
  return (
      <>
        {props.numbers.map((v, i) => <Button number={v.number} row={props.row} col={i} key={`${props.row}:${i}`}
                                             onClick={(e, b) => props.onSelect(e, b)}/>)}
        <div className="w-100"></div>
      </>
  )
}

export function ButtonGrid(props) {
  const [state, dispatch] = useContext(Dispatch);

  return (
      <div className="row mr-0 ml-0" style={ {
        filter: state.isLoading? 'blur(1px)': 'none',
        pointerEvents: state.isLoading? 'none': 'unset'
      } }>
        {state.rows.map((v, i) => <ButtonRow numbers={v} row={i} key={i}/>)}
      </div>
  )
}
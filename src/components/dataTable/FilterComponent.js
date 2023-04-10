import React from "react";
import styled from "styled-components";
import './inputSearch.css'

// const Input = styled.input.attrs(props => ({
//   type: "text",
//   size: props.small ? 5 : undefined
// }))`
//   height: 32px;
//   width: 200px;
//   border-radius: 3px;
//   border-top-left-radius: 5px;
//   border-bottom-left-radius: 5px;
//   border-top-right-radius: 0;
//   border-bottom-right-radius: 0;
//   border: 1px solid #e5e5e5;
//   padding: 0 32px 0 16px;
// `;

// const ClearButton = styled.button`
//   border-top-left-radius: 0;
//   border-bottom-left-radius: 0;
//   border-top-right-radius: 5px;
//   border-bottom-right-radius: 5px;
//   height: 34px;
//   width: 32px;
//   text-align: center;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;


const FilterComponent = (props) => (
      <>
     {/* <input
      id="search"
      type="text"
      placeholder="Filter table data..."
      value={props.filterText}
      onChange={props.onFilter}
    />
    <ClearButton onClick={props.onClear}>X</ClearButton> */}
   
    <form className="input-search" >
      <input type="text" required   id="search"  placeholder="Filter table data..." value={props.filterText}  onChange={props.onFilter}  />
      <i className="fa fa-search icons-serch"></i>
   </form>
  </>
 
);

export default FilterComponent;

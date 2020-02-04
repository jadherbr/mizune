import React, { Component } from 'react';
import MizuneMasterPage from '../../../components/Mizune/MasterPage';

export default class Inicial extends Component {
  state = {
    loading: false,
    config: [], 
  }

  PaginationHandleClick(e) {    
    alert(e);    
  }

  render() {

    return (
      <>
        <MizuneMasterPage tituloCabecalho='titulo inicial'>

        asdasdasd
          
        </MizuneMasterPage>
      </>

    );
  }
}
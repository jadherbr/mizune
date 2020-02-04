import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarST from '../studiotaurus/NavbarST';
//import Cabecalho from '../../components/Cabecalho/Cabecalho';
import Footer from '../studiotaurus/Footer';

var style = {
  'maxWidth': 960,
  'marginRight': 'auto',
  'marginLeft': 'auto',
  'lineHeight': '1'
}

const MasterPage = (props) => {
  return (
    <>
      <NavbarST />
      <div style={style}>
        {props.children}
      </div>
      <Footer />
    </>
  )
}

export default MasterPage
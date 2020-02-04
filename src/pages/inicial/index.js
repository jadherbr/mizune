import React, { Component } from 'react';
import api, { baseURLAPI } from '../../services/api';
import MasterPage from '../../components/MasterPage';
import ReactFBLike from 'react-fb-like';
import IndexAtividades from '../../components/studiotaurus/IndexAtividades/'
import IndexMaterias from '../../components/studiotaurus/IndexMaterias/'
import IndexVideos from '../../components/studiotaurus/IndexVideos/'
import IndexParceiros from '../../components/studiotaurus/IndexParceiros/'
import { Spinner, Card, Row, Col, Container } from 'react-bootstrap';

import './style.css';

export default class Inicial extends Component {
  state = {
    loading: false,
    config: [], 
  }

  componentDidMount() {
   /*  console.log(process.env);
    this.setState({ loading: true }, () => {
      api.get('/indexconfig')
        .then(result => this.setState({
          loading: false,
          config: result.data,
        }))
        .catch(err => {
          this.setState({ loading: false });
          console.log('Erro ao acessar a API: ' + err);
        });
    });
    this.FB = window.FB;
    console.log(this.FB); */
  }


  render() {

    return (
      <>
        <MasterPage tituloCabecalho='titulo inicial'>

          
        </MasterPage>
      </>

    );
  }
}
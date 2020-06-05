import React, { Component } from 'react';
import MizuneMasterPage from '../../components/Mizune/MasterPage';
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
        <MizuneMasterPage>

          
        </MizuneMasterPage>
      </>

    );
  }
}
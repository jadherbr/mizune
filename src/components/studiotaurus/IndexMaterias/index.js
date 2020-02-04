import React, { Component } from 'react';
import api, { baseURLAPI } from '../../../services/api';
import { Spinner } from 'react-bootstrap';
import './styles.css';

export default class IndexMaterias extends Component {

  state = {
    loading: false,
    materias: [],
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      api.get('/materiasindex')
        .then(result => this.setState({
          loading: false,
          materias: [...result.data],
        }));
    });
  }

  render() {
    return (
      <>
        <div className="materias-area box-shadow">

            <div className="cabecalho-de-sessao">
              <a href="/todasmaterias" className="titulo">
                <h5>Últimas matérias</h5>
              </a>
            </div>

            {this.state.loading ? <Spinner animation="border" /> :
              this.state.materias.map((materia, k) =>

                <div key={k} className="single-materia d-flex">
                  <div >
                    <img className="imagem" src={baseURLAPI + '/' + materia.imagem} alt="" />
                  </div>
                  <div className="content">
                    <a href={`/materia/${materia.id}`} className="titulo">
                      {materia.titulo}
                    </a>
                    <div className="manchete d-flex justify-content-between">
                      <p>
                        {materia.manchete}
                      </p>
                    </div>
                  </div>
                </div>
              )}
          
        </div>
      </>
    )
  }
}
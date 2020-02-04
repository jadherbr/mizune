import React, { Component } from 'react';
import api, { baseURLAPI } from '../../../services/api';
import { Carousel, Spinner } from 'react-bootstrap';
import './styles.css';

export default class IndexAtividades extends Component {

  state = {
    loading: false,
    atividades: [],
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      api.get('/atividadessindex')
        .then(result => this.setState({
          loading: false,
          atividades: [...result.data],
        }));
    });
  }

  render() {
    return (
      <>
        <div className="atividades-content box-shadow">

          <div className="cabecalho-de-sessao">
            <a href="/atividades/vertodas" className="titulo">
              <h5>Atividades</h5>
            </a>
          </div>
          <Carousel nextLabel="Próximo" prevLabel="Anterior">
            {this.state.loading ? <Spinner animation="border" /> :
              this.state.atividades.map((atividade, k) =>
                <Carousel.Item key={k}>
                  <img
                    className="imgCarousel d-block"
                    src={baseURLAPI + '/' + atividade.imagem}
                    alt=""
                  />
                  <Carousel.Caption>
                    <a href={`/saibamais/${atividade.id}`}>
                      <h3 className="atividadeTitulo">
                        {atividade.titulo}
                      </h3>
                    </a>
                    <a href={`/saibamais/${atividade.id}`} className="atividadeDesc">
                      {atividade.descricao.substr(0, 50)}
                    </a>
                  </Carousel.Caption>
                </Carousel.Item>
              )}
          </Carousel>
        </div>

      </>
    )
  }
}
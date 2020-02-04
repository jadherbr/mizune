import React, { Component } from 'react';
import api, { baseURLAPI } from '../../../services/api';
import { Spinner, Card, Row, Col } from 'react-bootstrap';
import './styles.css';

export default class IndexParceiros extends Component {

  state = {
    loading: false,
    parceiros: [],
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      api.get('/parceirosindex')
        .then(result => this.setState({
          loading: false,
          parceiros: [...result.data],
        }));
    });
  }

  render() {

    return (
      <>
        <div className="parceiro-area box-shadow">

          <div className="cabecalho-de-sessao d-flex justify-content-between">
            <a href="/parceiros/vertodos">
              <h5>Parceiros</h5>
            </a>
            <a href="/parceiros/vertodos" className="parceiro-vertodos">
              Ver todos >
              </a>
          </div>

          <Row>
            {this.state.loading ? <Spinner animation="border" /> :
              this.state.parceiros.map((parceiro, k) =>
                <Col key={k} className="col-lg-3">
                  <Card className="h-100">
                    <a href={`/sobreparceiro/${parceiro.id}`}>
                      <Card.Img variant="top" src={baseURLAPI + '/' + parceiro.imagem} />
                    </a>
                    <Card.Body>
                      <Card.Title className="text-center">
                        <a href={`/sobreparceiro/${parceiro.id}`}>
                          <span className="parceiro-titulo">
                            {parceiro.nome}
                          </span>
                        </a>
                      </Card.Title>
                      <Card.Text>
                        <a href={`/sobreparceiro/${parceiro.id}`}>
                          <span className="parceiro-descricao">
                            End.: {parceiro.endereco}&nbsp;
                            Tel.: {parceiro.telefone}
                          </span>
                        </a>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              )}
          </Row>

        </div>
      </>
    );
  }
}
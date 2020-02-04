import React from 'react';
import api, { baseURLAPI } from '../../services/api';
import FrmPadrao from '../../padrao/frmPadrao';
import MasterPage from '../../components/MasterPage';
import { Card, Breadcrumb, Row, Spinner } from 'react-bootstrap';

export default class ParceirosVerTodos extends FrmPadrao {

  state = {
    loading: false,
    parceiros: [],
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      api.get('/todosparceiros')
        .then(result => this.setState({
          loading: false,
          parceiros: result.data,
        }));
    });
  }

  render() {

    return (
      <MasterPage tituloCabecalho='titulo inicial'>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Início</Breadcrumb.Item>
          <Breadcrumb.Item active>Parceiros</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Card.Body>
            {this.state.parceiros.length === 0 ? 'Nenhuma parceiro cadastrado' : null}
            <Row>
              {this.state.loading ? <Spinner animation="border" /> :
                this.state.parceiros.map((parceiro, k) =>
                  <div key={k} className="col-lg-3 col-md-6 mb-4">
                    <Card className="h-100">
                      <a href={`/sobreparceiro/${parceiro.id}`}>
                        <Card.Img variant="top" src={baseURLAPI + '/' + parceiro.imagem} />
                      </a>
                      <Card.Body className="text-center">
                        <Card.Title>
                          <h5>
                            {parceiro.id} - {parceiro.nome}
                          </h5>
                        </Card.Title>
                        <Card.Text className="text-left">
                          {parceiro.endereco}
                          {parceiro.telefone}
                        </Card.Text>
                      </Card.Body>
                    </Card>

                  </div>
                )
              }
            </Row>

          </Card.Body>
        </Card>
      </MasterPage>
    )
  }
}
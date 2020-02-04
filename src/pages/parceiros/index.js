import React from 'react';
import api, { baseURLAPI } from '../../services/api';
import MasterPage from '../../components/MasterPage';
import FrmPadrao from '../../padrao/frmPadrao';
import { Spinner, Card, Row, Button, Breadcrumb } from 'react-bootstrap';
import { Form, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';

class ParceirosIndex extends FrmPadrao {

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

  doConfirm(id) {
    this.setState({ loading: true });
    try {
      api.delete(`/excluirparceiro/${id}`)
        .then(result => {
          let tmp = this.state.parceiros.filter(function (e) {
            return e.id !== id;
          });
          this.setState({ parceiros: tmp });
        }
        );
    } finally {
      this.setState({ loading: false });
    }
  }


  render() {

    return (
      <MasterPage tituloCabecalho='titulo inicial'>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Início</Breadcrumb.Item>
          <Breadcrumb.Item active>Parceiros</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Card.Header>
            <Link to={'/admin/parceiros/cadastrar'}>
              <Button>Cadastrar Parceiro</Button>
            </Link>
          </Card.Header>
          <Card.Body>
            {this.state.parceiros.length === 0 ? 'Nenhuma parceiro cadastrado' : null}
            <Row>
              {this.state.loading ? <Spinner animation="border" /> :
                this.state.parceiros.map((parceiro, k) =>
                  <div key={k} className="col-lg-3 col-md-6 mb-4">
                    <Card className="h-100">
                      {parceiro.imagem ? <Card.Img variant="top" src={baseURLAPI + '/' + parceiro.imagem} /> : ''}
                      
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
                      <Card.Footer className="text-center">
                        <Button variant="outline-info"
                          href={`/admin/parceiros/alterar/${parceiro.id}`} >
                          Alt.
                        </Button>

                        <Popconfirm
                          title="Confirma a exclusão deste parceiro?"
                          onConfirm={() => { this.doConfirm(parceiro.id); }}
                          okText="Sim"
                          cancelText="Não">
                          <Button variant="outline-danger" href="#">
                            Del.
                          </Button>
                        </Popconfirm>

                      </Card.Footer>
                    </Card>
                  </div>
                )
              }
            </Row>
          </Card.Body>
        </Card>      
      </MasterPage>
    );
  }
}

export default Form.create()(ParceirosIndex);
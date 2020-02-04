import React from 'react';
import api, { baseURLAPI } from '../../services/api';
import MasterPage from '../../components/MasterPage';
import FrmPadrao from '../../padrao/frmPadrao';
import { Spinner, Card, Row, Button, Breadcrumb } from 'react-bootstrap';
import { Form, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';



class AtividadesIndex extends FrmPadrao {

  state = {
    loading: false,
    atividades: [],
  }

  doConfirm(id) {
    this.setState({ loading: true });
    try {
      api.delete(`/excluiratividade/${id}`)
        .then(result => {
          let tmp = this.state.atividades.filter(function (e) {
            return e.id !== id;
          });
          this.setState({ atividades: tmp });
        }
        );
    } finally {
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      api.get('/todasatividades')
        .then(result => this.setState({
          loading: false,
          atividades: result.data,
        }));
    });
  }



  render() {

    return (
      <MasterPage tituloCabecalho='titulo inicial'>


        <Breadcrumb>
          <Breadcrumb.Item href="/">Início</Breadcrumb.Item>
          <Breadcrumb.Item active>Atividades</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Card.Header>
            <Link to={'/admin/atividades/cadastrar'}>
              <Button>Cadastrar Atividade</Button>
            </Link>
          </Card.Header>
          <Card.Body>
            {this.state.atividades.length === 0 ? 'Nenhuma atividade cadastrada' : null}
            <Row>
              {this.state.loading ? <Spinner animation="border" /> :
                this.state.atividades.map((atividade, k) =>
                  <div key={k} className="col-lg-3 col-md-6 mb-4">
                    <Card className="h-100">
                      <Card.Img variant="top" src={baseURLAPI + '/' + atividade.imagem} />


                      <Card.Body className="text-center">
                        <Card.Title>
                          <h5>
                            {atividade.titulo} ({atividade.ordem})
                          </h5>
                        </Card.Title>
                        <Card.Text>

                          {atividade.descricao.substr(0, 50)}

                        </Card.Text>
                      </Card.Body>
                      <Card.Footer className="text-center">
                        <Button variant="outline-info"
                          href={`/admin/atividades/alterar/${atividade.id}`} >
                          Alt.
                        </Button>

                        <Popconfirm
                          title="Confirma a exclusão desta atividade?"
                          onConfirm={() => { this.doConfirm(atividade.id); }}
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

export default Form.create()(AtividadesIndex);
import React from 'react';
import api, { baseURLAPI } from '../../services/api';
import MasterPage from '../../components/MasterPage';
import FrmPadrao from '../../padrao/frmPadrao';
import { Spinner, Card, Row, Button, Breadcrumb } from 'react-bootstrap';
import { Form, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';

class MateriasIndex extends FrmPadrao {

  state = {
    loading: false,
    materias: [],
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      api.get('/todasmaterias')
        .then(result => this.setState({
          loading: false,
          materias: result.data,
        }));
    });
  }

  doConfirm(id) {
    this.setState({ loading: true });
    try {
      api.delete(`/excluirmateria/${id}`)
        .then(result => {
          let tmp = this.state.materias.filter(function (e) {
            return e.id !== id;
          });
          this.setState({ materias: tmp });
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
          <Breadcrumb.Item active>Matérias</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Card.Header>
            <Link to={'/admin/materias/cadastrar'}>
              <Button>Cadastrar Matéria</Button>
            </Link>
          </Card.Header>
          <Card.Body>
            {this.state.materias.length === 0 ? 'Nenhuma materia cadastrada' : null}
            <Row>
              {this.state.loading ? <Spinner animation="border" /> :
                this.state.materias.map((materia, k) =>
                  <div key={k} className="col-lg-3 col-md-6 mb-4">
                    <Card className="h-100">
                      {materia.imagem ? <Card.Img variant="top" src={baseURLAPI + '/' + materia.imagem} /> : ''}
                      
                      <Card.Body className="text-center">
                        <Card.Title>
                          <h5>
                          {materia.id} - {materia.titulo}
                          </h5>
                        </Card.Title>
                        <Card.Text className="text-left">
                          {materia.manchete}
                        </Card.Text>
                      </Card.Body>
                      <Card.Footer className="text-center">
                        <Button variant="outline-info"
                          href={`/admin/materias/alterar/${materia.id}`} >
                          Alt.
                        </Button>

                        <Popconfirm
                          title="Confirma a exclusão desta materia?"
                          onConfirm={() => { this.doConfirm(materia.id); }}
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

export default Form.create()(MateriasIndex);
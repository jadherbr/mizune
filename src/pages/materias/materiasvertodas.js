import React from 'react';
import api, { baseURLAPI } from '../../services/api';
import FrmPadrao from '../../padrao/frmPadrao';
import MasterPage from '../../components/MasterPage';
import { Card, Breadcrumb, Row, Spinner } from 'react-bootstrap';

export default class MateriasVerTodas extends FrmPadrao {

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

  render() {

    return (
      <MasterPage tituloCabecalho='titulo inicial'>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Início</Breadcrumb.Item>
          <Breadcrumb.Item active>Parceiros</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Card.Body>
            {this.state.materias.length === 0 ? 'Nenhuma matéria cadastrada' : null}
            <Row>
              {this.state.loading ? <Spinner animation="border" /> :
                this.state.materias.map((materia, k) =>
                  <div key={k} className="col-lg-3 col-md-6 mb-4">
                    <Card className="h-100">
                      {materia.imagem ? (
                        <a href={`/materia/${materia.id}`}>
                          <Card.Img variant="top" src={baseURLAPI + '/' + materia.imagem} />
                        </a>
                      ) : ''}
                      <Card.Body className="text-center">
                        <Card.Title>
                          
                          <a href={`/materia/${materia.id}`}>
                          <h5>
                            {materia.id} - {materia.titulo}
                            </h5>
                            </a>
                          
                        </Card.Title>
                        <Card.Text className="text-left">
                          {materia.manchete}
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
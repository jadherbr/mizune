import React from 'react';
import api, { baseURLAPI } from '../../services/api';
import FrmPadrao from '../../padrao/frmPadrao';
import MasterPage from '../../components/MasterPage';
import { Form } from 'antd';
import { Card, Breadcrumb, Row, Spinner, Button } from 'react-bootstrap';

class AtividadesVerTodas extends FrmPadrao {

  state = {
    loading: false,
    atividades: [],
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
                        <Button variant="primary" href={`/saibamais/${atividade.id}`} >
                          Saiba mais
                      </Button>
                      </Card.Footer>
                    </Card>
                  </div>
                )}
            </Row>

          </Card.Body>
        </Card>
      </MasterPage>
    )
  }
}

export default Form.create()(AtividadesVerTodas);
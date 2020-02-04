import React from 'react';
import api from '../../services/api';
import FrmPadrao from '../../padrao/frmPadrao';
import MasterPage from '../../components/MasterPage';
import { Form } from 'antd';
import { Card, Breadcrumb, Col, Row, Spinner } from 'react-bootstrap';

class VideosVerTodos extends FrmPadrao {

  state = {
    loading: false,
    videos: [],
  }  

  componentDidMount() {
    this.setState({ loading: true }, () => {
      api.get('/todosvideos')
        .then(result => {
          this.setState({
            loading: false,
            videos: result.data,
          });
          //console.log(result);
        }).catch(er => {
          console.log(er);
        });
    });
  }

  render() {

    return (
      <MasterPage tituloCabecalho='titulo inicial'>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Início</Breadcrumb.Item>
          <Breadcrumb.Item active>Todos os Vídeos</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
        <Card.Body>
            {this.state.videos.length === 0 ? 'Nenhuma vídeo cadastrado' : null}
            <Row>
              {this.state.loading ? <Spinner animation="border" /> :
                this.state.videos.map((video, k) =>
                  <Col key={k} className="col-lg-6 col-md-6 mb-4">
                    <Card>
                      <Card.Body className="h-100">
                        <Card.Title className="text-center">
                          {video.titulo}
                        </Card.Title>
                        <div className="embed-responsive embed-responsive-16by9">
                          <iframe src={`https://www.youtube.com/embed/${video.url}`} frameBorder='0' allow='autoplay; encrypted-media'
                            allowFullScreen title='video' />
                        </div>
                        <Card.Text>
                          {video.descricao}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                )
              }
            </Row>

          </Card.Body>
        </Card>
      </MasterPage>
    )
  }
}

export default Form.create()(VideosVerTodos);
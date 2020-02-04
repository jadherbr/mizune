import React from 'react';
import api from '../../services/api';
import MasterPage from '../../components/MasterPage';
import FrmPadrao from '../../padrao/frmPadrao';
import { Spinner, Card, Col, Row, Button, Breadcrumb } from 'react-bootstrap';
import { Form, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';

class VideosIndex extends FrmPadrao {

  state = {
    loading: false,
    videos: [],
  }

  doConfirm(id) {
    this.setState({ loading: true });
    try {
      api.delete(`/excluirvideo/${id}`)
        .then(result => {
          let tmp = this.state.videos.filter(function (e) {
            return e.id !== id;
          });
          this.setState({ videos: tmp });
        }
        );
    } catch(err) {
      this.getMessageError('Erro ao excluir: ' + err.message);
    } finally {
      this.setState({ loading: false });
    }
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
          <Breadcrumb.Item active>Vídeos</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Card.Header>
            <Link to={'/admin/videos/cadastrar'}>
              <Button>Cadastrar Vídeo</Button>
            </Link>
          </Card.Header>
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

                      <Card.Footer className="text-center">
                        <Button variant="outline-info"
                          href={`/admin/videos/alterar/${video.id}`} >
                          Alt.
                        </Button>

                        <Popconfirm 
                          title="Confirma a exclusão deste vídeo?"
                          onConfirm={() => { this.doConfirm(video.id); }}
                          okText="Sim"
                          cancelText="Não">
                          <Button variant="outline-danger" href="#">
                            Del.
                          </Button>
                        </Popconfirm>

                      </Card.Footer>

                    </Card>
                  </Col>
                )
              }
            </Row>

          </Card.Body>
        </Card>


      </MasterPage>
    );
  }
}

export default Form.create()(VideosIndex);
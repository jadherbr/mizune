import React, { Component } from 'react';
import api from '../../../services/api';
import { Spinner, Card, Row, Col } from 'react-bootstrap';
import './styles.css';

export default class IndexVideos extends Component {

  state = {
    loading: false,
    videos: [],
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      api.get('/videosindex')
        .then(result => this.setState({
          loading: false,
          videos: [...result.data],
        }));
    });
  }

  render() {

    return (
      <>
        <div className="videos-area box-shadow">
          
            <div className="cabecalho-de-sessao d-flex justify-content-between">
              <a href="/videos/vertodos">
                <h5>Vídeos do Estúdio</h5>
              </a>
              <a href="/videos/vertodos" className="videos-vertodos">
                Ver todos >
              </a>
            </div>

            <Row>
              {this.state.loading ? <Spinner animation="border" /> :
                this.state.videos.map((video, k) =>
                  <Col key={k} className="col-lg-3">
                    <Card className="h-100">
                      <Card.Body>
                        <Card.Title className="text-center">
                          <p className="video-titulo">
                            {video.titulo}
                          </p>                          
                        </Card.Title>
                        <div className="embed-responsive embed-responsive-16by9">
                          <iframe src={`https://www.youtube.com/embed/${video.url}`} frameBorder='0' allow='autoplay; encrypted-media'
                            allowFullScreen title='video' />
                        </div>
                        <Card.Text>
                          <span className="video-descricao">
                            {video.descricao.substr(0, 60)} ...
                          </span>
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
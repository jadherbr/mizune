import React, { Component } from 'react';
import api, { baseURLAPI } from '../../../services/api';
import { Carousel, Spinner } from 'react-bootstrap';

export default class Noticias extends Component {

  state = {
    loading: false,
    atividades: [],
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      api.get('/atividadessindex')
        .then(result => this.setState({
          loading: false,
          atividades: [...result.data],
        }));
    });
  }

  render() {
    return (
      <>

        <div className="mag-posts-area">          

          <div className="mag-posts-content box-shadow">
            <div className="p-3">
              <div className="section-heading">
              <a href="/atividades/vertodas"><h5>Atividades</h5></a>
              </div>


              <Carousel nextLabel="Próximo" prevLabel="Anterior">
              {this.state.loading ? <Spinner animation="border" /> :
                this.state.atividades.map((atividade, k) =>
                <Carousel.Item key={k}>
                  <img
                    className="imgCarousel d-block"
                    src={baseURLAPI + '/' + atividade.imagem}
                    href={`/saibamais/${atividade.id}`}
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h3 className="atividadeTitulo">{atividade.titulo}</h3>
                    <p className="atividadeDesc">{atividade.descricao.substr(0, 50)}</p>
                  </Carousel.Caption>
                </Carousel.Item>
                )}
               
              </Carousel>

            </div>
          </div>

          <div className="post-sidebar-area box-shadow">
            <div className="p-3">
              <div className="section-heading">
                <h5>Últimas matérias</h5>
              </div>

              <div className="single-blog-post d-flex">
                <div className="post-thumbnail">
                  <img src="/templates/mag/img/bg-img/4.jpg" alt="" />
                </div>
                <div className="post-content">
                  <a href="single-post.html" className="post-title">Global Travel And Vacations Luxury Travel</a>
                  <div className="post-meta d-flex justify-content-between">
                    <p>xesque do bresque xesque do bresque xesque do bresque </p>
                  </div>
                </div>
              </div>

              <div className="single-blog-post d-flex">
                <div className="post-thumbnail">
                  <img src="/templates/mag/img/bg-img/4.jpg" alt="" />
                </div>
                <div className="post-content">
                  <a href="single-post.html" className="post-title">Global Travel And Vacations Luxury Travel</a>
                  <div className="post-meta d-flex justify-content-between">
                    <p>xesque do bresque xesque do bresque xesque do bresque </p>
                  </div>
                </div>
              </div>

              <div className="single-blog-post d-flex">
                <div className="post-thumbnail">
                  <img src="/templates/mag/img/bg-img/4.jpg" alt="" />
                </div>
                <div className="post-content">
                  <a href="single-post.html" className="post-title">Global Travel And Vacations Luxury Travel</a>
                  <div className="post-meta d-flex justify-content-between">
                    <p>xesque do bresque xesque do bresque xesque do bresque </p>
                  </div>
                </div>
              </div>

            </div>
          </div>



        </div>

        <div className="post-sidebar-area right-sidebar mt-30 mb-30 box-shadow">
          <div className="single-sidebar-widget p-30">
            <div className="social-followers-info">

              <a href="#" className="facebook-fans"><i className="fa fa-facebook"></i> 4,360 <span>Fans</span></a>

              <a href="#" className="twitter-followers"><i className="fa fa-twitter"></i> 3,280 <span>Followers</span></a>

              <a href="#" className="youtube-subscribers"><i className="fa fa-youtube"></i> 1250 <span>Subscribers</span></a>

              <a href="#" className="google-followers"><i className="fa fa-google-plus"></i> 4,230 <span>Followers</span></a>
            </div>
          </div>
        </div>
      </>

    )
  }
}
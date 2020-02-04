import React from 'react';
import api from '../../services/api';
import MasterPage from '../../components/MasterPage';
import { Breadcrumb, Card, Spinner } from 'react-bootstrap';

class AtividadesSaibaMais extends React.Component {


  state = {
    loading: false,
    saibamais: ''
  };

  async componentDidMount() {
    this.setState({ loading: true });
    let id = this.props.match.params.id;
    try {
      let res = await api.get(`/saibamais/${id}`);
      this.setState({
        titulo: res.data.titulo,
        saibamais: res.data.saibamais
      })
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {

    return (

      <MasterPage tituloCabecalho='titulo inicial'>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Início</Breadcrumb.Item>
          <Breadcrumb.Item active>Saiba Mais</Breadcrumb.Item>
        </Breadcrumb>

        <Card>
          <Card.Header>
            {this.state.loading ? <Spinner animation="border" /> :
              this.state.titulo
            }
          </Card.Header>
          <Card.Body>
            {this.state.loading ? <Spinner animation="border" /> :
              <div dangerouslySetInnerHTML={{ __html: this.state.saibamais.replace(/(<? *script)/gi, 'illegalscript') }} >
              </div>
            }
          </Card.Body>
        </Card>
      </MasterPage>
    )
  }
}

export default AtividadesSaibaMais;
import React from 'react';
import api, { baseURLAPI } from '../../services/api';
import MasterPage from '../../components/MasterPage';
import { Breadcrumb, Card, Spinner } from 'react-bootstrap';

var styleImg = {
  'float': 'left',
  'margin': '10px',
  'max-width': '300px'
 
}

export default class ExibirMateria extends React.Component {

  state = {
    loading: false,
    materia: '',
    titulo: '',
    manchete: '',
    imagem: ''
  }



  async componentDidMount() {
    this.setState({ loading: true });
    let id = this.props.match.params.id;
    try {
      let res = await api.get(`/exibirmateria/${id}`);
      this.setState({
        titulo: res.data.titulo,
        manchete: res.data.manchete,
        materia: res.data.materia,
        imagem: res.data.imagem,
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
          <Breadcrumb.Item active>Matéria</Breadcrumb.Item>
        </Breadcrumb>

        <Card>
          <Card.Header>
            {this.state.loading ? <Spinner animation="border" /> :
              <>
                <p><b>{this.state.titulo}</b></p>
                <p>{this.state.manchete}</p>
              </>
            }
          </Card.Header>
          <Card.Body>
            <img style={styleImg} src={baseURLAPI + '/' + this.state.imagem} alt="" />
            <p><b>
              {this.state.manchete}
            </b></p>
            {this.state.loading ? <Spinner animation="border" /> :
              <div dangerouslySetInnerHTML={{ __html: this.state.materia.replace(/(<? *script)/gi, 'illegalscript') }} >
              </div>
            }
          </Card.Body>
        </Card>
      </MasterPage>
    )
  }
}
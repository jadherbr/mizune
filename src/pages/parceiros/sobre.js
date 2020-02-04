import React from 'react';
import api, { baseURLAPI } from '../../services/api';
import MasterPage from '../../components/MasterPage';
import { Breadcrumb, Card, Spinner } from 'react-bootstrap';

var styleImg = {
  'float': 'left',
  'margin': '10px',
  'max-width': '300px'
 
}

export default class SobreParceiro extends React.Component {

  state = {
    loading: false,
    nome: '',
    imagem: '',
    endereco: '',
    telefone: '',
    sobre: ''
  }

  async componentDidMount() {
    this.setState({ loading: true });
    let id = this.props.match.params.id;
    try {
      let res = await api.get(`/exibirparceiro/${id}`);      
      this.setState({
        nome: res.data.nome,
        imagem: res.data.imagem,
        endereco: res.data.endereco,
        telefone: res.data.telefone,
        sobre: res.data.sobre,
      });
      console.log(this.state.parceiro);
      
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {

    return (

      <MasterPage tituloCabecalho='titulo inicial'>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Início</Breadcrumb.Item>
          <Breadcrumb.Item active>Parceiro</Breadcrumb.Item>
        </Breadcrumb>

        <Card>
          <Card.Header>
            {this.state.loading ? <Spinner animation="border" /> :
              <>
                <p><b>{this.state.nome}</b></p>
                <p>End.: {this.state.endereco} Tel.: {this.state.telefone}</p>
              </>
            }
          </Card.Header>
          <Card.Body>
            <img style={styleImg} src={baseURLAPI + '/' + this.state.imagem} alt="" />
            {this.state.loading ? <Spinner animation="border" /> :
              <div dangerouslySetInnerHTML={{ __html: this.state.sobre.replace(/(<? *script)/gi, 'illegalscript') }} >
              </div>
            }
          </Card.Body>
        </Card>
        
      </MasterPage>
    )
  }
}
import React from "react";
import FrmPadrao from '../../padrao/frmPadrao';
import { connect } from 'react-redux';
import api from '../../services/api';
import { login } from "../../services/auth";
import { bindActionCreators } from 'redux';
import { Creators as loggedUserActions } from '../../store/reducers/loggedUser';
import { Form, Input, Icon, Checkbox, Button, Tooltip, Select } from 'antd';

class Login extends FrmPadrao {
  state = {
    loading: false,
    listaEmpresas: [],
    nmempresa: ""
  }

  componentDidMount() {
    this.inputEmail.focus();
    this.getEmpresas();
  }

  emailOnBlur = e => {
    let email = this.props.form.getFieldValue('email');
    if ((email) && (this.state.listaEmpresas.length > 1)) {
      this.getLoginUltimaEmpresa(email);
    }
   }

  async getLoginUltimaEmpresa(email) {
  try {
      this.setState({loading:true});      
      const res = await api.get('/loginultimaempresa', {
        params: {email: email}
      });
      let id = res?.data?.empresa_id;
      if (id) {
        this.props.form.setFields({ empresa_id: { value: id } });
      }      
    }catch(err){
      console.log(err);
      this.setState({loading:false});
    }finally {
      this.setState({loading:false});
    }
    
  }

  async getEmpresas() {
    try {
      this.setState({ loading: true });
      const res = await api.get(`/loginempresas?nmempresa=${this.state.nmempresa}`);
      this.setState({
        listaEmpresas: res.data
      }, () => {

        // Método para consultar a ultima empresa que ele logou
        // ou se tem apenas uma empresa disponivel para ele logar
        if (this.state.listaEmpresas.length == 1) {
          this.props.form.setFields({
            empresa_id: {
              value: this.state.listaEmpresas[0].id
            }
          });
        } else {
          console.log(this.props.form.getFieldsValue());
          let email = this.props.form.getFieldValue('email');
          console.log('email');
          console.log(email);
          if (email) {
            let empresa_id = this.getLoginUltimaEmpresa(email);
            console.log(empresa_id);
          }
        }
        

      });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  }

  empresaHandle = value => {
    this.setState({
      nmempresa: value
    }, () => {
      this.getEmpresas();
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true });
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        try {
          const response = await api.post("/authenticate", values ); 
          this.props.updateUser(response.data.user);
          login(response.data, values.loginautomatico);
          this.props.history.push("/");
          return;
        } catch (err) {
          if (err.message === "Network Error") {
            this.getMessageError("Erro de conexão com a API!");
          } else {
            this.getMessageAlert(err?.response?.data?.msg);
          }
        } finally {
          this.setState({ loading: false });
        }
      }
    })
  }

  render() {

    var styleContainer = {
      'width': '100vw',
      'height': '100vh',
      'background': '#e1e6ed',
      'display': 'flex',
      'flexDirection': 'row',
      'justifyContent': 'center',
      'alignItems': 'center'
    } 

    var styleCaixa = {
       'width': 300,
       'height': 270,
       'background': '#fff',
       'padding': 20
     }

     var styleButton = {
      'width': '100%'
     }

    const { getFieldDecorator } = this.props.form;

    return (
      <>
      <div style={styleContainer}>
 
        <Form onSubmit={this.handleSubmit} className="login-form" style={styleCaixa}>
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Informe o e-mail!' }],
          })(
            <Input
              ref={(input) => { this.inputEmail = input; }} 
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="e-mail"
              onBlur={this.emailOnBlur}
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('senha', {
            rules: [{ required: true, message: 'Informe a senha!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Senha"
            />,
          )}
        </Form.Item> 

        <Form.Item>
            {getFieldDecorator('empresa_id', {
              rules: [{ required: true, message: 'Informe a empresa!' }],
            })(
              <Select
                showSearch
                onSearch={this.empresaHandle}
                optionFilterProp="label"
                placeholder="Empresa"
                loading={this.state.loading}
              >
                {this.state.listaEmpresas.map(d => (
                  <Select.Option key={d.id} value={d.id} label={d.nmempresa}>{d.id} - {d.nmempresa}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>

        <Form.Item>
          <Button 
          loading={this.state.loading}
          type="primary" 
          htmlType="submit" 
          className="login-form-button" 
          style={styleButton}>
            Log in
          </Button>
        </Form.Item>

        <Form.Item>
          {getFieldDecorator('loginautomatico', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Salvar credenciais &nbsp;
              <Tooltip title="Salva as informações de login e senha no navegador.">
                <Icon type="question-circle-o" />
              </Tooltip>
          </Checkbox>)}
          
        </Form.Item>

      </Form>

      </div>
      
    </>
    );
  }
}

const mapStateToProps = store => ({
  user: store.loggedUser.user
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(loggedUserActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Login));





 /*

 <Form.Group>
                    <Form.Check type="checkbox" label="Check me out" />
                  </Form.Group>


            <form onSubmit={this.handleSignIn}>
              {this.state.error && <p>{this.state.error}</p>}
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" name="email" className="form-control" onChange={this.myChangeHandler} />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div className="form-group">
                <label htmlFor="senha">Password</label>
                <input type="password" className="form-control" onChange={e => this.setState({ senha: e.target.value })}
                  name="senha" placeholder="Senha de Acesso" />
              </div>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
              </div>
      
              <div className="form-group">
                <button type="submit" className="btn btn-primary" >Login</button>
      
              </div>
            </form>
            */

  /* async componentDidMount() {
    const { id } = this.props.match.params;
    const response = await api.get(`/produto/${id}`);
    this.setState({ produto: response.data });
  } */

  /*   logar = async () => {
      const response = await api.post('/login');
  
      //const { docs, ...productInfo} = response.data;
  
      //this.setState({ products: docs, productInfo, page });
    } */
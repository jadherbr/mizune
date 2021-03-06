import FrmPadrao from '../../padrao/frmPadrao';
import React from 'react';
import MasterPage from '../../components/MasterPage';
import api from '../../services/api';
import { Form, Input, Button, Icon, InputNumber, Tooltip } from 'antd';
import { Breadcrumb, Card } from 'react-bootstrap';

class AlterarVideo extends FrmPadrao {

  state = {
    idVideo: 0,
    loading: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });    
    try {
      let id = this.props.match.params.id;
      let res = await api.get(`/video/${id}`);
      this.props.form.setFieldsValue({
        ...res.data
      });
      this.setState({ idVideo: id });
    } finally {
      this.setState({ loading: false });
    }
  }

  //  SUBMIT
  handleSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });
    // Gerando Request
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        try {
          const response = await api.put(`/alterarvideo/${this.state.idVideo}`, values);
          console.log(response);
          if (response.status === 200) {
            this.getMessageSuccess("Salvo com sucesso!");
          } else {
            this.getMessageError(response.statusText);
            console.log(response);
          }
        } catch (error) {
          if (error.response) {
            if (error.response.status === 403) {
              if (error.response.data.msg) {
                this.getMessageAlert(error.response.data.msg);
              }
            }
          } else {
            console.log('Error', error.message);
          }
          console.log(error);
        } finally {
          this.setState({ loading: false });
        }
      }
    });
    
  }



  render() {

    const { getFieldDecorator } = this.props.form;

    return (

      <MasterPage tituloCabecalho='titulo inicial'>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Início</Breadcrumb.Item>
          <Breadcrumb.Item href="/admin/videos">Vídeos</Breadcrumb.Item>
          <Breadcrumb.Item active>Alterar Vídeo</Breadcrumb.Item>
        </Breadcrumb>

        <Card>
          <Card.Body>
            <Form {...this.layoutSideBySyde} onSubmit={this.handleSubmit} contextMenu="" >

              <Form.Item
                label={<span>Título</span>}>
                {getFieldDecorator('titulo', {
                  rules: [{ required: true, message: 'Informe o título do vídeo!', whitespace: true }],
                })(<Input />)}
              </Form.Item>

              <Form.Item
                label={<span>Descrição</span>}>
                {getFieldDecorator('descricao', {
                  rules: [{ required: true, message: 'Informe a descrição do vídeo!', whitespace: true }],
                })(<Input />)}
              </Form.Item>

              <Form.Item label="Ordem (1, 2, 3, etc...)">
                {getFieldDecorator('ordem', {
                  rules: [{ required: true, message: 'Informe ordem de exibição do vídeo!' }],
                })(<InputNumber min={1} max={99} style={{ width: '100%' }} />)}
              </Form.Item>

              <Form.Item label={
                <span>Código do Vídeo&nbsp;
                <Tooltip title="informe apenas o código do vídeo. Ex: Código: brRzUQcrtYY do vídeo: youtube.com/watch?v=brRzUQcrtYY">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>}>
                {getFieldDecorator('url', {
                  rules: [{ required: true, message: 'Informe a url do vídeo!', whitespace: true }],
                })(<Input placeholder="brXxxXXxxX" />)}
              </Form.Item>

              <Form.Item {...this.Layout2ColsEm1}>
                <Button type="primary"
                  htmlType="submit"
                  disabled={this.state.loading}
                  loading={this.state.loading}>
                  Salvar
              </Button>
              </Form.Item>

            </Form>
          </Card.Body>
        </Card>

      </MasterPage>

    )
  }
}


export default Form.create()(AlterarVideo);
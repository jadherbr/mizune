import React from "react";
import FrmPadrao from '../../padrao/frmPadrao';
import MasterPage from '../../components/MasterPage';
import api from '../../services/api';
import { Form, Input, Button, Icon } from 'antd';
import { Breadcrumb, Card } from 'react-bootstrap';

class AlterarSenha extends FrmPadrao {

  state = {
    confirmDirty: false,
    loading: false
  }

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Os campos senha e confirme a senha devem ser iguais!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        try {
          const response = await api.put('/alterarsenha', values);
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
      <>
        <MasterPage tituloCabecalho='titulo inicial'>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Início</Breadcrumb.Item>
            <Breadcrumb.Item active>Alterar Senha</Breadcrumb.Item>
          </Breadcrumb>
          <Card>
            <Card.Body>
              <Form {...this.layoutSideBySyde} onSubmit={this.handleSubmit} contextMenu="" >

                <Form.Item label="Nova Senha" hasFeedback>
                  {getFieldDecorator('password', {
                    rules: [{
                      required: true,
                      message: 'Informe a nova senha!',
                    },
                    {
                      validator: this.validateToNextPassword,
                    },
                    ],
                  })(<Input.Password
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />)}
                </Form.Item>
                <Form.Item label="Confirme a senha" hasFeedback>
                  {getFieldDecorator('confirm', {
                    rules: [
                      {
                        required: true,
                        message: 'Informe a confirmação da nova senha!',
                      },
                      {
                        validator: this.compareToFirstPassword,
                      },
                    ],
                  })(<Input.Password
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onBlur={this.handleConfirmBlur} />)}
                </Form.Item>

                <Form.Item {...this.Layout2ColsEm1}>
                  <Button type="primary"
                    htmlType="submit"
                    disabled={this.state.loading}
                    loading={this.state.loading}>
                    Alterar
                  </Button>
                </Form.Item>

              </Form>
            </Card.Body>
          </Card>
        </MasterPage>
      </>
    )
  }
}

export default Form.create()(AlterarSenha);
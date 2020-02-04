import FrmPadrao from '../../padrao/frmPadrao';
import React from 'react';
import MasterPage from '../../components/MasterPage';
import api, { baseURLAPI } from '../../services/api';
import { Form, Input, Button, Card, Tooltip, Icon, InputNumber, Upload } from 'antd';
import 'antd/dist/antd.css';
import { Breadcrumb } from 'react-bootstrap';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class ConfiguracaoSite extends FrmPadrao {

  state = {
    loading: false,
    submitDisabled: false
  };  

  async componentDidMount() {
    // Load Valores Iniciais
    this.setState({submitDisabled:true});
    let initialIndexConfig = await api.get('/indexconfig');
    this.props.form.setFieldsValue({
      ...initialIndexConfig.data
    });
    this.setState({ 
      imageUrl: baseURLAPI + '/' + initialIndexConfig.data.imagemlogo,
      submitDisabled:false
    });
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  beforeUpload = file => {
    const isJpgOrJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
    if (!isJpgOrJpeg) {
      this.getMessageError('Você só pode fazer upload de imagens no formato JPG/JPEG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.getMessageError('A imagem deve ter no máximo 2 megabytes!');
    }
    return isJpgOrJpeg && isLt2M;
  }

  dummyRequest({ file, onSuccess }) {
    setTimeout(() => {
      onSuccess("");
    }, 0);
  }


  //  SUBMIT
  handleSubmit = e => {
    e.preventDefault();
    this.setState({ submitDisabled: true });
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const formData = new FormData();
        Object.keys(values).forEach(function (item) {
          if (item !== "imagemlogo") {
            formData.append(item, values[item]);
          }
        });
        if (values.imagemlogo.file) {
          formData.append("imagemlogo", values.imagemlogo.file.originFileObj);
        }

        try {
          const response = await api.post("/updateindexconfig", formData);
          if (response.status === 200) {
            this.getMessageSuccess("Salvo com sucesso!");
          } else {
            this.getMessageError(response.statusText);
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
        }
      }
    });
    this.setState({ submitDisabled: false });

  };



  render() {
    const { getFieldDecorator } = this.props.form;

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Selecione uma Imagem</div>
      </div>
    );

    const { imageUrl } = this.state;

    return (
      <MasterPage tituloCabecalho='titulo inicial'>

        <Breadcrumb>
          <Breadcrumb.Item href="/">Início</Breadcrumb.Item>
          <Breadcrumb.Item active>Conf. do Site</Breadcrumb.Item>
        </Breadcrumb> 

        <Card>
          <Form {...this.layoutSideBySyde} onSubmit={this.handleSubmit} contextMenu="" >

            <Form.Item
              label={
                <span>
                  Link Facebook&nbsp;
              <Tooltip title="Insira o endereço da sua página profissional do Facebook?">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }>
              {getFieldDecorator('linkfacebook', {
                rules: [{ required: true, message: 'Informe o link da página do facebook!', whitespace: true }],
              })(<Input />)}
            </Form.Item>

            <Form.Item
              label={<span>Link GoogleMaps</span>}>
              {getFieldDecorator('localizacaomapa', {
                rules: [{
                  required: true,
                  message: 'Informe o link da geolocalização do google maps!',
                  whitespace: true
                }],
              })(<Input />)}
            </Form.Item>

            <Form.Item label="Telefone WhatsApp 1">
              {getFieldDecorator('telefonewhats1', {
                rules: [{
                  required: true,
                  message: 'Informe o número do telefone para contado!'
                }],
              })(<Input /*addonBefore={prefixSelector1}*/ />)}
            </Form.Item>

            <Form.Item label="Telefone WhatsApp 2">
              {getFieldDecorator('telefonewhats2', {
                rules: [{
                  required: true,
                  message: 'Informe o número do telefone para contado!'
                }],
              })(<Input /*addonBefore={prefixSelector2}*/ />)}
            </Form.Item>

            <Form.Item label="Qde. atividades">
              {getFieldDecorator('qdeatividades', {
                rules: [{ required: true, message: 'Informe a quantidade de atividades que serão apresentados na tela inicial!' }],
              })(<InputNumber min={1} max={99} style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="Qde. vídeos">
              {getFieldDecorator('qdevideos', {
                rules: [{
                  required: true,
                  message: 'Informe a quantidade de vídeos que serão apresentados na tela inicial!'
                }],
              })(<InputNumber min={1} max={99} style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="Qde. matérias">
              {getFieldDecorator('qdematerias', {
                rules: [{
                  required: true,
                  message: 'Informe a quantidade de matérias que serão apresentadas na tela inicial!'
                }],
              })(<InputNumber min={1} max={99} style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="Imagem Logo" {...this.Layout2ColsEm1}>
              {getFieldDecorator('imagemlogo', {
                rules: [{ required: true, message: 'Selecione uma imagem para a Logo do Site!' }],
              })(

                <Upload name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.handleChange}
                  customRequest={this.dummyRequest}
                >
                  {imageUrl ? <img src={imageUrl} alt="avatar"
                    style={{ width: '100%' }} /> : uploadButton}
                </Upload>
              )}
            </Form.Item>

            <Form.Item {...this.Layout2ColsEm1}>
              <Button type="primary"
                htmlType="submit"
                disabled={this.state.submitDisabled}
                loading={this.state.submitDisabled}>
                Salvar
              </Button>
            </Form.Item>

          </Form>
        </Card>
      </MasterPage>
    );
  }
}

export default Form.create()(ConfiguracaoSite);
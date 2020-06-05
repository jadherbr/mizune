import React from 'react';
import api from '../../../services/api';
import MizuneMasterPage from '../../../components/Mizune/MasterPage';
import FrmCadPadrao from '../../../padrao/frmCadPadrao';
import {
  Form, Table, Input, InputNumber, Button, Collapse,
  Select, Modal, Radio, Menu, Icon
} from 'antd';

class Municipios extends FrmCadPadrao {

  state = {
    qdeRegistros: 1,
    listaEstados: [],
    nmestadoselect: "",
    selectLoading: false,
    descricaoAreaEdicao: "Novo Registro"
  }

  constructor() {
    super();
    this.modeloNovo = { id: "", nmmunicipio: "", ceppadrao: "", cepini: "", cepfim: "", estado_id: null };
    this.cNomeCampoChave = "id";
    this.cNomeCampoDescricao = "nmmunicipio";
    this.URL_API_DELETE = "/gen/excluirmunicipio/";
    this.URL_API_GETDATA = "/gen/municipios";
    this.URL_API_SAVE = "/gen/municipiosave";
  }

  colunas = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: text => <b>{text}</b>,
    },
    {
      title: 'Município',
      dataIndex: 'nmmunicipio',
      key: 'nmmunicipio',
      sorter: true,
    },
    {
      title: 'Estado',
      dataIndex: 'nmestado',
      key: 'nmestado',
      sorter: true
    },
    {
      title: 'UF',
      dataIndex: 'uf',
      key: 'uf',
      sorter: true,
    },
    {
      title: 'CEP Padrão',
      dataIndex: 'ceppadrao',
      key: 'ceppadrao',
    }
  ];

  breadCrumbRoutes = [
    {
      path: '/',
      breadcrumbName: 'Início',
    },
    {
      path: '/gen/municipios',
      breadcrumbName: 'Municípios',
    }
  ];

  afterComponentDidMount = () => {
    this.getEstadoSelect();
  }

  afterCancelar = () => {
    this.estadoSelectChangeHandle("");
  }

  afterAlterar = () => {
    if (this.state.registroSelecionado) {
      this.estadoSelectChangeHandle(this.state.registroSelecionado.nmestado);
    }
  }

  async getEstadoSelect() {
    try {
      this.setState({ selectLoading: true });
      const res = await api.get(`/gen/estadoselect?nmestado=${this.state.nmestadoselect}`);
      this.setState({
        listaEstados: res.data
      });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ selectLoading: false });
    }
  }

  estadoSelectChangeHandle = value => {
    this.setState({
      nmestadoselect: value
    }, () => {
      this.getEstadoSelect();
    });
  };

  //  Pesquisa
  pesquisaSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(['pesqMunicipio', 'pesqUF'], async (err, values) => {
      if (!err) {
        let filtros = [];
        if (values.pesqMunicipio) {
          filtros.push({ campo: 'nmmunicipio', valor: values.pesqMunicipio, operador: 'LIKE' });
        }
        if (values.pesqUF) {
          filtros.push({ campo: 'uf', valor: values.pesqUF });
        }
        this.setState({ pesquisaVisible: false, filtros }, () => {
          this.getData();
        });
      }
    });
  }

  //  SUBMIT
   submitHandle = async (e) => {
    e.preventDefault();
    let ret = await this.getSalvar(['nmmunicipio', 'estado_id', 'ceppadrao', 'cepini', 'cepfim']);
    if (ret) {
      this.getCancelar();
    }
  }

  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <>
        <MizuneMasterPage routes={this.breadCrumbRoutes}>
        <Menu mode="horizontal">
            <Menu.Item disabled={this.state.registroSelecionado}>
              <a href="#" onClick={this.getNovo.bind(this)}>
                <Icon type="diff" />
                Novo
              </a>
            </Menu.Item>
            <Menu.Item >
              <Button
                form='frmPrincipal'
                type="link"
                icon="save"
                htmlType="submit"
                disabled={!this.state.registroSelecionado}>
                Salvar
              </Button>
            </Menu.Item>
            <Menu.Item disabled={!this.state.registroSelecionado}>
              <a href="#" onClick={this.getCancelar.bind(this)}>
                <Icon type="close" />
                Cancelar
              </a>
            </Menu.Item>
            <Menu.Item>
              <Button
                onClick={this.abrirPesquisa.bind(this)}
                disabled={this.state.registroSelecionado}
                type="link"
                icon="search">
                Pesquisar
              </Button>
            </Menu.Item>
          </Menu>

          <Collapse activeKey={this.state.activeKey}>
            {!this.state.registroSelecionado ? null : (
              <Collapse.Panel showArrow={false} header={this.getDescricaoAreaEdicao()} key="1">
                <Form id='frmPrincipal' {...this.layoutSideBySyde} onSubmit={this.submitHandle} contextMenu="" >

                  <Form.Item>
                    {getFieldDecorator('id')(<InputNumber style={{ display: 'none' }} />)}
                  </Form.Item>

                  <Form.Item
                    label={<span>Nome do Município</span>}>
                    {getFieldDecorator('nmmunicipio', {
                      rules: [{ required: true, message: 'Informe o nome do município!', whitespace: true }],
                    })(<Input />)}
                  </Form.Item>

                  <Form.Item
                    label={<span>Estado</span>}>
                    {getFieldDecorator('estado_id', {
                      rules: [{ required: true, message: 'Informe o estado!' }],
                    })(
                      <Select showSearch
                        onSearch={this.estadoSelectChangeHandle}
                        optionFilterProp="label"
                        placeholder="Selecione um estado"
                        loading={this.state.selectLoading}
                      >
                        {this.state.listaEstados.map(d => (
                          <Select.Option key={d.id} value={d.id} label={d.nmestado}>{d.nmestado} - {d.uf}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>

                  <Form.Item
                    label={<span>CEP Padrão</span>}>
                    {getFieldDecorator('ceppadrao', {
                      rules: [{ required: true, message: 'Informe o CEP padrão do município!', whitespace: true }],
                    })(<Input />)}
                  </Form.Item>

                  <Form.Item
                    label={<span>CEP Inicial</span>}>
                    {getFieldDecorator('cepini', {
                    })(<Input />)}
                  </Form.Item>

                  <Form.Item
                    label={<span>CEP Final</span>}>
                    {getFieldDecorator('cepfim', {
                    })(<Input />)}
                  </Form.Item>
                  
                </Form>
              </Collapse.Panel>
            )}
          </Collapse>

          <Table
            pagination={{
              showSizeChanger: true,
              pageSizeOptions: ['10', '30', '100'],
              position: 'bottom',
              total: this.state.qdeRegistros,
              pageSize: this.qdePorPag,
              showTotal: total => `Total: ${total}`
            }}
            locale={{ emptyText: 'Nenhum registro encontrado' }}
            rowKey='id'
            size='small'
            bordered={true}
            loading={this.state.loading}
            columns={this.colunas}
            dataSource={this.state.listaRegistros}
            onChange={this.onTableChange}
          />

          <Modal
            title="Pesquisar"
            visible={this.state.pesquisaVisible}
            footer={[
              <Button
                type="default"
                onClick={this.pesquisaCancelar}
                key="cancelar"
                icon="close">
                Cancelar
              </Button>,
              <Button type="primary"
                htmlType="submit"
                key="submit"
                form='frmPesquisa'
                icon="search">
                Pesquisar
              </Button>
            ]}>

            <Form id="frmPesquisa" {...this.layoutSideBySyde} onSubmit={this.pesquisaSubmit} contextMenu="" >
              <Form.Item
                label={<span>Município</span>}>
                {getFieldDecorator('pesqMunicipio')(<Input />)}
              </Form.Item>
              <Form.Item
                label={<span>UF</span>}>
                {getFieldDecorator('pesqUF')(<Input />)}
              </Form.Item>
            </Form>
          </Modal>
        </MizuneMasterPage>
      </>
    )
  }
}

export default Form.create()(Municipios);
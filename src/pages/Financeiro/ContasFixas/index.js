import React from 'react';
import api from '../../../services/api';
import MizuneMasterPage from '../../../components/Mizune/MasterPage';
import FrmCadPadrao from '../../../padrao/frmCadPadrao';
import NumberFormat from 'react-number-format';
import * as utils from '../../../padrao/utils';
import {
  Form, Table, Tag, Input, InputNumber, Button, Collapse,
  Menu, Icon, Modal, Radio, Checkbox, Select
}
  from 'antd';


class ContasFixas extends FrmCadPadrao {

  state = {
    qdeRegistros: 1,
    listaCategorias: [],
    nmsubcategoriaSearch: "",
    selectLoading: false,
    filtros: [{ campo: 'fin.contaspagarfixas.ativo', valor: true }]
  }

  constructor() {
    super();
    this.modeloNovo = { id: "", nmcontaspagarfixas: "", contaspagarsubcategoria_id: null, diavencimento: 1, valor: 0, ativo: true, empresa_id: null, user_id: null };
    this.cNomeCampoChave = "id";
    this.cNomeCampoDescricao = "nmcontaspagarfixas";
    this.URL_API_DELETE = "/fin/contaspagarfixasexcluir/";
    this.URL_API_GETDATA = "/fin/contaspagarfixaspag";
    this.URL_API_SAVE = "/fin/contaspagarfixassave";
  }

  colunas = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: text => <b>{text}</b>,
    },
    {
      title: 'Descrição',
      dataIndex: 'nmcontaspagarfixas',
      key: 'nmcontaspagarfixas',
      sorter: true,
    },
    {
      title: 'Categoria',
      dataIndex: 'nmcontaspagarcategoria',
      key: 'nmcontaspagarcategoria',
      sorter: true,
    },
    {
      title: 'SubCategoria',
      dataIndex: 'nmcontaspagarsubcategoria',
      key: 'nmcontaspagarsubcategoria',
      sorter: true,
    },
    {
      title: 'Dia Venc',
      dataIndex: 'diavencimento',
      key: 'diavencimento',
      width: 90,
      align: 'center',
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      width: 100,
      render: (text) => (
        <span>
          {utils.numberToReal(parseFloat(text))}
        </span>)
    },
    {
      title: 'Ativo',
      key: 'ativo',
      align: 'center',
      width: 80,
      render: (record) => (
        <span>
          <Tag color={record.ativo ? 'blue' : 'volcano'}>
            {record.ativo ? 'Sim' : 'Não'}
          </Tag>
        </span>
      ),
    }
  ];

  breadCrumbRoutes = [
    {
      path: '/',
      breadcrumbName: 'Início',
    },
    {
      path: '/financeiro',
      breadcrumbName: 'Financeiro',
    },
    {
      path: '/financeiro/contasfixas',
      breadcrumbName: 'Contas a Pagar Fixas',
    }
  ];

  afterGetNovo = () => {
    this.getSubCategoriasFromApi();
  }

   afterAlterar = () => {
    let vVal = this.props.form.getFieldValue('valor').toString();
    this.props.form.setFieldsValue({
      valorCurrency: vVal.replace('.', ',')
    });
    if (this.state.registroSelecionado) {
      this.categoriaSelectChangeHandle(this.state.registroSelecionado.nmcontaspagarsubcategoria);
    }
  } 

  async getSubCategoriasFromApi() {
    try {
      this.setState({ selectLoading: true });
      const res = await api.get(`/fin/searchsubcategorias?nmsubcategoria=${this.state.nmsubcategoriaSearch}`);
      console.log(res.data);
      this.setState({
        listaCategorias: res.data
      });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ selectLoading: false });
    }
  }

  categoriaSelectChangeHandle = value => {
    this.setState({
      nmsubcategoriaSearch: value
    }, () => {
      this.getSubCategoriasFromApi();
    });
  };

  //  Pesquisa
  pesquisaSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(['pesqDescricao', 'pesqCategoria', 'pesqSubCategoria', 'pesqAtivos'], async (err, values) => {
      if (!err) {
        let filtros = [];
        if (values.pesqDescricao) {
          filtros.push({ campo: 'nmcontaspagarfixas', valor: values.pesqDescricao, operador: 'LIKE' });
        }
        if (values.pesqCategoria) {
          filtros.push({ campo: 'nmcontaspagarcategoria', valor: values.pesqCategoria, operador: 'LIKE' });
        }
        if (values.pesqSubCategoria) {
          filtros.push({ campo: 'nmcontaspagarsubcategoria', valor: values.pesqSubCategoria, operador: 'LIKE' });
        }
        if (values.pesqAtivos != "2") {
          filtros.push({ campo: 'fin.contaspagarfixas.ativo', valor: values.pesqAtivos == "1" });
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
    //utils.setFloatField(this.props.form, 'valor');
    if (await this.getSalvar(['nmcontaspagarfixas', 'contaspagarsubcategoria_id', 'valor', 'valorCurrency', 'diavencimento', 'ativo'])) {
      this.getCancelar();
    }
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    getFieldDecorator("valor", { initialValue: 0 });

    
    return (
      <>
        <MizuneMasterPage routes={this.breadCrumbRoutes} >
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

          <Collapse activeKey={this.state.activeKey} >
            {!this.state.registroSelecionado ? null : (
              <Collapse.Panel showArrow={false} header={this.getDescricaoAreaEdicao()} key="1">
                <Form id='frmPrincipal' {...this.layoutSideBySyde} onSubmit={this.submitHandle} contextMenu="" >
                  <Form.Item>
                    {getFieldDecorator('id')(<InputNumber style={{ display: 'none' }} />)}
                  </Form.Item>
                  <Form.Item
                    label={<span>Descrição</span>}>
                    {getFieldDecorator('nmcontaspagarfixas', {
                      rules: [{ required: true, message: 'Informe a descrição!' }],
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item
                    label={<span>Dia Vencimento</span>}>
                    {getFieldDecorator('diavencimento', {
                      rules: [{ required: true, message: 'Informe !' }],
                    })(<InputNumber min={1} max={31} style={{ width: 180 }} />)}
                  </Form.Item>

                  <Form.Item
                    label={<span>Valor</span>}>
                    {getFieldDecorator('valorCurrency', {
                      rules: [{ required: true, message: 'Informe !' }]
                    })(
                      <NumberFormat
                        displayType={'input'}
                        thousandsGroupStyle={'thousand'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                        prefix={'R$ '}
                        customInput={Input}
                        style={{ width: 180 }}
                        onValueChange={(values) => {
                          this.props.form.setFieldsValue({
                            valor: values.floatValue
                          });
                        }}
                      />
                    )}
                  </Form.Item> 
                  <Form.Item
                    label={<span>Categoria</span>}>
                    {getFieldDecorator('contaspagarsubcategoria_id', {
                      rules: [{ required: true, message: 'Informe a categoria!' }],
                    })(
                      <Select showSearch
                        onSearch={this.categoriaSelectChangeHandle}
                        optionFilterProp="label"
                        loading={this.state.selectLoading}
                      >
                        {this.state.listaCategorias.map(d => (
                          <Select.Option key={d.id} value={d.id} label={d.nmcontaspagarsubcategoria}>{d.nmcontaspagarsubcategoria} - {d.nmcontaspagarcategoria}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item
                    label={<span>Ativo</span>}>
                    {getFieldDecorator('ativo', {
                      initialValue: true,
                      valuePropName: 'checked'
                    })(<Checkbox />)}
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
            columns={this.colunas}
            dataSource={this.state.listaRegistros}
            onChange={this.onTableChange}

          />

          <Modal
            title="Pesquisar"
            visible={this.state.pesquisaVisible}
            onCancel={this.pesquisaCancelar}
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
                label={<span>Descrição</span>}>
                {getFieldDecorator('pesqDescricao')(<Input />)}
              </Form.Item>
              <Form.Item
                label={<span>Categoria</span>}>
                {getFieldDecorator('pesqCategoria')(<Input />)}
              </Form.Item>
              <Form.Item
                label={<span>SubCategoria</span>}>
                {getFieldDecorator('pesqSubCategoria')(<Input />)}
              </Form.Item>
              <Form.Item
                label={<span>Ativos</span>}>
                {getFieldDecorator('pesqAtivos', {
                  initialValue: "1"
                })(
                  <Radio.Group>
                    <Radio value="1">Sim</Radio >
                    <Radio value="0">Não</Radio >
                    <Radio value="2">Todos</Radio >
                  </Radio.Group>
                )}
              </Form.Item>
            </Form>
          </Modal>
        </MizuneMasterPage>
      </>
    )
  }
}

export default Form.create()(ContasFixas);
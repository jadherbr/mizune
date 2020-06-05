import React from 'react';
import api from '../../../services/api';
import FrmCadPadrao from '../../../padrao/frmCadPadrao';
import MizuneMasterPage from '../../../components/Mizune/MasterPage';
import * as utils from '../../../padrao/utils';
import Moment from 'moment';
import NumberFormat from 'react-number-format';
import {
  Form, Table, Tag, Input, InputNumber, Button, Collapse,
  Menu, Icon, Modal, Radio, Checkbox, Select, DatePicker
}
  from 'antd';

class ContasPagar extends FrmCadPadrao {

  state = {
    qdeRegistros: 1,
    listaCategorias: [],
    nmsubcategoriaSearch: "",
    selectLoading: false,
    selectedRows: [],
    contasFixasSelectedRows: [],
    contasFixasVisible: false,
    contasFixasLista: [],
    filtros: [{ campo: 'fin.contaspagar.ativo', valor: true }]
  }

  constructor() {
    super();
    this.modeloNovo = { id: "", nmcontaspagar: "", contaspagarsubcategoria_id: null };
    this.cNomeCampoChave = "id";
    this.cNomeCampoDescricao = "nmcontaspagar";
    this.URL_API_DELETE = "/fin/contaspagardelete/";
    this.URL_API_GETDATA = "/fin/contaspagarpag";
    this.URL_API_SAVE = "/fin/contaspagarsave";
  }

  colunas = [
    {
      title: 'Descrição',
      dataIndex: 'nmcontaspagar',
      key: 'nmcontaspagar',
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
      title: 'Vencimento',
      key: 'dtvencimento',
      render: (record) => (
        <span>
          {utils.getFormatedDate(record.dtvencimento)}
        </span>
      ),
    },
    {
      title: 'Dt. Pag.',
      dataIndex: 'dtpagamento',
      key: 'dtpagamento',
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
      title: 'Pago',
      key: 'ispago',
      align: 'center',
      width: 80,
      render: (record) => (
        <span>
          <Tag color={record.ispago ? 'blue' : 'volcano'}>
            {record.ispago ? 'Sim' : 'Não'}
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
      path: '/financeiro/contaspagar',
      breadcrumbName: 'Contas a Pagar',
    }
  ];

  //  Pesquisa
  pesquisaSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(['pesqDescricao', 'pesqCategoria', 'pesqSubCategoria', 'pesqPagos'], async (err, values) => {
      if (!err) {
        let filtros = [];
        if (values.pesqDescricao) {
          filtros.push({ campo: 'nmcontaspagar', valor: values.pesqDescricao, operador: 'LIKE' });
        }
        if (values.pesqCategoria) {
          filtros.push({ campo: 'nmcontaspagarcategoria', valor: values.pesqCategoria, operador: 'LIKE' });
        }
        if (values.pesqSubCategoria) {
          filtros.push({ campo: 'nmcontaspagarsubcategoria', valor: values.pesqSubCategoria, operador: 'LIKE' });
        }
        if (values.pesqPagos != "2") {
          filtros.push({ campo: 'fin.contaspagar.ispago', valor: values.pesqPagos == "1" });
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
    if (await this.getSalvar(['nmcontaspagar', 'contaspagarsubcategoria_id', 'valor',
      'valorCurrency', 'dtvencimento', 'ispago', 'observacoes', 'dtpagamento', 'ativo'])) {
      this.getCancelar();
    }
  }

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

  beforeAlterar = (registro) => {
    if (registro.dtvencimento) {
      registro.dtvencimento = new Moment(registro.dtvencimento);
    }
    if (registro.dtpagamento) {
      registro.dtpagamento = new Moment(registro.dtpagamento);
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

  getBaixar = () => {
    console.log('getBaixar')
  }

  rowSelection = {
    onChange: (selectedRows) => {
      this.setState({ selectedRows });
    }
  };

  // Contas Fixas
  afterComponentDidMount = async () => {
    try {
      this.setLoading(true);
      const res = await api.get('/fin/contaspagarfixas');
      console.log(res);
      this.setState({
        contasFixasLista: res.data,
      });
    } catch (err) {
      console.log(err.response.data.msg);
    } finally {
      this.setLoading(false);
    }
  }

  contasFixasColunas = [
    {
      title: 'Descrição',
      dataIndex: 'nmcontaspagarfixas',
      key: 'nmcontaspagarfixas',
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      width: 100,
      editable: true,
      render: (text) => (
        <span>
          {utils.numberToReal(parseFloat(text))}
        </span>)
    },
  ]

  contasFixasRowSelection = {
    onChange: (selectedRows) => {
      this.setState({ contasFixasSelectedRows: selectedRows });
    }
  };

  openContasFixas = () => {
    this.setState({ contasFixasVisible: true });
  }

  closeContasFixas = e => {
    this.setState({ contasFixasVisible: false });
  };




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
            <Menu.SubMenu

              title={<span><Icon type="control" /><span>Opções</span></span>}>
              <Menu.Item disabled={this.state.selectedRows.length === 0}>
                <a href="#" onClick={this.getBaixar.bind(this)}>
                  <span><Icon type="dollar" /><span>Baixar</span></span>
                </a>
              </Menu.Item>
              <Menu.Item>
                <a href="#" onClick={this.openContasFixas.bind(this)}>
                  <span><Icon type="reconciliation" /><span>Contas Fixas</span></span>
                </a>
              </Menu.Item>
            </Menu.SubMenu>
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
                    {getFieldDecorator('nmcontaspagar', {
                      rules: [{ required: true, message: 'Informe a descrição!' }],
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item
                    label={<span>Data Venc.</span>}>
                    {getFieldDecorator('dtvencimento', {
                      rules: [{ required: true, message: 'Informe !' }],
                    })(<DatePicker format='DD/MM/YYYY' />)}
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
                    label={<span>Observações</span>}>
                    {getFieldDecorator('observacoes', {})
                      (<Input.TextArea rows={4} />)}
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
            rowSelection={this.rowSelection}
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

          <Modal
            title="Contas Fixas"
            visible={this.state.contasFixasVisible}
            onCancel={this.closeContasFixas}
            footer={[
              <Button
                type="default"
                onClick={this.closeContasFixas}
                key="cancelar"
                icon="close">
                Cancelar
              </Button>,
              <Button type="primary"
                htmlType="submit"
                key="submit"
                form='frmContasFixas'
                icon="check">
                Confirmar
              </Button>
            ]}>

            <Table
              showHeader={false}
              pagination={false}
              rowSelection={this.contasFixasRowSelection}
              locale={{ emptyText: 'Nenhum registro encontrado' }}
              rowKey='id'
              size='small'
              bordered={true}
              columns={this.contasFixasColunas}
              dataSource={this.state.contasFixasLista}
            />


          </Modal>

        </MizuneMasterPage>
      </>
    )
  }
}

export default Form.create()(ContasPagar);
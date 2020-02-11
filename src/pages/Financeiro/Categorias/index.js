import React, { Component } from 'react';
import api from '../../../services/api';
import FrmPadrao from '../../../padrao/frmPadrao';
import MizuneMasterPage from '../../../components/Mizune/MasterPage';
import {
  List, Table, Tag, Popconfirm, Collapse, Tabs, Form,
  Input, Row, Col, Menu, Button, Icon, Checkbox, Modal,
  Radio, Spin
} from 'antd';
import Highlighter from 'react-highlight-words';

function Itemdetalhe(props) {
  return <List
    size="small"
    itemLayout="horizontal"
    dataSource={props.registro}
    renderItem={item => (
      <List.Item>
        <List.Item.Meta description={item.nmcontaspagarsubcategoria} />
      </List.Item>
    )}
  />
}



class FinCategorias extends FrmPadrao {

  cNomeCampoChave = "id";
  cNomeCampoDescricao = "nmcontaspagarcategoria";
  sortColumn = "id";
  sortOrder = "asc";
  searchText = "";
  searchedColumn = "";
  paginaAtual = 1;
  qdePorPag = 10;
  ativos = 1; // 1 = sim, 0 = não, 2 = todos

  state = {
    listaRegistros: [],
    qdeRegistros: 1,
    registroSelecionado: null,
    activeKey: "",
    tabActiveKey: "",
    subSelecionado: null,
    pesquisaVisible: false,

    filtros: [{ campo: "ativo", valor: true }]
  }

  componentDidMount() {
    this.getData();
  }

  getDescricaoAreaEdicao() {
    let reg = this.state.registroSelecionado;
    if (reg) {
      if (reg[this.cNomeCampoChave]) {
        return "Alterando: " + reg[this.cNomeCampoChave] + ' - ' + reg[this.cNomeCampoDescricao];
      } else {
        return "Novo Registro";
      }
    } else {
      return "";
    }
  }


  async getSalvarCategoria() {

    console.log('getSalvarCategoria');
    let ret = true;
    let categoria = null;
    try {
      this.setLoading(true);
      this.props.form.validateFieldsAndScroll(['nmcontaspagarcategoria', 'ativo'], (err, values) => {
        if (err) {
          ret = false;
        } else {
          categoria = this.state.registroSelecionado;
          this.getCopyData(values, categoria);
        }
      });

      // Validando possivel lançamento no secundário
      let erroSub = false;
      if (this.state.subSelecionado) {
        this.props.form.validateFields(['nmcontaspagarsubcategoria'], (err, values) => {
          if (err) {
            erroSub = true;
          }
        });
      }
      if (erroSub) {
        this.setState({ tabActiveKey: "2" });
        ret = false;
      }

      if (ret) {
        let res = await api.post('/fin/savecontaspagarcategoria', categoria);
        console.log(res.data);
        this.setState({ registroSelecionado: res.data });
        if (!categoria.id) {
          // Novo Registro
          // Insere na gride
          let gride = this.state.listaRegistros;
          gride.push(res.data);
          this.setState({ listaRegistros: gride });
        }
      }
      return ret;
    } catch (err) {
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  submitSubCategoria = (e) => {
    e.preventDefault();
    this.props.form.validateFields(['nmcontaspagarsubcategoria'], (err, values) => {
      if (!err) {
        let categoria = this.state.registroSelecionado;
        let subSel = this.state.subSelecionado;
        // Checo se a Sub Categoria já existe na lista
        let subcategoria = categoria.contaspagarsubcategoria.find(el => {
          return el.id == subSel.id;
        });
        //if (Object.entries(subSel).length > 0) {
        if (subcategoria) {
          // Se encontrar na lista, atualizo
          subcategoria.nmcontaspagarsubcategoria = values.nmcontaspagarsubcategoria;
        } else {
          subSel.nmcontaspagarsubcategoria = values.nmcontaspagarsubcategoria;
          categoria.contaspagarsubcategoria.push(subSel);
          this.setState({
            registroSelecionado: categoria
          });
        }
        this.props.form.resetFields(['nmcontaspagarsubcategoria']);
        this.setState({ subSelecionado: null });
      }
    })
  }

  //  SUBMIT
  submitCategoria = (e) => {
    e.preventDefault();
    if (this.getSalvarCategoria()) {
      this.getCancelar();
    }
    
  }

  deletePrincipalHandle(id) {

    try {
      api.delete('/fin/excluirCategoria/' + id)
        .then(result => {
          let tmp = this.state.listaRegistros.filter(function (e) {
            return e.id !== id;
          });
          this.setState({ listaRegistros: tmp });
          console.log(result);
        }
        );
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
    finally {

    }
  }

  deleteDetalheHandle(id) {
    console.log("delete> " + id);

    try {
      let categoria = this.state.registroSelecionado;
      let subcategoria = categoria.contaspagarsubcategoria.find(el => {
        return el.id == id;
      });
      // Removendo Sub da array     
      let idx = categoria.contaspagarsubcategoria.indexOf(subcategoria);
      if (idx == -1) {
        throw new Error('Não localizou o index da sub-categoria');
      }
      categoria.contaspagarsubcategoria.splice(idx, 1);
      this.setState({ registroSelecionado: categoria });
    } catch (error) {
      console.log(error.message);
    }
    finally {

    }
  }

  /*  painelEdicaoChangeHandle = (key) => {
     if (key == "") {
       this.areaEdicaoFechar();
     } else {
       this.areaEdicaoAbrir();
     }
   } */

  openCollapse = () => this.setState({ activeKey: "1" });
  closeCollapse = () => this.setState({ activeKey: "" });

  getNovo = () => {
    this.setState({
      registroSelecionado: { id: "", nmcontaspagarcategoria: "", contaspagarsubcategoria: [], ativo: true },
      tabActiveKey: "1"
    });
    this.props.form.resetFields();
    this.openCollapse();
  }

  getCancelar = () => {
    this.setState({
      registroSelecionado: null,
    });
    this.closeCollapse();
  }

  getCancelarSub = () => {
    this.setState({ subSelecionado: null });
    this.props.form.resetFields(['nmcontaspagarsubcategoria']);
  }

  alterarHandle(registro) {
    console.log(registro);
    this.props.form.setFieldsValue({
      ...registro
    });
    this.setState({
      registroSelecionado: registro,
      subSelecionado: null,
    }, () => {
      this.openCollapse();
      this.setState({ tabActiveKey: "1" });
    });
  }

  alterarDetalhe(registro) {
    this.props.form.setFieldsValue({
      nmcontaspagarsubcategoria: registro.nmcontaspagarsubcategoria
    });
    this.setState({
      subSelecionado: { id: registro.id, nmcontaspagarsubcategoria: registro.nmcontaspagarsubcategoria },
    }, () => {
      console.log(this.state.subSelecionado);
    });
  }

  novaSubCategoria() {
    this.setState({ subSelecionado: { id: new Date().getTime(), nmcontaspagarsubcategoria: "", ativo: true } });
  }

  /*   async getData() {
      try {
        this.setState({ loading: true });
        const str = `/fin/contaspagarcategoria`;
        const res = await api.get(str);
        this.setState({
          listaRegistros: res.data
        });
        console.log(res.data);
      } catch (err) {
        console.log(err.response.data.msg);
      } finally {
        this.setState({ loading: false });
      }
    } */

  tabDetalhesChangeHandle = async (selectedkey) => {
    // Só vou chamar o método se for novo registro
    if ((selectedkey == "2") && (!this.state.registroSelecionado.id)) {
      if (!await this.getSalvarCategoria()) {
        return;
      }
    }
    this.setState({ tabActiveKey: selectedkey });
  };

  onTableChange = (pagination, filters, sorter) => {
    console.log(filters);
    if ((filters.ativo) && (filters.ativo.length === 1)) {
      this.ativos = filters.ativo[0] ? 1 : 0;
    } else {
      this.ativos = 2;
    }

    this.paginaAtual = pagination.current;
    this.qdePorPag = pagination.pageSize;
    this.sortColumn = (typeof sorter.field == 'undefined') ? "id" : sorter.field;
    this.sortOrder = sorter.order === "descend" ? "desc" : "asc";
    this.getData();
  }

  async getData() {
    try {
      let obj = { xesque: 1, sss: 3333 };


      let vParams = {
        pag: this.paginaAtual,
        qde: this.qdePorPag,
        sortColumn: this.sortColumn,
        sortOrder: this.sortOrder,
        searchedColumn: this.searchedColumn,
        searchText: this.searchText,
        ativos: this.ativos,
        filtros: this.state.filtros
      }

      /*const str = `/fin/categoriaspag?pag=${this.paginaAtual}&qde=${this.qdePorPag}
        &sortColumn=${this.sortColumn}&sortOrder=${this.sortOrder}&searchedColumn=${this.searchedColumn}
        &searchText=${this.searchText}&ativos=${this.ativos}`;
      */

      const str = `/fin/categoriaspag`;



      const res = await api.get(str, {
        params: vParams,
        data: vParams
      });

      console.log(res);
      this.setState({
        listaRegistros: res.data.data,
        qdeRegistros: parseInt(res.data.total)
      });
    } catch (err) {
      console.log(err.response.data.msg);
    } finally {

    }
  }



  //  Pesquisa
  abrirPesquisa = () => {
    this.setState({ pesquisaVisible: true });
  }
  pesquisaCancelar = e => {
    console.log(e);
    this.setState({ pesquisaVisible: false });
  };
  pesquisaSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(['pesqCategoria', 'pesqSubCategoria', 'pesqAtivos'], async (err, values) => {
      if (!err) {
        let filtros = [];
        if (values.pesqCategoria) {
          filtros.push({ campo: 'nmcontaspagarcategoria', valor: values.pesqCategoria, operador: 'LIKE' });
        }
        if (values.pesqSubCategoria) {
          filtros.push({ campo: 'nmcontaspagarsubcategoria', valor: values.pesqSubCategoria, operador: 'LIKE' });
        }
        if (values.pesqAtivos != "2") {
          filtros.push({ campo: 'ativo', valor: values.pesqAtivos == "1" });
        }
        this.setState({ pesquisaVisible: false, filtros }, () => {
          this.getData();
        });
      }
    });
  }



  render() {

    const columnsDetalhe = [
      {
        key: 'nmcontaspagarsubcategoria',
        dataIndex: 'nmcontaspagarsubcategoria',
      },
      {
        key: 'options',
        render: (record) => (
          <span>
            <Tag color='blue' >
              <a href="#" onClick={() => { this.alterarDetalhe(record); }}>
                Alterar
              </a>
            </Tag>
            <Tag color='volcano' >
              <Popconfirm
                title="Confirma a exclusão deste registro?"
                onConfirm={() => { this.deleteDetalheHandle(record.id); }}
                okText="Sim"
                cancelText="Não">
                <a href="#">Excluir</a>
              </Popconfirm>
            </Tag>
          </span>
        ),
      },
    ]

    const columns = [
      {
        title: '#',
        dataIndex: 'id',
        key: 'id',
        render: text => <b>{text}</b>,
      },
      {
        title: 'Categoria',
        dataIndex: 'nmcontaspagarcategoria',
        key: 'nmcontaspagarcategoria',
        sorter: true
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
      },
      {
        title: 'Opções',
        key: 'options',
        align: 'center',
        width: 180,
        render: (record) => (
          <span>
            <Tag color='blue' >
              <a href="#" onClick={() => { this.alterarHandle(record); }}>
                Alterar
              </a>
            </Tag>
            <Tag color='volcano' >
              <Popconfirm
                title="Confirma a exclusão desta categoria?"
                onConfirm={() => { this.deletePrincipalHandle(record.id); }}
                okText="Sim"
                cancelText="Não">
                <a href="#">Excluir</a>
              </Popconfirm>
            </Tag>
          </span>
        ),
      },
    ];

    const { getFieldDecorator } = this.props.form;

    return (
      <>
        <MizuneMasterPage>

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
                disabled={!this.state.registroSelecionado}
              >
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


          <Collapse activeKey={this.state.activeKey} onChange={this.painelEdicaoChangeHandle} >
            <Collapse.Panel showArrow={false} header={this.getDescricaoAreaEdicao()} key="1">
              <Tabs defaultActiveKey="1" size="small" activeKey={this.state.tabActiveKey} onChange={this.tabDetalhesChangeHandle}>
                <Tabs.TabPane tab="Dados" key="1">
                  <Form id="frmPrincipal" {...this.layoutSideBySyde} onSubmit={this.submitCategoria} contextMenu="" >
                    <Form.Item
                      label={<span>Categoria</span>}>
                      {getFieldDecorator('nmcontaspagarcategoria', {
                        rules: [{ required: true, message: 'Informe o nome da Categoria!' }],
                      })(<Input />)}
                    </Form.Item>
                    <Form.Item
                      label={<span>Ativo</span>}>
                      {getFieldDecorator('ativo', {
                        initialValue: true,
                        valuePropName: 'checked'
                      })(<Checkbox />)}
                    </Form.Item>
                  </Form>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Detalhe" key="2" >
                  <Row>
                    <Col span={12}>
                      <Table
                        locale={{ emptyText: 'Nenhum registro encontrado' }}
                        rowKey='id'
                        scroll={{ y: 200 }}
                        size='small'
                        bordered={true}
                        columns={columnsDetalhe}
                        pagination={false}
                        showHeader={false}
                        dataSource={this.state.registroSelecionado ? this.state.registroSelecionado.contaspagarsubcategoria : []}
                      />
                    </Col>
                    <Col span={11} style={{ marginLeft: '10px', height: '200px', borderLeft: '1px dotted gray' }}>
                      <Form id="frmSubCategoria" {...this.lyMeiaTela} onSubmit={this.submitSubCategoria} contextMenu="" >
                        <Menu mode="horizontal">
                          <Menu.Item disabled={this.state.subSelecionado}>
                            <a href="#" onClick={this.novaSubCategoria.bind(this)}>
                              <Icon type="diff" />
                              Novo
                            </a>
                          </Menu.Item>
                          <Menu.Item>
                            <Button type="link"
                              htmlType="submit"
                              icon="save"
                              form="frmSubCategoria"
                              disabled={!this.state.subSelecionado}>
                              Salvar
                          </Button>
                          </Menu.Item>
                          <Menu.Item disabled={!this.state.subSelecionado}>
                            <a href="#"
                              onClick={this.getCancelarSub.bind(this)}>
                              <Icon type="close" />
                              Cancelar
                            </a>
                          </Menu.Item>
                        </Menu>
                        <Form.Item
                          label={<span>Sub Categoria</span>}>
                          {getFieldDecorator('nmcontaspagarsubcategoria', {
                            rules: [{ required: true, message: 'Informe o nome da Sub Categoria!' }],
                          })(<Input disabled={!this.state.subSelecionado} />)}
                        </Form.Item>
                      </Form>
                    </Col>
                  </Row>
                </Tabs.TabPane>
              </Tabs>

            </Collapse.Panel>
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
            columns={columns}
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
                key="cancelar">
                Cancelar
              </Button>,
              <Button type="primary"
                htmlType="submit"
                key="submit"
                form='frmPesquisa'>
                Pesquisar
              </Button>
            ]}
          >

            <Form id="frmPesquisa" {...this.layoutSideBySyde} onSubmit={this.pesquisaSubmit} contextMenu="" >
              <Form.Item
                label={<span>Categoria</span>}>
                {getFieldDecorator('pesqCategoria')(<Input />)}
              </Form.Item>
              <Form.Item
                label={<span>Sub-Categ.</span>}>
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



    );
  }
}

export default Form.create()(FinCategorias);
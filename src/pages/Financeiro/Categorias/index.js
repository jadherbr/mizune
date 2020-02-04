import React, { Component } from 'react';
import api from '../../../services/api';
import FrmPadrao from '../../../padrao/frmPadrao';
import MizuneMasterPage from '../../../components/Mizune/MasterPage';
import {
  List, Table, Tag, Popconfirm, Collapse, Tabs, Form,
  Input, Row, Col, Menu, Button, Icon, Checkbox
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
    loading: false,
    listaRegistros: [],
    qdeRegistros: 1,
    registroSelecionado: null,
    activeKey: "",
    tabActiveKey: "",
    descricaoAreaEdicao: "",
    subSelecionado: null
  }

  componentDidMount() {
    this.getData();
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
    this.props.form.validateFieldsAndScroll(['nmcontaspagarcategoria', 'ativo'], async (err, values) => {
      if (!err) {
        try {
          let registroSelecionado = this.state.registroSelecionado;
          this.getCopyData(values, registroSelecionado);
          //this.setState({ loading: true });
          let response = null;

          response = await api.post('/fin/salvarcategoria/', registroSelecionado);
          console.log(response);
          return;


          if (typeof values.id == 'undefined') {
            response = await api.post(this.URL_API_NEW, values);
          } else {
            response = await api.put(this.URL_API_ALTER + values.id, values);
          }
          if (response.status === 200) {
            this.getMessageSuccess("Salvo com sucesso!");
            this.getData();
          } else {
            this.getMessageError(response.statusText);
          }
          console.log(response);
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
          this.getCancelar();
        }
      }
    });
  }

  deletePrincipalHandle(id) {
    this.setState({ loading: true });
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
      this.setState({ loading: false });
    }
  }

  deleteDetalheHandle(id) {
    console.log("delete> " + id);
    this.setState({ loading: true });
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
      this.setState({ loading: false });
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
      descricaoAreaEdicao: "Novo Registro",
      tabActiveKey: "1"
    });
    this.props.form.resetFields();
    this.openCollapse();
  }

  getCancelar = () => {
    this.setState({
      registroSelecionado: null,
      descricaoAreaEdicao: ""
    });
    this.closeCollapse();
  }

  alterarHandle(registro) {
    console.log(registro);
    this.props.form.setFieldsValue({
      ...registro
    });
    this.setState({
      registroSelecionado: registro,
      subSelecionado: null,
      descricaoAreaEdicao: "Alterando: " + registro[this.cNomeCampoChave] + ' - ' + registro[this.cNomeCampoDescricao]
    }, () => {
      this.openCollapse();
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
    this.setState({ subSelecionado: { id: new Date().getTime(), nmcontaspagarsubcategoria: "" } });
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

  tabDetalhesChangeHandle = (selectedkey) => {
    this.setState({ tabActiveKey: selectedkey });
  };

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    this.searchText = selectedKeys[0];
    this.searchedColumn = dataIndex;
    console.log(selectedKeys);
    confirm();
  };

  handleReset = clearFilters => {
    this.searchText = "";
    clearFilters();
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={'Buscar'}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}>
          Buscar
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Limpar
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text
        ),
  });




  onTableChange = (pagination, filters, sorter) => {
    console.log("TableChange >>  ")
    //console.log(pagination);
    console.log(filters);
    //console.log(sorter);

    //

    if (filters.ativo.length === 1) {
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
      this.setState({ loading: true });
      const str = `/fin/categoriaspag?pag=${this.paginaAtual}&qde=${this.qdePorPag}
        &sortColumn=${this.sortColumn}&sortOrder=${this.sortOrder}&searchedColumn=${this.searchedColumn}
        &searchText=${this.searchText}&ativos=${this.ativos}`;
      const res = await api.get(str);
      console.log(res);
      this.setState({
        listaRegistros: res.data.data,
        qdeRegistros: parseInt(res.data.total)
      });
    } catch (err) {
      console.log(err.response.data.msg);
    } finally {
      this.setState({ loading: false });
    }
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
        sorter: true,
        ... this.getColumnSearchProps('nmcontaspagarcategoria'),
      },

      {
        title: 'Ativo',
        key: 'ativo',
        align: 'center',
        defaultFilteredValue: [true],
        width: 80,
        filters: [{ text: 'Sim', value: true }, { text: 'Não', value: false }],
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
                loading={this.state.loading}>
                Salvar
              </Button>
            </Menu.Item>
            <Menu.Item disabled={!this.state.registroSelecionado}>
              <a href="#" onClick={this.getCancelar.bind(this)}>
                <Icon type="close" />
                Cancelar
              </a>
            </Menu.Item>
          </Menu>

          <Collapse activeKey={this.state.activeKey} onChange={this.painelEdicaoChangeHandle} >
            <Collapse.Panel showArrow={false} header={this.state.descricaoAreaEdicao} key="1">
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
                <Tabs.TabPane tab="Detalhe" key="2">
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
                              Novo
                            </a>
                          </Menu.Item>
                          <Menu.Item disabled={!this.state.subSelecionado}>
                            <Button type="link"
                              htmlType="submit"
                              disabled={!this.state.subSelecionado}
                              loading={this.state.loading}>
                              Salvar
                          </Button>
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



        </MizuneMasterPage>
      </>

    );
  }
}

export default Form.create()(FinCategorias);
import React from 'react';
import api from '../../../services/api';
import MizuneMasterPage from '../../../components/Mizune/MasterPage';
import FrmCadPadrao from '../../../padrao/frmCadPadrao';
import { Form, Table, Tag, Input, InputNumber, Button, Popconfirm, Collapse, Select } from 'antd';

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
    this.cNomeCampoChave = "id";
    this.cNomeCampoDescricao = "nmmunicipio";
    this.URL_API_DELETE = "/gen/excluirmunicipio/";
    this.URL_API_GETDATA = "/gen/municipios";
    this.URL_API_NEW = "/gen/novomunicipio/";
    this.URL_API_ALTER = "/gen/alterarmunicipio/";
  }

  componentDidMount() {
    this.getData();
    this.getEstadoSelect();
  }

  areaEdicaoDepoisDeFechar = () => {
    this.estadoSelectChangeHandle("");
  }

  areaEdicaoAntesDeAbrir = () => {
    console.log(this.state.registroSelecionado);
    if ((typeof this.state.registroSelecionado != 'undefined') && (this.state.registroSelecionado != null)) {
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

  render() {

    const columns = [
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
        ... this.getColumnSearchProps('nmmunicipio'),
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
        ... this.getColumnSearchProps('uf'),
      },
      {
        title: 'CEP Padrão',
        dataIndex: 'ceppadrao',
        key: 'ceppadrao',
      },
      {
        title: 'Opções',
        key: 'options',
        render: (record) => (
          <span>
            <Tag color='blue' >
              <a href="#" onClick={() => { this.alterarHandle(record); }}>
                Alterar
              </a>
            </Tag>
            <Tag color='volcano' >
              <Popconfirm
                title="Confirma a exclusão deste município?"
                onConfirm={() => { this.tableDeleteHandle(record.id); }}
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
        <MizuneMasterPage tituloCabecalho='titulo inicial'>
          <Collapse activeKey={this.state.activeKey} onChange={this.painelEdicaoChangeHandle}>
            <Collapse.Panel header={this.state.descricaoAreaEdicao} key="1">
              <Form {...this.layoutSideBySyde} onSubmit={this.handleSubmit} contextMenu="" >

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

                <Form.Item {...this.Layout2ColsEm1}>
                  <Button type="primary"
                    htmlType="submit"
                    disabled={this.state.loading}
                    loading={this.state.loading}>
                    Salvar
                  </Button>
                </Form.Item>
              </Form>
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
            loading={this.state.loading}
            columns={columns}
            dataSource={this.state.listaRegistros}
            onChange={this.onTableChange}

          />
        </MizuneMasterPage>
      </>
    )
  }
}

export default Form.create()(Municipios);
import React from 'react';
import FrmPadrao from './frmPadrao';
import api from '../services/api';
import { Input, Button, Icon } from 'antd';
import Highlighter from 'react-highlight-words';

export default class FrmCadPadrao extends FrmPadrao {

    cNomeCampoChave = "";
    cNomeCampoDescricao = "";
    sortColumn = "id";
    sortOrder = "asc";
    searchText = "";
    searchedColumn = "";
    paginaAtual = 1;
    qdePorPag = 10;

    state = {
        listaRegistros: [],
        loading: false,
        activeKey: "",
        registroSelecionado: null,
    }

    constructor() {
        super();
    }

    areaEdicaoDepoisDeFechar = () => { } // Para usar nos Childs

    //  SUBMIT
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                try {
                    this.setState({ loading: true });
                    let response = null;
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
                    this.areaEdicaoFechar();
                }
            }
        });
    }

    painelEdicaoChangeHandle = (key) => {
        if (key == "") {
            this.areaEdicaoFechar();
        } else {
            this.areaEdicaoAbrir();
        }
    }

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        this.searchText = selectedKeys[0];
        this.searchedColumn = dataIndex;
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

    alterarHandle(registro) {
        console.log(registro);
        // Aqui ocorre um warning caso tenha mais campos no objeto do que no form
        this.props.form.setFieldsValue({
            ...registro
        });
        this.setState({
            registroSelecionado: registro,
            descricaoAreaEdicao: "Alterando: " + registro[this.cNomeCampoChave] + ' - ' + registro[this.cNomeCampoDescricao]
        }, () => {
            this.areaEdicaoAbrir();
        });
    }

    areaEdicaoAbrir = () => {
        this.areaEdicaoAntesDeAbrir();
        this.setState({ activeKey: "1" });
    }

    areaEdicaoFechar = () => {
        this.setState({
            registroSelecionado: null,
            descricaoAreaEdicao: "Novo Registro",
            activeKey: ""
        });
        this.props.form.resetFields();
        this.areaEdicaoDepoisDeFechar();
    };

    onTableChange = (pagination, filters, sorter) => {
        this.paginaAtual = pagination.current;
        this.qdePorPag = pagination.pageSize;
        this.sortColumn = (typeof sorter.field == 'undefined') ? "id" : sorter.field;
        this.sortOrder = sorter.order === "descend" ? "desc" : "asc";
        this.getData();
    }

    async getData() {
        try {
            this.setState({ loading: true });
            const str = `${this.URL_API_GETDATA}?pag=${this.paginaAtual}&qde=${this.qdePorPag}
            &sortColumn=${this.sortColumn}&sortOrder=${this.sortOrder}&searchedColumn=${this.searchedColumn}
            &searchText=${this.searchText}`;
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

    tableDeleteHandle(id) {
        this.setState({ loading: true });
        try {
            api.delete(this.URL_API_DELETE + id)
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

}
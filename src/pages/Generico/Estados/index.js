import React from 'react';
import api from '../../../services/api';
import MasterPage from '../../../components/Mizune/MasterPage';
import FrmPadrao from '../../../padrao/frmPadrao';
import { Spinner, Card, Button, Breadcrumb, Table, thead, tr, td, th, Badge } from 'react-bootstrap';
import { Form, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';

var qdePorPag = 10;
var paginaAtual = 1;

class Estados extends FrmPadrao {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            estados: [],
            retorno: null,
            qdeRegistros: 0
        }
        this.PaginationPageChange = this.PaginationPageChange.bind(this);
    }

    PaginationPageChange(page) {
        paginaAtual = page;
        this.getData();
    }

    async getData() {
        try {
            let res = await api.get(`/gen/estados?qdePorPag=${qdePorPag}&paginaAtual=${paginaAtual}`);
            this.setState({
                estados: res.data.data,
                qdeRegistros: res.data.total,
                retorno: res.data
            })
        } finally {
            this.setState({ loading: false });
        }
    }

    componentDidMount() {
        this.getData();       
    }

    doConfirm(id) {
        this.setState({ loading: true });
        try {
            api.delete(`/excluirmateria/${id}`)
                .then(result => {
                    let tmp = this.state.materias.filter(function (e) {
                        return e.id !== id;
                    });
                    this.setState({ materias: tmp });
                }
                );
        } finally {
            this.setState({ loading: false });
        }
    }




    render() {

        return (
            <MasterPage tituloCabecalho='titulo inicial'>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Início</Breadcrumb.Item>
                    <Breadcrumb.Item active>Matérias</Breadcrumb.Item>
                </Breadcrumb>
                <Card>
                    <Card.Header>
                        <Link to={'/admin/materias/cadastrar'}>
                            <Button>Cadastrar Matéria</Button>
                        </Link>
                    </Card.Header>
                    <Card.Body>
                        {this.state.estados.length === 0 ? 'Nenhum estado cadastrado' : null}

                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr >
                                    <th>#</th>
                                    <th>Estado</th>
                                    <th>UF</th>
                                    <th>Cd.IBGE</th>
                                    <th>Brasão</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.loading ? <Spinner animation="border" /> :
                                    this.state.estados.map((estado, k) =>
                                        <tr key={k}>
                                            <td>{estado.id}</td>
                                            <td>{estado.nmestado}</td>
                                            <td>{estado.uf}</td>
                                            <td>{estado.cdibge}</td>
                                            <td>{estado.brasao}</td>
                                            <td>
                                                <a href="#">
                                                    <Badge variant="warning">Alterar</Badge>
                                                </a>
                                                &nbsp;
                                                <Popconfirm
                                                    title="Confirma a exclusão deste registro?"
                                                    onConfirm={() => { this.doConfirm(estado.id); }}
                                                    okText="Sim"
                                                    cancelText="Não">
                                                    <a href="#">
                                                        <Badge variant="danger">Excluir</Badge>
                                                    </a>
                                                </Popconfirm>
                                            </td>
                                        </tr>
                                    )}
                            </tbody>
                        </Table>

                        
                    </Card.Body>
                </Card>
            </MasterPage>
        );
    }
}

export default Form.create()(Estados);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Icon } from 'antd';
import './NavBarST.css';

class NavbarST extends Component {

  render() {
    const { user } = this.props; //Redux
    const isAuthenticated = user.email !== "";

    return (
      <div className="xesque">

        <div className="logo"><a href="/">Mizune Sistemas</a></div>

        <Menu mode="horizontal">
          {isAuthenticated ? (
            <Menu.SubMenu title={<span><Icon type="form" /><span>Cadastros</span></span>}>
              <Menu.Item><a href="/financeiro/categorias">Categorias</a></Menu.Item>
              <Menu.Item><a href="/financeiro/contasfixas">Contas Fixas</a></Menu.Item>
              <Menu.SubMenu title={<span>Tabelas</span>}>
                <Menu.Item><a href="/gen/estados">Estados</a></Menu.Item>
                <Menu.Item><a href="/gen/municipios">Municípios</a></Menu.Item>
                <Menu.Item><a href="/gen/bairros">Bairros</a></Menu.Item>
              </Menu.SubMenu>
            </Menu.SubMenu>
          ) : null}
          {isAuthenticated ? (
            <Menu.SubMenu title={<span><Icon type="solution" /><span>Movimentações</span></span>}>
              <Menu.Item><a href="/financeiro/contaspagar">Contas a Pagar</a></Menu.Item>
            </Menu.SubMenu>
          ) : null}
        {isAuthenticated ? (
          <Menu.SubMenu title={<span><Icon type="user" /><span>{user.username}</span></span>}
            style={{ float: 'right' }}>
            <Menu.Item><a href="/alterarsenha"><Icon type="edit" />Alterar Senha</a></Menu.Item>
            <Menu.Item><a href="/logout"><Icon type="logout" />Deslogar</a></Menu.Item>
          </Menu.SubMenu>
        ) : null}
        </Menu>
      </div >
    );
  }
}

const mapStateToProps = store => ({
  user: store.loggedUser.user
});

export default connect(mapStateToProps)(NavbarST);
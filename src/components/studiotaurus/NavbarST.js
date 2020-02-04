import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

class NavbarST extends Component {

  render() {
    const { user } = this.props; //Redux
    const isAuthenticated = user.email !== "";

    var style = {
      'maxWidth': 950,
      'marginRight': 'auto',
      'marginLeft': 'auto',
      'lineHeight': '1'
    }

    return (
      <>
        <Navbar bg="dark" variant="dark" className="mb-2">
          <Container style={style}>
            <Navbar.Brand href="/">Studio Taurus</Navbar.Brand>
            <Nav className="mr-auto">
            </Nav>
            <Nav>
              {isAuthenticated ? ( 
                <>
                  <NavDropdown title="Site" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/admin/configuracao">Configuração</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/admin/atividades">Atividades</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/admin/videos">Videos</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/admin/materias">Materias</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/admin/parceiros">Parceiros</NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown title={user.username} id="basic-nav-dropdown">
                    <NavDropdown.Item href="/alterarsenha">Alterar Senha</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/logout">Deslogar</NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : <Nav.Link href="/login">Logar</Nav.Link>
              }
            </Nav>
          </Container>
        </Navbar>
      </>
    );
  }
}

const mapStateToProps = store => ({
  user: store.loggedUser.user
});

export default connect(mapStateToProps)(NavbarST);
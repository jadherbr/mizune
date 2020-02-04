import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Inicial from './pages/inicial';
import Login from './pages/login/login';
import Logout from './pages/login/logout';
import AlterarSenha from './pages/login/alterarsenha';
import { isAuthenticated } from './services/auth';
import FinanceiroInicial from './pages/Financeiro/Inicial';
import FinCategorias from './pages/Financeiro/Categorias';
import Estados from './pages/Generico/Estados';
import Municipios from './pages/Generico/Municipios';


const isAuth = isAuthenticated();

const Routes = () => (  
  <>  
  <BrowserRouter>
    <Switch>
    <Route exact path="/" component={Inicial}/>
    <Route exact path="/login" component={Login}/>    
    
    {isAuth ? (
      <>
      <Route exact path="/financeiro" component={FinanceiroInicial}/>
      <Route exact path="/financeiro/categorias" component={FinCategorias}/>
      <Route exact path="/logout" component={Logout}/>
      <Route exact path="/alterarsenha" component={AlterarSenha}/>

      <Route exact path="/gen/estados" component={Estados}/>
      <Route exact path="/gen/municipios" component={Municipios}/>
      </>
    ):''}
    
    </Switch>
  </BrowserRouter>
  </>
);

export default Routes;

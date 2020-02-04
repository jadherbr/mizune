import React from "react";
import { logout } from "../../services/auth";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Creators as loggedUserActions } from '../../store/reducers/loggedUser';

class Logout extends React.Component {

  componentDidMount () {
    logout();
    this.props.updateUser({ 'username':' ', 'email': '' }); // Redux
    this.props.history.push("/");
  }

  render() {
    return null;
  }

}


const mapStateToProps = store => ({
  user: store.loggedUser.user
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(loggedUserActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Logout);

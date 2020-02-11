import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarST from '../NavbarST';
import Footer from '../Footer';
import { Layout, Spin } from 'antd';

const bgColor = '#f9f3f3';

class MasterPage extends Component {
  render() {
    const { loading } = this.props.loading;
    return (
      <>
        <Layout>
          <Spin tip="Aguarde..." spinning={loading}>
            <Layout.Header style={{ backgroundColor: bgColor, height: '5vh', marginBottom: '5px' }}>
              <NavbarST />
            </Layout.Header>
            <Layout.Content style={{ backgroundColor: bgColor, padding: '0 50px' }}>
              {this.props.children}
            </Layout.Content>
            <Layout.Footer style={{ backgroundColor: bgColor, textAlign: 'center' }}>
              <Footer />
            </Layout.Footer>
          </Spin>
        </Layout>

      </>
    )
  }
}

const mapStateToProps = store => ({
  loading: store.loading
});

export default connect(mapStateToProps)(MasterPage);
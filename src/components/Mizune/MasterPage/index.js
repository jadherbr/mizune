import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarST from '../NavbarST';
import { Layout, Spin, PageHeader } from 'antd';

const bgColor = '#f9f3f3';

function itemRender(route, params, routes, paths) {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
      <a href={route.path}>{route.breadcrumbName}</a>
    );
}

class MasterPage extends Component {
  render() {

    const { loading } = this.props.loading;
    const routes = this.props.routes;

    return (
      <>
        <Layout>
          <Spin tip="Aguarde..." spinning={loading}>
            <Layout.Header style={{ backgroundColor: bgColor, height: '5vh', marginBottom: '5px' }}>
              <NavbarST />
            </Layout.Header>
            <Layout.Content style={{
              backgroundColor: bgColor,
              padding: '0 50px'
            }}>

            {!routes?null:(
              <PageHeader
                style={{
                  borderBottom: '1px dotted gray',
                  borderTop: '1px dotted gray',
                  height: '30px',
                  margin: '0 0 0 0',
                  padding: '2px 0 0 9px',
                  backgroundColor: '#e6e6ff'
                }}
                breadcrumb={{ itemRender: itemRender, routes: routes }}
              />
              )}
              
              {this.props.children}
            </Layout.Content>
            <Layout.Footer style={{
              backgroundColor: bgColor,
              borderTop: '1px dotted gray',
              textAlign: 'center',
              height: '25px',
              margin: '0 0 0 0',
              padding: '0 0 0 0',
              fontSize: '13px'
            }}>
              Copyright &copy; Mizune Sistemas 2020
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
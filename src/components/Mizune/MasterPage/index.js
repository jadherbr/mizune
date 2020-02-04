import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarST from '../NavbarST';
import Footer from '../Footer';
import { Layout, Breadcrumb } from 'antd';

const bgColor = '#f9f3f3';

const MasterPage = (props) => {
  return (
    <>
      <Layout>
        <Layout.Header style={{ backgroundColor: bgColor, height: '5vh', marginBottom: '5px' }}>
          <NavbarST />
        </Layout.Header>
        <Layout.Content style={{ backgroundColor: bgColor, padding: '0 50px' }}>  
          {props.children}
        </Layout.Content>
        <Layout.Footer style={{ backgroundColor: bgColor, textAlign: 'center' }}>
          <Footer />
        </Layout.Footer>
      </Layout>

    </>
  )
}

export default MasterPage
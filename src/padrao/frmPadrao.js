import React from 'react';
import { message } from 'antd';
import store from '../store';
import '../store/reducers/loading';

export default class FrmPadrao extends React.Component {

  layoutSideBySyde = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };

  Layout2ColsEm1 = {
    wrapperCol: {
      xs: {
        span: 0,
        offset: 0,
      },
      sm: {
        span: 24,
        offset: 6,
      },
    }
  };

  LayoutFullWidth = {
    wrapperCol: {
      xs: {
        span: 0,
        offset: 0,
      },
      sm: {
        span: 24,
        offset: 0,
      },
    },
  };

  lyMeiaTela = {
    labelCol: {
      span: 10
    },
    wrapperCol: {
      span: 12
    },
  };

  imgDummyReq({ file, onSuccess }) {
    setTimeout(() => {
      onSuccess("");
    }, 0);
  }

  getMessageInf = (msg) => {
    message.info(msg);
  };

  getMessageError = (msg) => {
    message.error(msg);
  };

  getMessageAlert = (msg) => {
    message.warning(msg);
  };

  getMessageSuccess = (msg) => {
    message.success(msg);
  };

  getCopyData(origem, destino) {
    // Copia os dados de um objeto para o outro desde que os campos tenham o mesmo nome
    Object.keys(origem).forEach(k => {
      destino[k] = origem[k];
    });
  }

  setLoading(value) {    
    store.dispatch({type:'UPDATE_LOADING', loading:value});
  }

 

}
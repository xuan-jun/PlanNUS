import { useState } from 'react';
import axios from 'axios';

function useToken() {

  function getToken() {
    const userToken = localStorage.getItem('token');
    const userName = localStorage.getItem('name');
    const token = {
      userToken : userToken,
      userName : userName
    }
    return (userToken && userName) === null ? false : token
  }

  const [token, setToken] = useState(getToken());

  function saveToken(token) {
    const userToken = token['userToken']
    const userName = token['userName']
    localStorage.setItem('token', userToken);
    localStorage.setItem('name', userName);
    setToken(token);
  };

  function removeToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setToken(false);
  }

  return {
    setToken: saveToken,
    token,
    removeToken
  }

}


export default useToken
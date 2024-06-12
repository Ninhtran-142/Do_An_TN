import React from "react";

//INTERNAL IMPORT
import Style from "../styles/login.module.css";
import Login from "../login/login";

const login = () => {
  return (
    <div className={Style.login}>
      <div className={Style.login_box}>
        <h1>Login</h1>
        <Login/>
        <p className={Style.login_box_para}>
          New user? <a href="signUp">Create an account</a>
        </p>
      </div>
    </div>
  );
};

export default login;
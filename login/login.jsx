import React, { useState } from "react";
import Image from "next/image";
import { handleLogin,handleLoginWithGoogle } from '../Firebase/firebaseAuth';
import { useRouter } from "next/router";

//INTERNALIMPORT
import Style from "../login/login.module.css"
import images from "../img";
import { Button } from "../components/componentsindex.js";

const login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    try {
      await handleLogin(email, password);
      // Xử lý thành công
      router.push("/");
    } catch (error) {
      // Xử lý lỗi
    }
  };
  const [activeBtn, setActiveBtn] = useState(1);

  const socialImage = [
    {
      id: 1,
      social: images.google,
      name: "Continue with Google",
      handleClick: handleLoginWithGoogle,
    },
    {
      id: 2,
      social: images.twitter,
      name: "Continue with twitter",
    },
    {
      id: 3,
      social: images.facebook,
      name: "Continue with Facebook",
    },
  ];
  return (
    <div className={Style.user}>
      <div className={Style.user_box}>
      <div className={Style.user_box_social}>
  {socialImage.map((el, i) => (
    <div
      key={el.id}
      onClick={() => {
        if (el.handleClick) {
          el.handleClick();
        } else {
          setActiveBtn(el.id);
        }
      }}
      className={`${Style.user_box_social_item} ${
        activeBtn === el.id ? Style.active : ""
      }`}
    >
      <Image
        src={el.social}
        alt={el.name}
        width={30}
        height={30}
        className={Style.user_box_social_item_img}
      />
      <p>
        <span>{el.name}</span>
      </p>
    </div>
  ))}
</div>
        <p className={Style.user_box_or}>OR</p>
        <form onSubmit={handleSubmit}>
          <div className={Style.user_box_input}>
            <div className={Style.user_box_input_box}>
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                placeholder="example@emample.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={Style.user_box_input_box}>
              <label
                htmlFor="password"
                className={Style.user_box_input_box_label}
              >
                <p>Password</p>
                <p>
                  <a href="#">Forget password</a>
                </p>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button btnName="Continue" classStyle={Style.button} handleClick = {handleSubmit} />
        </form>
      </div>
    </div>
  );
};

export default login;
import React, { useState, useEffect,useContext } from "react";
import { auth, db } from "../../Firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineHttp, MdOutlineContentCopy } from "react-icons/md";
import {
  TiSocialFacebook,
  TiSocialTwitter,
  TiSocialInstagram,
} from "react-icons/ti";

//INTERNAL IMPORT
import Style from "./Form.module.css";
import { Button } from "../../components/componentsindex.js";

const Form = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setUsername(userData.name || "");
          setEmail(userData.email || "");
          setDescription(userData.description || "");
          setWebsite(userData.website || "");
          setFacebook(userData.facebook || "");
          setTwitter(userData.twitter || "");
          setInstagram(userData.instagram || "");
          setWalletAddress(userData.walletAddress || "");
        }
      }
      console.log("ok");
    } catch (error) {
      console.log(error);}
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "website":
        setWebsite(value);
        break;
      case "facebook":
        setFacebook(value);
        break;
      case "twitter":
        setTwitter(value);
        break;
      case "instagram":
        setInstagram(value);
        break;
      case "walletAddress":
        setWalletAddress(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const formData = {
      name: username,
      email,
      description,
      website,
      facebook,
      twitter,
      instagram,
      walletAddress,
    };
    onSubmit(formData);
  };

  return (
    <div className={Style.Form}>
      <div className={Style.Form_box}>
        <form onSubmit={handleSubmit}>
      <div className={Style.Form_box_input}>
            <label htmlFor="name">Username</label>
            <input
              type="text"
              
              className={Style.Form_box_input_userName}
              name="username"
              value={username}
              onChange={handleChange}
            />
          </div>

          <div className={Style.Form_box_input}>
            <label htmlFor="email">Email</label>
            <div className={Style.Form_box_input_box}>
              <div className={Style.Form_box_input_box_icon}>
                <HiOutlineMail />
              </div>
              <input
                type="text"
                
                name="email"
                value={email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={Style.Form_box_input}>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id=""
              cols="30"
              rows="6"
              
              value={description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className={Style.Form_box_input}>
            <label htmlFor="website">Website</label>
            <div className={Style.Form_box_input_box}>
              <div className={Style.Form_box_input_box_icon}>
                <MdOutlineHttp />
              </div>

              <input
                type="text"
                
                name="website"
                value={website}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={Style.Form_box_input_social}>
            <div className={Style.Form_box_input}>
              <label htmlFor="facebook">Facebook</label>
              <div className={Style.Form_box_input_box}>
                <div className={Style.Form_box_input_box_icon}>
                  <TiSocialFacebook />
                </div>
                <input
                  type="text"
                  
                  name="facebook"
                  value={facebook}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={Style.Form_box_input}>
              <label htmlFor="Twitter">Twitter</label>
              <div className={Style.Form_box_input_box}>
                <div className={Style.Form_box_input_box_icon}>
                  <TiSocialTwitter />
                </div>
                <input
                  type="text"
                  
                  name="twitter"
                  value={twitter}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={Style.Form_box_input}>
              <label htmlFor="Instragram">Instragram</label>
              <div className={Style.Form_box_input_box}>
                <div className={Style.Form_box_input_box_icon}>
                  <TiSocialInstagram />
                </div>
                <input
                  type="text"
                  
                  name="instagram"
                  value={instagram}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className={Style.Form_box_input}>
            <label htmlFor="wallet">Wallet address</label>
            <div className={Style.Form_box_input_box}>
              <div className={Style.Form_box_input_box_icon}>
                <MdOutlineHttp />
              </div>
              <input
                type="text"
                
                name="walletAddress"
                value={walletAddress}
                onChange={handleChange}
              />
              <div className={Style.Form_box_input_box_icon}>
                <MdOutlineContentCopy />
              </div>
            </div>
          </div>

          <div className={Style.Form_box_btn}>
            <Button
              btnName="Upload profile"
              handleClick={handleSubmit}
              classStyle={Style.button}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
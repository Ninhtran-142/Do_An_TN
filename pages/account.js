import React, { useState, useMemo, useCallback, useContext ,useEffect} from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { auth, db } from "../Firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
//INTERNAL IMPORT
import Style from "../styles/account.module.css";
import images from "../img";
import From from "../AccountPage/Form/Form";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const account = () => {
  const { uploadToPinata } = useContext(NFTMarketplaceContext);
  const [fileUrl, setFileUrl] = useState(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserAvatarUrl(userData.avatarUrl || null);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const imageUrl = await uploadToPinata(file);
      setFileUrl(imageUrl);
    }
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(userRef, formData, { merge: true });
        if (fileUrl) {
          await setDoc(userRef, { avatarUrl: fileUrl }, { merge: true });
        }
        console.log("Cập nhật thông tin người dùng thành công");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  return (
    <div className={Style.account}>
      <div className={Style.account_info}>
        <h1>Profile settings</h1>
        <p>
          You can set preferred display name, create your profile URL and manage
          other personal settings.
        </p>
      </div>

      <div className={Style.account_box}>
        <div className={Style.account_box_img} {...getRootProps()}>
          <input {...getInputProps()} />
          <Image
            src={fileUrl || userAvatarUrl || images.user1}
            alt="account upload"
            width={150}
            height={150}
            className={Style.account_box_img_img}
          />
          <p className={Style.account_box_img_para}>Change Image</p>
        </div>
        <div className={Style.account_box_from}>
          <From onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default account;
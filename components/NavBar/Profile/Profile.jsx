import React, { useState,useEffect,useContext }  from "react";
import Image from "next/image";
import { FaUserAlt, FaRegImage, FaUserEdit,faSignOutAlt } from "react-icons/fa";
import { MdHelpCenter, MdLogout } from "react-icons/md";
import { TbDownloadOff, TbDownload } from "react-icons/tb";
import Link from "next/link";
import { useRouter } from "next/router";

//INTERNAL IMPORT
import Style from "./Profile.module.css";
import images from "../../../img";
import { Button } from "../../componentsindex";
import { auth,db} from "../../../Firebase/firebase";

const Profile = ({ currentAccount }) => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('Đăng xuất thành công');
      router.push("/");
      // Thực hiện các hành động khác nếu cần, chẳng hạn như chuyển hướng người dùng về trang đăng nhập
    } catch (error) {
      console.error('Đăng xuất thất bại:', error);
    }
  };
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userRef = db.collection('users').doc(currentUser.uid);
      const unsubscribe = userRef.onSnapshot((documentSnapshot) => {
        setUserData(documentSnapshot.data());
      });
  
      // Hủy đăng ký lắng nghe sự kiện khi component unmount
      return () => unsubscribe();
    }
  }, []);
  return (
    <div className={Style.profile}>
      {userData ? (
      <div className={Style.profile_account}>
        <Image
          src={userData.avatarUrl || images.user1}
          alt="user profile"
          width={50}
          height={50}
          className={Style.profile_account_img}
        />

        <div className={Style.profile_account_info}>
          <p>{userData.name}</p>
          <small>{currentAccount.slice(0, 18)}..</small>
        </div>
      </div>
    ) : (
      <p>Loading...</p>
    )}
      <div className={Style.profile_menu}>
        <div className={Style.profile_menu_one}>
          <div className={Style.profile_menu_one_item}>
            <FaUserAlt />
            <p>
              <Link href={{ pathname: "/author" }}>My Profile</Link>
            </p>
          </div>
          <div className={Style.profile_menu_one_item}>
            <FaRegImage />
            <p>
              <Link href={{ pathname: "/author" }}>My Items</Link>
            </p>
          </div>
          <div className={Style.profile_menu_one_item}>
            <FaUserEdit />
            <p>
              <Link href={{ pathname: "/account" }}>Edit Profile</Link>
            </p>
          </div>
        </div>

        <div className={Style.profile_menu_two}>
          <div className={Style.profile_menu_one_item}>
            <MdHelpCenter />
            <p>
              <Link href={{ pathname: "/contactus" }}>Help</Link>
            </p>
          </div>
          <div className={Style.profile_menu_one_item}>
            <TbDownload />
            <p>
              <Link href={{ pathname: "/aboutus" }}>About Us</Link>
            </p>
          </div>
          <div className={Style.profile_menu_one_item}>
          <MdLogout/>
          <Button btnName="Logout" classStyle={Style.button} handleClick = {handleLogout} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
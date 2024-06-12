import { auth, database,db  } from './firebase';
import { doc,setDoc,collection } from 'firebase/firestore';
import { GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from "next/router";

export const handleLogin = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    // Xử lý thành công
    console.log("dang nhap thanh cong");
  } catch (error) {
    // Xử lý lỗi
    console.error('Error logging in:', error);
  }
};

export const handleSignUp = async (name, email, password) => {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log("Dang ki thanh cong");
      // Cập nhật tên cho người dùng
      await user.updateProfile({
        displayName: name,
      });
      console.log(user);
  
    // Lưu thông tin người dùng vào Firestore
    const userRef = doc(collection(db, 'users'), user.uid);
    await setDoc(userRef, {
      name,
      email,
      // Thêm các thuộc tính khác nếu cần
    });
      console.log(user);
      console.log("Luu nguoi dung thanh cong");
      // Xử lý thành công
    } catch (error) {
      // Xử lý lỗi
      console.error('Error signing up:', error);
    }
  };

  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');

  export const handleLoginWithGoogle = async () => {
    try {
      console.log('handleLoginWithGoogle called');
      const router = useRouter();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Đăng nhập thành công với Google:', user);

      const userRef = doc(collection(db, 'users'), user.uid);
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
      });
      router.push("/");
      console.log("Lưu thông tin người dùng thành công");
    } catch (error) {
      console.error('Lỗi đăng nhập với Google:', error);
    }
  };
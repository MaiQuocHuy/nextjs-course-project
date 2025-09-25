import { getSession, signIn } from "next-auth/react";

export async function handleGoogleSignIn(router: any, setModalMessage: (msg: string) => void, setShowErrorModal: (b: boolean) => void, setShowSuccessModal: (b: boolean) => void, setIsGoogleLoading: (b: boolean) => void) {
    try {
      setIsGoogleLoading(true);
      
      // Get return URL from query params
      const returnUrl = new URLSearchParams(window.location.search).get("returnUrl") || "/";
      
      // Gọi signIn với provider 'google'
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: returnUrl
      });

      if (result?.error) {
        // console.error('Google sign-in error:', result.error);
        setModalMessage('Đăng nhập Google thất bại. Vui lòng thử lại.');
        setShowErrorModal(true);
        return;
      }

      if (result?.ok) {

        // Lấy session mới sau khi đăng nhập
        const session = await getSession();
        
        if (session?.user) {
          setModalMessage(`Chào mừng ${session.user.name}!`);
          setShowSuccessModal(true);
          
          // Redirect dựa trên role của user
          setTimeout(() => {
            switch (session.user.role) {
              case 'ADMIN':
                router.replace('/admin/dashboard');
                break;
              case 'TEACHER':
                router.replace('/teacher/dashboard');
                break;
              case 'STUDENT':
              default:
                router.replace(returnUrl);
                break;
            }
          }, 1000);
        } else {
          setModalMessage('Không thể lấy thông tin người dùng.');
          setShowErrorModal(true);
        }
      }
    } catch (error) {
      // console.error('Google sign-in error:', error);
      setModalMessage('Có lỗi xảy ra khi đăng nhập với Google.');
      setShowErrorModal(true);
    } finally {
      setIsGoogleLoading(false);
    }
  };
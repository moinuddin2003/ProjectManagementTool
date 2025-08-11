import LoginForm from "./LoginForm"
import LoginBranding from "./LoginBranding"

const LoginPage = ({ loginForm, setLoginForm, onLogin, isLoading }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            <LoginForm loginForm={loginForm} setLoginForm={setLoginForm} onLogin={onLogin} isLoading={isLoading} />
            <LoginBranding />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

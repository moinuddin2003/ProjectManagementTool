const LoginBranding = () => {
  return (
    <div className="flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 lg:p-12 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 text-center text-white">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 shadow-2xl">
          <span className="text-3xl font-bold">LOGO</span>
        </div>
        <h2 className="text-4xl font-bold mb-4">Project Management</h2>
        <p className="text-xl text-white/80">Streamline your workflow with powerful tools</p>
      </div>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
    </div>
  )
}

export default LoginBranding

const RegisterBranding = () => {
  return (
    <div className="flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 lg:p-12 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 text-center text-white">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 shadow-2xl">
          <span className="text-3xl font-bold">LOGO</span>
        </div>
        <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
        <p className="text-xl text-white/80 mb-6">Start your journey with powerful project management tools</p>
        <div className="space-y-4 text-left max-w-sm mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
            <span className="text-white/80">Collaborative workspace</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
            <span className="text-white/80">Advanced project tracking</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
            <span className="text-white/80">Real-time team collaboration</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
            <span className="text-white/80">Comprehensive reporting</span>
          </div>
        </div>
      </div>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
    </div>
  )
}

export default RegisterBranding
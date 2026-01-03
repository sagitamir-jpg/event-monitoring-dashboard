import React, { useState } from 'react'

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.username || !formData.password) return
    
    const users = JSON.parse(localStorage.getItem('kiro-users') || '{}')
    
    if (isLogin) {
      const user = users[formData.username]
      if (user && user.password === formData.password) {
        onLogin(formData.username, user.email, user.phone)
      }
    } else {
      users[formData.username] = {
        password: formData.password,
        email: formData.email,
        phone: formData.phone
      }
      localStorage.setItem('kiro-users', JSON.stringify(users))
      onLogin(formData.username, formData.email, formData.phone)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1>Event Monitor</h1>
        
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <button onClick={() => setIsLogin(true)} style={{ flex: 1, padding: '8px', background: isLogin ? '#007bff' : '#f8f9fa', color: isLogin ? 'white' : '#666', border: 'none' }}>
            Login
          </button>
          <button onClick={() => setIsLogin(false)} style={{ flex: 1, padding: '8px', background: !isLogin ? '#007bff' : '#f8f9fa', color: !isLogin ? 'white' : '#666', border: 'none' }}>
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          
          {!isLogin && (
            <>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                type="tel"
                placeholder="Phone (+1234567890)"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </>
          )}
          
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { 
  User, 
  Mail, 
  Lock, 
  Phone,
  MessageSquare,
  UserPlus,
  LogIn,
  Building,
  CheckCircle
} from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  
  // Login state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  // Register state  
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    user_type: 'retail',
    phone: '',
    // Для юридических лиц
    company_name: '',
    inn: ''
  });

  // SMS login state
  const [smsForm, setSmsForm] = useState({
    phone: '',
    code: '',
    codeSent: false,
    verified: false
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        login(data.user);
        navigate('/');
      } else {
        alert('Неверные учетные данные');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      alert('Ошибка при входе в систему');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password,
          name: registerForm.name,
          user_type: registerForm.user_type,
          phone: registerForm.phone,
          company_name: registerForm.company_name,
          inn: registerForm.inn
        }),
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        login(data.user);
        navigate('/');
      } else {
        alert(data.message || 'Ошибка при регистрации');
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      alert('Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  const handleSendSMS = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${backendUrl}/api/auth/sms/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: smsForm.phone }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSmsForm({ ...smsForm, codeSent: true });
        alert('SMS код отправлен на ваш номер');
      } else {
        alert(data.error || 'Ошибка отправки SMS');
      }
    } catch (error) {
      console.error('Ошибка отправки SMS:', error);
      alert('Ошибка отправки SMS');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySMS = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${backendUrl}/api/auth/sms/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: smsForm.phone,
          code: smsForm.code 
        }),
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        login(data.user);
        navigate('/');
      } else {
        alert(data.error || 'Неверный код');
      }
    } catch (error) {
      console.error('Ошибка проверки SMS:', error);
      alert('Ошибка проверки кода');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Добро пожаловать в NEXX</h1>
              <p className="text-gray-400">Войдите в систему или создайте новый аккаунт</p>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="login" className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Вход
                    </TabsTrigger>
                    <TabsTrigger value="register" className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Регистрация
                    </TabsTrigger>
                    <TabsTrigger value="sms" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      SMS вход
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>

              <CardContent className="space-y-4">
                <Tabs value={activeTab}>
                  {/* Login Tab */}
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-username">Имя пользователя</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="login-username"
                            type="text"
                            value={loginForm.username}
                            onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                            className="pl-10 bg-gray-700 border-gray-600 text-white"
                            placeholder="Введите имя пользователя"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Пароль</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="login-password"
                            type="password"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                            className="pl-10 bg-gray-700 border-gray-600 text-white"
                            placeholder="Введите пароль"
                            required
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        disabled={loading}
                      >
                        {loading ? 'Вход...' : 'Войти'}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Register Tab */}
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      {/* User Type Selection */}
                      <div className="space-y-2">
                        <Label>Тип пользователя</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant={registerForm.user_type === 'retail' ? 'default' : 'outline'}
                            onClick={() => setRegisterForm({...registerForm, user_type: 'retail'})}
                            className="justify-center"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Физ. лицо
                          </Button>
                          <Button
                            type="button"
                            variant={registerForm.user_type === 'legal' ? 'default' : 'outline'}
                            onClick={() => setRegisterForm({...registerForm, user_type: 'legal'})}
                            className="justify-center"
                          >
                            <Building className="w-4 h-4 mr-2" />
                            Юр. лицо
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-name">
                          {registerForm.user_type === 'legal' ? 'Название организации' : 'Полное имя'}
                        </Label>
                        <Input
                          id="register-name"
                          type="text"
                          value={registerForm.name}
                          onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder={registerForm.user_type === 'legal' ? 'ООО «Рога и копыта»' : 'Иван Иванов'}
                          required
                        />
                      </div>

                      {registerForm.user_type === 'legal' && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="register-company">Юридическое название</Label>
                            <Input
                              id="register-company"
                              type="text"
                              value={registerForm.company_name}
                              onChange={(e) => setRegisterForm({...registerForm, company_name: e.target.value})}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="ООО «Название компании»"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="register-inn">ИНН</Label>
                            <Input
                              id="register-inn"
                              type="text"
                              value={registerForm.inn}
                              onChange={(e) => setRegisterForm({...registerForm, inn: e.target.value})}
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="1234567890"
                            />
                          </div>
                        </>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="register-username">Имя пользователя</Label>
                        <Input
                          id="register-username"
                          type="text"
                          value={registerForm.username}
                          onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="username"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-email"
                            type="email"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                            className="pl-10 bg-gray-700 border-gray-600 text-white"
                            placeholder="email@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-phone">Телефон</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-phone"
                            type="tel"
                            value={registerForm.phone}
                            onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                            className="pl-10 bg-gray-700 border-gray-600 text-white"
                            placeholder="+7 (900) 123-45-67"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password">Пароль</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-password"
                            type="password"
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                            className="pl-10 bg-gray-700 border-gray-600 text-white"
                            placeholder="Создайте пароль"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-confirm">Подтвердите пароль</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-confirm"
                            type="password"
                            value={registerForm.confirmPassword}
                            onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                            className="pl-10 bg-gray-700 border-gray-600 text-white"
                            placeholder="Повторите пароль"
                            required
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        disabled={loading}
                      >
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* SMS Tab */}
                  <TabsContent value="sms">
                    <div className="space-y-4">
                      {!smsForm.codeSent ? (
                        <form onSubmit={handleSendSMS} className="space-y-4">
                          <div className="text-center mb-4">
                            <MessageSquare className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                            <p className="text-gray-300 text-sm">
                              Введите номер телефона для получения SMS с кодом подтверждения
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="sms-phone">Номер телефона</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="sms-phone"
                                type="tel"
                                value={smsForm.phone}
                                onChange={(e) => setSmsForm({...smsForm, phone: e.target.value})}
                                className="pl-10 bg-gray-700 border-gray-600 text-white"
                                placeholder="+7 (900) 123-45-67"
                                required
                              />
                            </div>
                          </div>

                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                            disabled={loading}
                          >
                            {loading ? 'Отправка SMS...' : 'Отправить код'}
                          </Button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifySMS} className="space-y-4">
                          <div className="text-center mb-4">
                            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                            <p className="text-gray-300 text-sm">
                              SMS код отправлен на номер {smsForm.phone}
                            </p>
                            <p className="text-gray-400 text-xs">
                              Введите полученный код для входа
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="sms-code">Код из SMS</Label>
                            <Input
                              id="sms-code"
                              type="text"
                              value={smsForm.code}
                              onChange={(e) => setSmsForm({...smsForm, code: e.target.value})}
                              className="bg-gray-700 border-gray-600 text-white text-center text-2xl letter-spacing-wide"
                              placeholder="1234"
                              maxLength="4"
                              required
                            />
                          </div>

                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                            disabled={loading}
                          >
                            {loading ? 'Проверка...' : 'Подтвердить код'}
                          </Button>

                          <Button 
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => setSmsForm({ phone: '', code: '', codeSent: false, verified: false })}
                          >
                            Изменить номер телефона
                          </Button>
                        </form>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="text-center pt-4 border-t border-gray-700">
                  <p className="text-gray-400 text-sm">
                    Продолжая, вы соглашаетесь с условиями использования сервиса
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;
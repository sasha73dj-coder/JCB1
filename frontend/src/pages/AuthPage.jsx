import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Eye, EyeOff, Phone, Mail, RotateCw } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { authStorage } from '../utils/storage';

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [phoneAuthData, setPhoneAuthData] = useState({
    phone: '',
    code: ''
  });
  const [isCodeSent, setIsCodeSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const result = authStorage.login(loginData.email, loginData.password);
      
      if (result.success) {
        toast({
          title: 'Успешно!',
          description: `Добро пожаловать, ${result.user.name}!`
        });
        
        // Redirect based on role
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        toast({
          title: 'Ошибка входа',
          description: result.error,
          variant: 'destructive'
        });
      }
      setLoading(false);
    }, 1000);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Пароли не совпадают',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      const result = authStorage.register({
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        username: registerData.email,
        password: registerData.password
      });
      
      if (result.success) {
        toast({
          title: 'Аккаунт создан!',
          description: `Добро пожаловать, ${result.user.name}!`
        });
        navigate('/');
      } else {
        toast({
          title: 'Ошибка регистрации',
          description: result.error,
          variant: 'destructive'
        });
      }
      setLoading(false);
    }, 1000);
  };

  const handleSendCode = (e) => {
    e.preventDefault();
    setIsCodeSent(true);
    toast({
      title: 'Код отправлен',
      description: 'Проверьте SMS сообщения (демо: используйте код 1234)'
    });
  };

  const handlePhoneAuth = (e) => {
    e.preventDefault();
    
    if (phoneAuthData.code === '1234') {
      toast({
        title: 'Успешно!',
        description: 'Вы вошли в систему по SMS'
      });
      navigate('/');
    } else {
      toast({
        title: 'Неверный код',
        description: 'Проверьте введенный код',
        variant: 'destructive'
      });
    }
  };

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Добро пожаловать</h1>
              <p className="text-gray-400">Войдите в свой аккаунт или создайте новый</p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
                <TabsTrigger value="login" className="text-white data-[state=active]:bg-orange-500">
                  Вход
                </TabsTrigger>
                <TabsTrigger value="register" className="text-white data-[state=active]:bg-orange-500">
                  Регистрация
                </TabsTrigger>
                <TabsTrigger value="phone" className="text-white data-[state=active]:bg-orange-500">
                  По телефону
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Вход в аккаунт</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Ваш email"
                            value={loginData.email}
                            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                            className="bg-gray-700 border-gray-600 text-white pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Пароль</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Ваш пароль"
                            value={loginData.password}
                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                            className="bg-gray-700 border-gray-600 text-white pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Link to="/forgot-password" className="text-orange-400 text-sm hover:underline">
                          Забыли пароль?
                        </Link>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        Войти
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Регистрация</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Имя</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Ваше имя"
                          value={registerData.name}
                          onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reg-email" className="text-white">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="reg-email"
                            type="email"
                            placeholder="Ваш email"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                            className="bg-gray-700 border-gray-600 text-white pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white">Телефон</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+7 (900) 123-45-67"
                            value={registerData.phone}
                            onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                            className="bg-gray-700 border-gray-600 text-white pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reg-password" className="text-white">Пароль</Label>
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="Придумайте пароль"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-white">Подтверждение пароля</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Повторите пароль"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      
                      <div className="text-xs text-gray-400">
                        Регистрируясь, вы соглашаетесь с {' '}
                        <Link to="/terms" className="text-orange-400 hover:underline">
                          пользовательским соглашением
                        </Link>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        Создать аккаунт
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Phone Auth Tab */}
              <TabsContent value="phone">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Вход по телефону</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!isCodeSent ? (
                      <form onSubmit={handleSendCode} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone-auth" className="text-white">Номер телефона</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone-auth"
                              type="tel"
                              placeholder="+7 (900) 123-45-67"
                              value={phoneAuthData.phone}
                              onChange={(e) => setPhoneAuthData({...phoneAuthData, phone: e.target.value})}
                              className="bg-gray-700 border-gray-600 text-white pl-10"
                              required
                            />
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-400">
                          Мы отправим SMS с кодом подтверждения
                        </p>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                          Получить код
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handlePhoneAuth} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="sms-code" className="text-white">Код из SMS</Label>
                          <Input
                            id="sms-code"
                            type="text"
                            placeholder="1234"
                            value={phoneAuthData.code}
                            onChange={(e) => setPhoneAuthData({...phoneAuthData, code: e.target.value})}
                            className="bg-gray-700 border-gray-600 text-white text-center text-lg tracking-widest"
                            maxLength={4}
                            required
                          />
                        </div>
                        
                        <p className="text-sm text-gray-400">
                          Код отправлен на номер {phoneAuthData.phone}
                        </p>
                        
                        <div className="flex space-x-2">
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => setIsCodeSent(false)}
                            className="flex-1 border-gray-600 text-gray-300"
                          >
                            Назад
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                          >
                            Подтвердить
                          </Button>
                        </div>
                        
                        <Button 
                          type="button"
                          variant="ghost"
                          className="w-full text-orange-400 hover:text-orange-300"
                          onClick={handleSendCode}
                        >
                          Отправить код повторно
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;
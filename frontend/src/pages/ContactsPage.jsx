import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const ContactsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const { toast } = useToast();

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    toast({
      title: 'Сообщение отправлено!',
      description: 'Мы свяжемся с вами в ближайшее время'
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Телефон',
      content: ['+7 495 492-14-78', 'Бесплатный звонок по России'],
      color: 'text-green-400'
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email',
      content: ['info@nexx.ru', 'support@nexx.ru'],
      color: 'text-blue-400'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Адрес',
      content: ['Москва, ул. Складочная, д. 1, стр. 18', 'Метро Лужники'],
      color: 'text-red-400'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Часы работы',
      content: ['Пн-Пт: 9:00-18:00', 'Сб: 10:00-16:00', 'Вс: выходной'],
      color: 'text-yellow-400'
    }
  ];

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Контакты
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Мы всегда готовы ответить на ваши вопросы и помочь с подбором запчастей
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Свяжитесь с нами
                </h2>
                <p className="text-gray-300 text-lg">
                  Любым удобным для вас способом. Наши специалисты ответят на все вопросы и помогут подобрать нужные запчасти.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors">
                    <CardContent className="p-6">
                      <div className={`${info.color} mb-4`}>
                        {info.icon}
                      </div>
                      <h3 className="text-white font-semibold mb-2">{info.title}</h3>
                      <div className="space-y-1">
                        {info.content.map((line, lineIndex) => (
                          <p key={lineIndex} className="text-gray-300 text-sm">
                            {line}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Map Placeholder */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-4">Наше местоположение</h3>
                  <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-orange-500 mx-auto mb-2" />
                      <p className="text-gray-300">Карта местоположения</p>
                      <p className="text-gray-400 text-sm">Москва, ул. Складочная, 1с18</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">
                    Отправить сообщение
                  </CardTitle>
                  <p className="text-gray-400">
                    Заполните форму, и мы обязательно свяжемся с вами
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Имя *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Ваше имя"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white">Телефон</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="+7 (900) 123-45-67"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-white">Тема сообщения *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Вопрос по запчастям"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white">Сообщение *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white h-32 resize-none"
                        placeholder="Опишите ваш вопрос подробнее..."
                        required
                      />
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      * Обязательные поля
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      size="lg"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Отправить сообщение
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Как мы работаем
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Наш подход к обслуживанию клиентов
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-gray-900 border-gray-700 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Консультация
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Обращайтесь к нам любым удобным способом. Мы поможем подобрать правильные запчасти
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-700 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Оформление
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Оформляем заказ в удобное для вас время. Проверяем наличие и согласовываем доставку
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-700 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Доставка
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Отправляем заказ в указанные сроки. Проинформируем о статусе доставки
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ContactsPage;
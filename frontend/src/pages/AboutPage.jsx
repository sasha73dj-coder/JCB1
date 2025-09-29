import React from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Shield, Truck, Clock, Award, Users, MapPin, Phone, Mail } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: <Shield className="h-12 w-12" />,
      title: 'Оригинальные запчасти',
      description: 'Мы работаем только с официальными поставщиками и гарантируем подлинность каждой детали.'
    },
    {
      icon: <Truck className="h-12 w-12" />,
      title: 'Быстрая доставка',
      description: 'Доставка по всей России в кратчайшие сроки. Москва и МО — 1-2 дня, регионы — 3-7 дней.'
    },
    {
      icon: <Clock className="h-12 w-12" />,
      title: 'Круглосуточная поддержка',
      description: 'Наши специалисты готовы помочь вам в любое время суток. Консультации, подбор запчастей и техническая поддержка.'
    },
    {
      icon: <Award className="h-12 w-12" />,
      title: 'Опыт более 10 лет',
      description: 'Мы работаем на рынке запчастей для спецтехники с 2013 года и знаем о каждой детали всё.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Товаров в наличии' },
    { number: '5,000+', label: 'Довольных клиентов' },
    { number: '10+', label: 'Лет опыта' },
    { number: '50+', label: 'Городов доставки' }
  ];

  return (
    <Layout>
      <div className="bg-gray-900">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              О компании 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                NEXX
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Мы — официальный поставщик оригинальных запчастей для специализированной техники JCB, Perkins, Carraro и других ведущих мировых брендов. Наша миссия — обеспечить вашу технику надёжными и качественными запчастями.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Почему выбирают нас
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Мы обеспечиваем полный цикл обслуживания — от консультации до доставки
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-orange-500 mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                Наша история
              </h2>
              
              <div className="space-y-8">
                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        2013
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Основание компании</h3>
                        <p className="text-gray-300">
                          Компания NEXX была основана группой энтузиастов, специализирующихся на обслуживании спецтехники. Начали с маленького склада и большого желания помогать людям.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        2018
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Официальное партнёрство</h3>
                        <p className="text-gray-300">
                          Получили статус официального дилера JCB в России. Это открыло нам доступ к оригинальным запчастям по лучшим ценам и позволило значительно расширить ассортимент.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        2024
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Современный интернет-магазин</h3>
                        <p className="text-gray-300">
                          Запустили новую платформу для онлайн-продаж, которая позволяет клиентам легко находить и заказывать нужные запчасти, а нам — обеспечивать их быстро и качественно.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Контакты
              </h2>
              <p className="text-gray-400 text-lg">
                Мы всегда готовы ответить на ваши вопросы
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="bg-gray-800 border-gray-700 text-center">
                <CardContent className="p-6">
                  <Phone className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Телефон</h3>
                  <p className="text-gray-300">+7 495 492-14-78</p>
                  <p className="text-gray-300">Пн-Пт: 9:00-18:00</p>
                  <p className="text-gray-300">Сб: 10:00-16:00</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 text-center">
                <CardContent className="p-6">
                  <Mail className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
                  <p className="text-gray-300">info@nexx.ru</p>
                  <p className="text-gray-300">Отвечаем в течение</p>
                  <p className="text-gray-300">24 часов</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 text-center">
                <CardContent className="p-6">
                  <MapPin className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Адрес</h3>
                  <p className="text-gray-300">Москва, ул. Складочная,</p>
                  <p className="text-gray-300">д. 1, стр. 18</p>
                  <p className="text-gray-400 text-sm mt-2">Метро Лужники</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AboutPage;
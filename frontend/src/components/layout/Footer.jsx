import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Каталог',
      links: [
        { name: 'JCB', path: '/catalog/jcb' },
        { name: 'PERKINS', path: '/catalog/perkins' },
        { name: 'CARRARO', path: '/catalog/carraro' },
        { name: 'Запчасти для ТО', path: '/catalog/zapchasti-dlya-to' },
        { name: 'Все категории', path: '/catalog' }
      ]
    },
    {
      title: 'Информация',
      links: [
        { name: 'О компании', path: '/about' },
        { name: 'Доставка и оплата', path: '/delivery' },
        { name: 'Гарантии', path: '/warranty' },
        { name: 'Возврат товара', path: '/returns' },
        { name: 'Новости', path: '/news' }
      ]
    },
    {
      title: 'Помощь',
      links: [
        { name: 'Как заказать', path: '/how-to-order' },
        { name: 'Часто задаваемые вопросы', path: '/faq' },
        { name: 'Контакты', path: '/contacts' },
        { name: 'Обратная связь', path: '/feedback' },
        { name: 'Подбор запчастей', path: '/parts-selection' }
      ]
    }
  ];

  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <span className="text-white font-bold text-xl">NEXX</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Официальный поставщик оригинальных запчастей для тракторов и спецтехники JCB. 
              Более 10 лет на рынке, гарантия качества.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-4 w-4 text-orange-500" />
                <span className="text-sm">+7 495 492-14-78</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-4 w-4 text-orange-500" />
                <span className="text-sm">info@nexx.ru</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-400">
                <MapPin className="h-4 w-4 text-orange-500 mt-0.5" />
                <span className="text-sm">Москва, ул. Складочная, д. 1, стр. 18</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Пн-Пт: 9:00-18:00, Сб: 10:00-16:00</span>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-white font-semibold text-lg">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} NEXX. Все права защищены.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-orange-400 transition-colors">
                Политика конфиденциальности
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-orange-400 transition-colors">
                Пользовательское соглашение
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const MapSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 text-red-600 font-medium mb-4">
            <div className="w-8 h-0.5 bg-red-600"></div>
            <span>Ubicación</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
            Visítanos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Estamos ubicados en el hermoso sector de Los Pinos, Reñaca, 
            en un ambiente natural que favorece el aprendizaje y la formación integral.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-6">
                Información de Contacto
              </h3>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Dirección</h4>
                    <p className="text-gray-600">
                      Colegio Sagrada Familia<br />
                      Parcela 4, Los Pinos, Reñaca<br />
                      Casilla 5104 – Correo Reñaca
                    </p>
                  </div>
                </div>

                {/* Phones */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Teléfonos</h4>
                    <div className="text-gray-600 space-y-1">
                      <p>
                        <a href="tel:+56998849756" className="hover:text-blue-600 transition-colors">
                          9 9884 9756
                        </a>
                        <span className="text-sm text-gray-500 ml-2">(Secretaría)</span>
                      </p>
                      <p>
                        <a href="tel:+56942055921" className="hover:text-blue-600 transition-colors">
                          9 42055921
                        </a>
                        <span className="text-sm text-gray-500 ml-2">(Administración)</span>
                      </p>
                      <p>
                        <a href="tel:+56982334372" className="hover:text-blue-600 transition-colors">
                          9 8233 4372
                        </a>
                        <span className="text-sm text-gray-500 ml-2">(Portería)</span>
                      </p>
                      <p>
                        <a href="tel:+56932422220" className="hover:text-blue-600 transition-colors">
                          9 3242 2220
                        </a>
                        <span className="text-sm text-gray-500 ml-2">(Admisión)</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Contáctenos</h4>
                    <p className="text-gray-600">
                      Información adicional a través de:<br />
                      <span className="font-medium">Formulario de Contacto</span>
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Horario de Atención</h4>
                    <div className="text-gray-600 space-y-1">
                      <p>Lunes a Viernes: 8:00 - 17:00</p>
                      <p>Sábados: 9:00 - 13:00</p>
                      <p>Domingos: Cerrado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Map */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Nuestra Ubicación
              </h3>
              <p className="text-gray-600 mb-6">
                Encuentra fácilmente nuestro colegio en el mapa. Estamos en una zona 
                privilegiada con fácil acceso y rodeados de naturaleza.
              </p>
            </div>

            {/* Google Maps Embed */}
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3344.8234567890123!2d-71.5383047!3d-32.9532365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9689dd3c99ae1d4d%3A0xbcc1a16d9fd3172d!2sColegio%20Sagrada%20Familia!5e0!3m2!1ses!2scl!4v1234567890123!5m2!1ses!2scl"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Colegio Sagrada Familia"
                className="w-full h-full"
              />
            </div>

            {/* Map Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://www.google.com/maps/place/Colegio+Sagrada+Familia/@-32.953237,-71.538305,15z/data=!4m6!3m5!1s0x9689dd3c99ae1d4d:0xbcc1a16d9fd3172d!8m2!3d-32.9532365!4d-71.5383047!16s%2Fg%2F11c3s952r5?hl=es&entry=ttu&g_ep=EgoyMDI1MDgxMC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
              >
                Ver en Google Maps
              </a>
              <a
                href="https://www.google.com/maps/dir//Colegio+Sagrada+Familia,+Parcela+4,+Los+Pinos,+Re%C3%B1aca/@-32.9532365,-71.5383047,15z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
              >
                Cómo Llegar
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
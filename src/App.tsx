import { Calendar, Clock, Star, Users, Sparkles, Scissors, MessageSquare, CreditCard, ChevronDown } from 'lucide-react';

function App() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Scissors className="w-6 h-6 text-rose-400" />
              <span className="text-2xl font-bold text-gray-900">Salon Now</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-rose-400 transition-colors">Features</button>
              <button onClick={() => scrollToSection('team')} className="text-gray-600 hover:text-rose-400 transition-colors">Team</button>
              <button onClick={() => scrollToSection('screenshots')} className="text-gray-600 hover:text-rose-400 transition-colors">Screenshots</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-rose-400 transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 via-pink-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Your Beauty, On Demand</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Book Beauty Services
              <br />
              <span className="text-rose-400">Anytime, Anywhere</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with professional beauticians and hair stylists instantly. Schedule appointments, choose your favorite specialists, and enjoy premium salon services at your convenience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-rose-400 text-white px-8 py-4 rounded-xl font-semibold hover:bg-rose-500 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                Download on App Store
              </button>
              <button className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-rose-400 transition-all">
                Get on Google Play
              </button>
            </div>
          </div>
          <div className="mt-16 flex justify-center">
            <button onClick={() => scrollToSection('features')} className="animate-bounce">
              <ChevronDown className="w-8 h-8 text-rose-400" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need for a seamless beauty service booking experience</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-8 rounded-2xl border border-rose-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <Calendar className="w-7 h-7 text-rose-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Booking</h3>
              <p className="text-gray-600 leading-relaxed">Schedule appointments with your favorite beauticians in just a few taps. View availability in real-time.</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <Users className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Choose Your Stylist</h3>
              <p className="text-gray-600 leading-relaxed">Browse profiles, read reviews, and select from experienced professionals who match your style preferences.</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <Star className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ratings & Reviews</h3>
              <p className="text-gray-600 leading-relaxed">Make informed decisions with honest reviews and ratings from our community of users.</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <Clock className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Updates</h3>
              <p className="text-gray-600 leading-relaxed">Get instant notifications about your appointments, waiting queue status, and special offers.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-8 rounded-2xl border border-purple-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <Scissors className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multiple Services</h3>
              <p className="text-gray-600 leading-relaxed">From haircuts to facial treatments, color & shine to styling - all services in one app.</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-8 rounded-2xl border border-cyan-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <MessageSquare className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Communication</h3>
              <p className="text-gray-600 leading-relaxed">Chat with your stylist before your appointment to discuss your desired look and style.</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 p-8 rounded-2xl border border-red-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <CreditCard className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Payments</h3>
              <p className="text-gray-600 leading-relaxed">Multiple payment options with secure transactions. Pay in-app or at the salon.</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-8 rounded-2xl border border-yellow-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <Sparkles className="w-7 h-7 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Exclusive Deals</h3>
              <p className="text-gray-600 leading-relaxed">Access special promotions, loyalty rewards, and exclusive offers for regular customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section id="screenshots" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">See It In Action</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Beautiful interface designed for effortless booking</p>
          </div>
          <div className="flex justify-center">
            <img
              src="/image.png"
              alt="Salon Now App Screenshots"
              className="max-w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Passionate individuals dedicated to revolutionizing beauty services</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative mb-6 inline-block">
                <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-400 mx-auto transform group-hover:scale-105 transition-transform shadow-xl flex items-center justify-center">
                  <Users className="w-24 h-24 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah Johnson</h3>
              <p className="text-rose-400 font-medium mb-3">CEO & Founder</p>
              <p className="text-gray-600 text-sm leading-relaxed">Visionary leader with 10+ years in beauty industry innovation</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6 inline-block">
                <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 mx-auto transform group-hover:scale-105 transition-transform shadow-xl flex items-center justify-center">
                  <Users className="w-24 h-24 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Michael Chen</h3>
              <p className="text-blue-400 font-medium mb-3">CTO</p>
              <p className="text-gray-600 text-sm leading-relaxed">Tech expert building scalable solutions for modern beauty services</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6 inline-block">
                <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 mx-auto transform group-hover:scale-105 transition-transform shadow-xl flex items-center justify-center">
                  <Users className="w-24 h-24 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Emily Rodriguez</h3>
              <p className="text-amber-400 font-medium mb-3">Head of Design</p>
              <p className="text-gray-600 text-sm leading-relaxed">Creative designer crafting intuitive and delightful experiences</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6 inline-block">
                <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-400 mx-auto transform group-hover:scale-105 transition-transform shadow-xl flex items-center justify-center">
                  <Users className="w-24 h-24 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">David Kim</h3>
              <p className="text-green-400 font-medium mb-3">Product Manager</p>
              <p className="text-gray-600 text-sm leading-relaxed">Strategic thinker connecting user needs with business goals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-400 to-pink-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-rose-100 text-lg">Active Users</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1,200+</div>
              <div className="text-rose-100 text-lg">Professional Stylists</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">200K+</div>
              <div className="text-rose-100 text-lg">Bookings Completed</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4.8</div>
              <div className="text-rose-100 text-lg">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get Started Today</h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Join thousands of satisfied customers who have transformed their beauty routine with Salon Now
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-rose-400 text-white px-8 py-4 rounded-xl font-semibold hover:bg-rose-500 transition-all transform hover:scale-105 shadow-lg">
              Download for iOS
            </button>
            <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg">
              Download for Android
            </button>
          </div>
          <p className="text-gray-500">Have questions? Contact us at <a href="mailto:hello@salonnow.app" className="text-rose-400 hover:underline">hello@salonnow.app</a></p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Scissors className="w-6 h-6 text-rose-400" />
              <span className="text-2xl font-bold">Salon Now</span>
            </div>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 Salon Now. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

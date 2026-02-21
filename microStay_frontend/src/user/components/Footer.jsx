import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                {/* BRAND */}
                <div>
                    <Link to="/" className="text-3xl font-extrabold text-white mb-6 block">
                        Micro<span className="text-blue-500">Stay</span>
                    </Link>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                        Experience the new standard of micro-stays.
                        Premium hotels, flexible hours, and instant booking
                        at your fingertips.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition text-white">
                            <Facebook size={18} />
                        </a>
                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-400 transition text-white">
                            <Twitter size={18} />
                        </a>
                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-pink-600 transition text-white">
                            <Instagram size={18} />
                        </a>
                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-700 transition text-white">
                            <Linkedin size={18} />
                        </a>
                    </div>
                </div>

                {/* LINKS */}
                <div>
                    <h4 className="text-white font-bold text-lg mb-6">Company</h4>
                    <ul className="space-y-4">
                        <li><Link to="/about" className="hover:text-blue-400 transition">About Us</Link></li>
                        <li><Link to="/careers" className="hover:text-blue-400 transition">Careers</Link></li>
                        <li><Link to="/press" className="hover:text-blue-400 transition">Press</Link></li>
                        <li><Link to="/blog" className="hover:text-blue-400 transition">Blog</Link></li>
                    </ul>
                </div>

                {/* SUPPORT */}
                <div>
                    <h4 className="text-white font-bold text-lg mb-6">Support</h4>
                    <ul className="space-y-4">
                        <li><Link to="/help" className="hover:text-blue-400 transition">Help Center</Link></li>
                        <li><Link to="/safety" className="hover:text-blue-400 transition">Safety Center</Link></li>
                        <li><Link to="/terms" className="hover:text-blue-400 transition">Terms of Service</Link></li>
                        <li><Link to="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
                    </ul>
                </div>

                {/* CONTACT */}
                <div>
                    <h4 className="text-white font-bold text-lg mb-6">Contact</h4>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <MapPin size={20} className="text-blue-500 mt-1" />
                            <span>123 Innovation Dr,<br />Tech City, TC 90210</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone size={20} className="text-blue-500" />
                            <span>+1 (555) 123-4567</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail size={20} className="text-blue-500" />
                            <span>support@microstay.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                &copy; {new Date().getFullYear()} MicroStay. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;

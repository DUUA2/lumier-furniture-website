import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-lumiere-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-bold mb-4">
              Lumier <span className="text-lumiere-gold">Furniture</span>
            </div>
            <p className="text-gray-400 mb-2">
              Premium furniture for the modern Nigerian home. Rent or buy with flexible payment plans.
            </p>
            <p className="text-gray-500 text-sm mb-4">
              RC: 3662809
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-lumiere-gold transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-lumiere-gold transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-lumiere-gold transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/explore">
                  <span className="hover:text-lumiere-gold transition-colors cursor-pointer">Living Room</span>
                </Link>
              </li>
              <li>
                <Link href="/explore">
                  <span className="hover:text-lumiere-gold transition-colors cursor-pointer">Bedroom</span>
                </Link>
              </li>
              <li>
                <Link href="/explore">
                  <span className="hover:text-lumiere-gold transition-colors cursor-pointer">Dining Room</span>
                </Link>
              </li>
              <li>
                <Link href="/explore">
                  <span className="hover:text-lumiere-gold transition-colors cursor-pointer">Office</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/help">
                  <span className="hover:text-lumiere-gold transition-colors cursor-pointer">Help Center</span>
                </Link>
              </li>
              <li>
                <Link href="/returns">
                  <span className="hover:text-lumiere-gold transition-colors cursor-pointer">Returns</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="hover:text-lumiere-gold transition-colors cursor-pointer">Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Get updates on new arrivals and special offers</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter email"
                className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-lumiere-gold"
              />
              <button className="bg-lumiere-gold text-lumiere-black px-4 py-2 rounded-r-lg hover:bg-lumiere-gold/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <hr className="border-gray-700 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">&copy; 2024 Lumiere Furniture. All rights reserved.</p>
          <div className="flex space-x-6 text-gray-400 mt-4 md:mt-0">
            <Link href="/privacy">
              <span className="hover:text-lumiere-gold transition-colors cursor-pointer">Privacy Policy</span>
            </Link>
            <Link href="/terms-of-service">
              <span className="hover:text-lumiere-gold transition-colors cursor-pointer">Terms of Service</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Dumbbell className="text-black size-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">Iron</span>
            </div>
            <h4 className="text-4xl md:text-6xl font-black uppercase mb-10 leading-[0.9]">
              Start Your Fitness <br /><span className="text-white/30">Journey Today.</span>
            </h4>
            <Link to="/register">
              <Button variant="premium" size="lg" className="h-14 px-10 rounded-full text-lg">
                Become a Member
              </Button>
            </Link>
          </div>
          
          <div className="space-y-6">
            <h5 className="text-xs font-black uppercase tracking-widest text-white/40">Navigation</h5>
            <ul className="space-y-4 text-sm font-bold text-white/60">
              <li><a href="#" className="hover:text-white transition-colors uppercase">Home</a></li>
              <li><a href="#features" className="hover:text-white transition-colors uppercase">Features</a></li>
              <li><a href="#membership" className="hover:text-white transition-colors uppercase">Membership</a></li>
              <li><a href="#app" className="hover:text-white transition-colors uppercase">PWA Showcase</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-xs font-black uppercase tracking-widest text-white/40">Management</h5>
            <ul className="space-y-4 text-sm font-bold text-white/60">
              <li><a href="#" className="hover:text-white transition-colors uppercase">Staff Portal</a></li>
              <li><a href="#" className="hover:text-white transition-colors uppercase">Admin Dashboard</a></li>
              <li><a href="#" className="hover:text-white transition-colors uppercase">System Status</a></li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h5 className="text-xs font-black uppercase tracking-widest text-white/40">Support</h5>
            <ul className="space-y-4 text-sm font-bold text-white/60">
              <li><a href="#" className="hover:text-white transition-colors uppercase">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors uppercase">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors uppercase">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
          <div>© 2026 IRON ELITE FITNESS MANAGEMENT. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

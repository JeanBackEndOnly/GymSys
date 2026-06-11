import { Check, ShieldCheck, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Membership = () => {
  const features = [
    "₱500 One-time Registration Fee",
    "Flexible Monthly, Quarterly, & Yearly Contracts",
    "Smart QR Dynamic Check-in",
    "Access to Interactive Workout Planner",
    "Real-time Attendance Tracking",
    "Face-to-face Secure Payments at Counter",
    "No Auto-charges or Online Fees",
    "Instant PWA App Activation"
  ];

  return (
    <section id="membership" className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto text-center mb-12 md:mb-24">
        <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-white/40 mb-4">Membership</h2>
        <h3 className="text-4xl md:text-7xl font-black uppercase mb-6 md:mb-8 text-balance">
          Join the <span className="text-gradient">Elite.</span>
        </h3>
        <p className="text-white/50 max-w-2xl mx-auto text-base md:text-lg font-medium px-4">
          One all-inclusive membership for those who demand the absolute best. No tiers, no compromises—just pure performance.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="relative group">
          {/* Animated Background Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/5 rounded-[40px] blur-xl opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative glass border-white/10 rounded-3xl md:rounded-[40px] overflow-hidden">
            <div className="flex flex-col md:grid md:grid-cols-5 h-full">
              {/* Left Side: Pricing & CTA */}
              <div className="md:col-span-2 p-8 md:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5 bg-white/[0.02]">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest mb-6">
                    <Star className="size-3 fill-current" />
                    All-Access Pass
                  </div>
                  <h4 className="text-2xl font-black uppercase tracking-tight mb-4 text-white">Elite Membership</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">₱</span>
                    <span className="text-6xl md:text-7xl font-black leading-none text-white">1,500</span>
                    <span className="text-sm font-bold uppercase text-white/40">/ mo</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link to="/register">
                    <Button variant="premium" size="lg" className="w-full h-14 rounded-full text-lg font-bold uppercase">
                      Apply Now
                    </Button>
                  </Link>
                  <Button variant="ghost" size="lg" className="w-full h-14 rounded-full text-white/60 hover:text-white border border-white/5 hover:bg-white/5 uppercase text-xs tracking-widest pointer-events-none">
                    Payments are Face-to-Face Only
                  </Button>
                </div>
              </div>

              {/* Right Side: Features Grid */}
              <div className="md:col-span-3 p-8 md:p-16">
                <h5 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-6 md:mb-8">What's Included</h5>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 md:gap-y-6">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="size-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="size-3 text-white" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-medium text-white/70">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
                   <div className="flex items-center gap-4">
                     <ShieldCheck className="size-8 text-white/20" />
                     <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 leading-tight">
                       No Online <br />Transactions
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <Zap className="size-8 text-white/20" />
                     <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 leading-tight">
                       Secure In-Person <br />Cashier Approval
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-12 text-white/30 text-xs font-bold uppercase tracking-[0.2em]">
          Invitation Only. Limited to 500 Active Members.
        </p>
      </div>
    </section>
  );
};

export default Membership;

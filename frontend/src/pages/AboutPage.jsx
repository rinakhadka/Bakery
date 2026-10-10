import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Sparkles, 
  Award, 
  Clock, 
  ShieldCheck, 
  Users, 
  ChefHat, 
  ArrowRight 
} from 'lucide-react';

/**
 * AboutPage Component
 * Bakery story, founding philosophy, ingredients commitment, and master bakers.
 */
export default function AboutPage() {
  const values = [
    {
      icon: <Award className="w-6 h-6 text-[#9F5F2B]" />,
      title: 'Uncompromising Quality',
      desc: 'We use genuine European butter with 84% butterfat, organic stone-ground flours, and pure Madagascar vanilla beans. Never margarine or cheap fillers.'
    },
    {
      icon: <Clock className="w-6 h-6 text-[#9F5F2B]" />,
      title: 'Slow Fermentation',
      desc: 'Our rustic sourdough breads undergo a 36-hour cold fermentation process, developing intricate flavors, crackly crusts, and gentle digestibility.'
    },
    {
      icon: <Heart className="w-6 h-6 text-[#9F5F2B]" />,
      title: 'Handcrafted With Love',
      desc: 'Every morning at 4:00 AM, our bakers shape each croissant, proof each brioche, and decorate each celebration cake by hand with artisan care.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#9F5F2B]" />,
      title: 'Zero Artificial Additives',
      desc: 'No artificial shelf-life extenders, chemical dough conditioners, or artificial coloring. Real food crafted for real moments.'
    }
  ];

  const team = [
    {
      name: 'Chef Amit Roy',
      role: 'Head Pastry Chef & Co-Founder',
      experience: '12 years in French & Viennoiserie Baking',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Bikash Shrestha',
      role: 'Master Sourdough Baker',
      experience: 'Specialist in Hearth Breads & Wild Yeast Starters',
      image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Sarim Karki',
      role: 'Senior Cake Decorator',
      experience: 'Specialist in Custom Wedding & Celebration Cakes',
      image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Hero Story Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8D2D7] text-[#2C1810] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#9F5F2B]" />
            <span>Our Heritage & Passion</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C1810] leading-tight">
            Baking With Honesty, <br />
            <span className="text-[#9F5F2B] italic font-normal">One Loaf at a Time</span>
          </h1>

          <p className="text-sm sm:text-base text-[#6B5347] leading-relaxed">
            Sweet Crumbs Bakery started as a cozy kitchen dream in Kathmandu. We were tired of factory-produced, pre-packaged bakery goods full of artificial improvers that stayed soft on supermarket shelves for weeks.
          </p>

          <p className="text-sm text-[#6B5347] leading-relaxed">
            We wanted to rediscover the magic of ancient baking: the crisp snap of a fresh baguette, the aroma of cultured butter caramelizing in the oven, and the joy of slicing into a birthday cake made with real strawberries and rich dairy cream.
          </p>

          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-bold text-white bg-[#9F5F2B] hover:bg-[#834C1F] transition-all shadow-sm"
            >
              <span>Explore Our Bakes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80"
              alt="Sweet Crumbs Bakery team kneading dough"
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-[#2C1810] text-white p-5 rounded-2xl shadow-xl max-w-xs border border-[#4A3328] hidden sm:block">
            <span className="font-serif text-3xl font-bold text-[#D4AF37] block">100%</span>
            <span className="text-xs text-[#FAF4EB]/90">
              Natural sourdough levain and authentic dairy butter in every recipe.
            </span>
          </div>
        </div>
      </div>

      {/* Bakery Pillars / Values */}
      <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-8 sm:p-14 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-widest text-[#9F5F2B] uppercase">
            Our Standards
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#2C1810]">
            The Sweet Crumbs Philosophy
          </h2>
          <p className="text-xs text-[#6B5347]">
            We follow traditional European techniques while using wholesome local Himalayan dairy and organic ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-[#EADBCC] space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#F8D2D7]/60 flex items-center justify-center">
                {v.icon}
              </div>
              <h3 className="font-serif text-base font-bold text-[#2C1810]">
                {v.title}
              </h3>
              <p className="text-xs text-[#6B5347] leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Master Bakers Team */}
      <div className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-widest text-[#9F5F2B] uppercase">
            Meet the Artisans
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#2C1810]">
            Passionate Hands Behind Every Bake
          </h2>
          <p className="text-xs text-[#6B5347]">
            Every recipe is developed with love, patient practice, and dedication to excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-[#EADBCC] shadow-xs group">
              <div className="aspect-4/3 overflow-hidden bg-[#FAF4EB]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-1">
                <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-[#9F5F2B]">
                  {member.role}
                </p>
                <p className="text-xs text-[#7A6152] pt-2">
                  {member.experience}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Heart, Target, Users, Award, MapPin, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginPopup from '@/components/LoginPopup';
import { useAuth } from '@/contexts/AuthContext';

const About = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Auto-show login after 1 minute
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        setShowLogin(true);
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [user]);

  const values = [
    {
      icon: Heart,
      title: 'Compassionate Support',
      description: 'We understand the challenges families face when returning to Odisha and are here to help with empathy and care.'
    },
    {
      icon: Target,
      title: 'Accurate Information',
      description: 'Providing verified, up-to-date information about schools to help you make informed decisions for your children.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by parents, for parents. Real reviews and ratings from families who have experienced these schools firsthand.'
    },
    {
      icon: Award,
      title: 'Quality Education',
      description: 'Committed to helping you find schools that provide excellent education and support your child\'s holistic development.'
    }
  ];

  const stats = [
    { label: 'Schools Listed', value: '20+', icon: MapPin },
    { label: 'Cities Covered', value: '30+', icon: MapPin },
    { label: 'Parent Reviews', value: '100+', icon: Star },
    { label: 'Families Helped', value: '500+', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              About Our Mission
            </h1>
            <p className="text-xl md:text-2xl text-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Helping families find the perfect educational home in Odisha
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="edu-card p-8 text-center">
              <CardContent className="space-y-6">
                <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We exist to support families returning from abroad to Odisha in finding the best educational 
                  opportunities for their children. Through honest reviews, comprehensive ratings, and detailed 
                  school information, we aim to make the transition back home as smooth as possible for families 
                  seeking quality education in their home state.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our platform connects you with real experiences from other parents, helping you make informed 
                  decisions about your child's educational journey in Odisha. We believe every child deserves 
                  access to quality education, and every parent deserves transparent information to make the 
                  best choices for their family.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="edu-card text-center group hover:scale-105 transition-transform duration-300"
              >
                <CardContent className="p-6">
                  <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-muted-foreground">
              Numbers that reflect our commitment to families
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="edu-card text-center">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
              <p className="text-xl text-muted-foreground">
                Born from personal experience and community need
              </p>
            </div>

            <Card className="edu-card">
              <CardContent className="p-8">
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Odisha School Finder was born from the real challenges faced by families returning 
                    to Odisha after years abroad. As parents ourselves, we understand the anxiety of 
                    choosing the right school for your children when you're not familiar with the 
                    current educational landscape.
                  </p>
                  
                  <p>
                    When we returned to Odisha, we found it incredibly difficult to get honest, 
                    comprehensive information about schools. We had to rely on word-of-mouth, 
                    incomplete websites, and time-consuming visits to make informed decisions. 
                    This experience inspired us to create a platform that would make this process 
                    easier for other families.
                  </p>
                  
                  <p>
                    Today, our platform serves hundreds of families who are making the transition 
                    back to Odisha. We've built a community of parents who share their genuine 
                    experiences, helping each other find the best educational opportunities for 
                    their children in the beautiful state of Odisha.
                  </p>
                  
                  <p className="font-semibold text-foreground">
                    We're not just a directory – we're a community of families supporting families, 
                    ensuring that every child gets the quality education they deserve in their homeland.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Have Questions About Our Mission?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            We'd love to hear from you and help with your school search journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="inline-block">
              <span className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 rounded-lg transition-colors inline-block">
                Contact Us
              </span>
            </a>
            <a href="/schools" className="inline-block">
              <span className="bg-white/10 text-white hover:bg-white/20 font-semibold px-8 py-3 rounded-lg border border-white/30 transition-colors inline-block">
                Browse Schools
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
      />

      {/* Content Overlay for Non-logged Users */}
      {!user && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 pointer-events-none"
          style={{ display: showLogin ? 'block' : 'none' }}
        />
      )}

      <Footer />
    </div>
  );
};

export default About;
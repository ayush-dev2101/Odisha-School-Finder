import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginPopup from '@/components/LoginPopup';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Auto-show login after 1 minute
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        setShowLogin(true);
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [user]);

  // Auto-fill email if user is logged in
  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user, formData.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: user?.email || '', message: '' });
      }, 3000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'hello@odishaschools.in',
      description: 'Get in touch via email'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+91 63703 55930',
      description: 'Speak with our team'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Bhubaneswar, Odisha',
      description: 'Our office location'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: 'Mon - Fri: 9 AM - 6 PM',
      description: 'When we\'re available'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              We're here to help you find the perfect school for your child
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="edu-card">
              <CardHeader>
                <h2 className="text-2xl font-bold">Send us a Message</h2>
                <p className="text-muted-foreground">
                  Have questions about schools or need personalized recommendations? We're here to help!
                </p>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8 animate-bounce-in">
                    <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-success mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for reaching out. We'll respond within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your requirements, questions, or how we can help you..."
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="edu-button-primary w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Sending Message...
                        </div>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By submitting this form, you agree to our Privacy Policy and Terms of Service.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="edu-card group hover:scale-105 transition-transform">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-primary p-3 rounded-lg group-hover:scale-110 transition-transform">
                          <info.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{info.title}</h3>
                          <p className="text-primary font-semibold">{info.details}</p>
                          <p className="text-sm text-muted-foreground">{info.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <Card className="edu-card">
              <CardHeader>
                <h3 className="text-xl font-bold">Common Questions</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How accurate are the school ratings?</h4>
                  <p className="text-sm text-muted-foreground">
                    All ratings are based on verified parent reviews and our independent research. 
                    We continuously update information to ensure accuracy.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Do you charge for school recommendations?</h4>
                  <p className="text-sm text-muted-foreground">
                    Our basic services are completely free. We believe every family deserves 
                    access to quality school information.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Can you help with school admissions?</h4>
                  <p className="text-sm text-muted-foreground">
                    While we provide information and guidance, admission processes are handled 
                    directly by the schools. We can guide you on requirements and procedures.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="edu-card bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Need Immediate Help?</h3>
                <p className="text-muted-foreground mb-4">
                  For urgent inquiries about school admissions or deadlines
                </p>
                <Button className="edu-button-primary">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now: +91 63703 55930
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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

export default Contact;
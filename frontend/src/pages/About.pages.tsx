import React from 'react';
import HeroSection from '../components/About Page Components/HeroAbout/Hero.about';
import FeatureSection from '../components/About Page Components/FeaturesAbout/Feature.about';
import TeamSection from '../components/About Page Components/Team.about';
// import TestimonialSection from '../components/About Page Components/Testimonials/Testimonial.about';
import HowItWorksSection from '../components/About Page Components/ItWorks/HowItWorks.about';
import WhyChooseSection from '../components/About Page Components/ChooseUs/Choose.about';
import aboutImg from "../assets/aboutHero.jpg"

const features = [
  {
    title: 'Track Your Expenses',
    description: 'Easily track and categorize all your expenses with detailed reports.',
    icon: 'wallet',
  },
  {
    title: 'Set Budgets',
    description: 'Set and monitor your budget limits to stay on top of your finances.',
    icon: 'graph-up-arrow',
  },
  {
    title: 'Get Notifications',
    description: 'Receive alerts when your spending exceeds your budget.',
    icon: 'bell',
  },
  {
    title: 'Detailed Reports',
    description: 'Get monthly summaries and reports to help analyze your spending habits.',
    icon: 'chart-bar',
  },
  {
    title: 'Cloud Backup',
    description: 'Your data is safely stored and backed up in the cloud.',
    icon: 'cloud-upload',
  },
];

const testimonials = [
  {
    name: 'Alice Johnson',
    review: 'ExpenseEye has completely transformed the way I manage my personal finances. It’s so easy to use!',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Mark Spencer',
    review: 'The budgeting feature keeps me on track, and the notifications are a lifesaver!',
    image: 'https://via.placeholder.com/150',
  },
];

const teamMembers = [
  {
    name: 'John Doe',
    role: 'CEO & Founder',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Jane Smith',
    role: 'Lead Developer',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Sam Wilson',
    role: 'UI/UX Designer',
    image: 'https://via.placeholder.com/150',
  },
];

const AboutPage: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Hero Section */}
      <HeroSection
        title="About ExpenseEye"
        subtitle="Manage your expenses efficiently and effortlessly with ExpenseEye."
        backgroundImage={aboutImg}
      />

      
      <WhyChooseSection />

      
      <FeatureSection features={features} />

    
      <HowItWorksSection />

    
      {/* <TestimonialSection testimonials={testimonials} /> */}

      
      <TeamSection teamMembers={teamMembers} />

      
      {/* <CallToActionSection
        title="Get Started with ExpenseEye"
        description="Join thousands of users already tracking their expenses with ease!"
        buttonText="Sign Up Now"
      /> */}
    </div>
  );
};

export default AboutPage;

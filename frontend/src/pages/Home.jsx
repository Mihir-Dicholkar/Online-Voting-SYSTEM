import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faVoteYea, faChartBar, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  // Refs for each section to apply fade-in effect
  const heroRef = useRef(null);
  const howItWorksRef = useRef(null);
  const featuresRef = useRef(null);
  const faqRef = useRef(null);
  const ctaRef = useRef(null);

  // Check if elements are in view for animations
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const howItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.3 });
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const faqInView = useInView(faqRef, { once: true, amount: 0.3 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  // Scroll progress for parallax effects
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Spring animation for smoother interactions
  const springConfig = { damping: 25, stiffness: 300 };
  const scaleSpring = useSpring(1, springConfig);

  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "How does the election process work at the ground level?",
      answer: "At the ground level, elections begin with voter registration and the establishment of local polling stations. Candidates file nominations, and campaigns are conducted. On election day, voters cast their ballots at designated locations. This local process forms the foundation for all larger-scale elections."
    },
    {
      question: "What is the role of a State-level Election Commission?",
      answer: "A State-level Election Commission is responsible for overseeing and conducting elections within a specific state. This includes preparing and updating voter lists, delimiting constituencies, monitoring political parties, and ensuring free and fair elections. They work in conjunction with local authorities to manage the entire electoral process."
    },
    {
      question: "Why is my individual vote so important?",
      answer: "Your vote is the cornerstone of democracy. It's your voice in choosing representatives who will make decisions that affect your daily life, from local policies to national laws. A single vote can decide the outcome of a close election, so every ballot cast has the power to shape the future of your community and country. Participating is a civic duty and a right that ensures the government remains accountable to the people."
    },
    {
      question: "How does an online voting system improve the election process?",
      answer: "Online voting systems like VoteEase can increase voter turnout by making the process more accessible and convenient. They reduce administrative costs, minimize the risk of human error in counting, and provide real-time results. With robust security measures, online platforms can also enhance the transparency and integrity of the election, offering a secure and efficient alternative to traditional methods."
    },
  ];

  // Container variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Item variants for individual elements
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          className="relative bg-gradient-to-br from-blue-500 to-purple-600 text-white py-24 px-4 text-center rounded-lg shadow-xl overflow-hidden"
          style={{ y: heroY, opacity: heroOpacity }}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <div className="container mx-auto">
            <motion.h1 
              className="text-5xl md:text-6xl font-extrabold leading-tight mb-4"
              variants={itemVariants}
            >
              Your Voice, Your Vote, Simplified.
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Secure, transparent, and easy online elections.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                to="/login"
                className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-100 transform transition duration-300 ease-in-out text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Now
              </Link>
            </motion.div>
          </div>
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full opacity-10"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 w-60 h-60 bg-white rounded-full opacity-10"
              animate={{
                x: [0, -50, 0],
                y: [0, 100, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          ref={howItWorksRef}
          className="py-20 px-4 bg-gray-50 text-gray-800 text-center"
          initial="hidden"
          animate={howItWorksInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <div className="container mx-auto">
            <motion.h2 
              className="text-4xl font-bold mb-12 text-blue-700"
              variants={itemVariants}
            >
              How VoteEase Works
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <motion.div 
                className="bg-white p-8 rounded-lg shadow-lg"
                variants={itemVariants}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <FontAwesomeIcon icon={faUserPlus} size="3x" className="text-purple-500 mb-4" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-3">1. Register & Verify</h3>
                <p className="text-gray-600">
                  Sign up easily and complete a quick verification process to ensure secure voting.
                </p>
              </motion.div>
              <motion.div 
                className="bg-white p-8 rounded-lg shadow-lg"
                variants={itemVariants}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <FontAwesomeIcon icon={faVoteYea} size="3x" className="text-green-500 mb-4" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-3">2. Cast Your Vote</h3>
                <p className="text-gray-600">
                  Browse active elections and cast your vote securely from any device.
                </p>
              </motion.div>
              <motion.div 
                className="bg-white p-8 rounded-lg shadow-lg"
                variants={itemVariants}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <FontAwesomeIcon icon={faChartBar} size="3x" className="text-red-500 mb-4" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-3">3. View Results</h3>
                <p className="text-gray-600">
                  Access real-time election results and ensure transparency.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Key Features Section */}
        <motion.section
          ref={featuresRef}
          className="py-20 px-4 bg-blue-100 text-gray-800"
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <div className="container mx-auto">
            <motion.h2 
              className="text-4xl font-bold mb-12 text-blue-700 text-center"
              variants={itemVariants}
            >
              Key Features
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: "✔", title: "High Security", description: "Robust encryption and authentication protocols protect every vote." },
                { icon: "🌐", title: "User-Friendly Interface", description: "Intuitive design ensures a seamless voting experience for everyone." },
                { icon: "📊", title: "Real-time Results", description: "Monitor election progress and view results as they happen." },
                { icon: "✅", title: "Transparency", description: "Blockchain-inspired principles ensure verifiable and transparent elections." },
                { icon: "📱", title: "Mobile Responsive", description: "Vote from any device, whether it's your desktop, tablet, or smartphone." },
                { icon: "⏱️", title: "Time-Saving", description: "Eliminate manual processes and accelerate election management." }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.span 
                    className="text-blue-500 text-3xl"
                    whileHover={{ rotate: 10, scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {feature.icon}
                  </motion.span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          ref={faqRef}
          className="py-20 px-4 bg-gray-50 text-gray-800"
          initial="hidden"
          animate={faqInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <div className="container mx-auto max-w-4xl">
            <motion.h2 
              className="text-4xl font-bold mb-12 text-blue-700 text-center"
              variants={itemVariants}
            >
              Your Questions, Answered.
            </motion.h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  variants={itemVariants}
                  whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div
                    className="p-6 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleFaq(index)}
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className="text-gray-500"
                      />
                    </motion.div>
                  </div>
                  <motion.div
                    className="overflow-hidden"
                    initial={{ height: 0 }}
                    animate={{ height: openFaqIndex === index ? "auto" : 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 border-t pt-4 border-gray-200">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Call to Action Section */}
        <motion.section
          ref={ctaRef}
          className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-700 text-white text-center relative overflow-hidden"
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <div className="container mx-auto relative z-10">
            <motion.h2 
              className="text-4xl font-bold mb-6"
              variants={itemVariants}
            >
              Ready to Make Your Voice Heard?
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Join VoteEase today and participate in the future of democratic elections.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                to="/login"
                className="inline-block bg-white text-purple-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-100 transition duration-300 ease-in-out text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Register Now
              </Link>
            </motion.div>
          </div>
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-white opacity-5"
              animate={{
                x: [0, "100%", 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        </motion.section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faVoteYea, faChartBar, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Home = () => {
  // Refs for each section to apply fade-in effect
  const heroRef = useRef(null);
  const howItWorksRef = useRef(null);
  const featuresRef = useRef(null);
  const faqRef = useRef(null); // New ref for the FAQ section
  const ctaRef = useRef(null);

  const [openFaqIndex, setOpenFaqIndex] = useState(null); // State to control which FAQ item is open

  useEffect(() => {
    // Function to add 'opacity-100' class after a delay for fade-in effect
    const fadeIn = (ref, delay) => {
      if (ref.current) {
        setTimeout(() => {
          ref.current.classList.remove('opacity-0');
          ref.current.classList.add('opacity-100');
        }, delay);
      }
    };

    // Apply fade-in to each section with a staggered delay
    fadeIn(heroRef, 100);
    fadeIn(howItWorksRef, 300);
    fadeIn(featuresRef, 500);
    fadeIn(faqRef, 700); // Apply fade-in to the new FAQ section
    fadeIn(ctaRef, 900);
  }, []);

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

  return (
    <>
      <Header/>
      <main>
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative bg-gradient-to-br from-blue-500 to-purple-600 text-white py-24 px-4 text-center rounded-lg shadow-xl opacity-0 transition-opacity duration-1000 ease-in-out"
        >
          <div className="container mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 animate-bounce-in">
              Your Voice, Your Vote, Simplified.
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-0 animate-fade-in-delay-200">
              Secure, transparent, and easy online elections.
            </p>
            <Link
              to="/login"
              className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-100 transform hover:scale-105 transition duration-300 ease-in-out text-lg"
            >
              Get Started Now
            </Link>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          ref={howItWorksRef}
          className="py-20 px-4 bg-gray-50 text-gray-800 text-center opacity-0 transition-opacity duration-1000 ease-in-out"
        >
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-blue-700">How VoteEase Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
                <FontAwesomeIcon icon={faUserPlus} size="3x" className="text-purple-500 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">1. Register & Verify</h3>
                <p className="text-gray-600">
                  Sign up easily and complete a quick verification process to ensure secure voting.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
                <FontAwesomeIcon icon={faVoteYea} size="3x" className="text-green-500 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">2. Cast Your Vote</h3>
                <p className="text-gray-600">
                  Browse active elections and cast your vote securely from any device.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
                <FontAwesomeIcon icon={faChartBar} size="3x" className="text-red-500 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">3. View Results</h3>
                <p className="text-gray-600">
                  Access real-time election results and ensure transparency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section
          ref={featuresRef}
          className="py-20 px-4 bg-blue-100 text-gray-800 opacity-0 transition-opacity duration-1000 ease-in-out"
        >
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-blue-700 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
                <span className="text-blue-500 text-3xl">✔</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">High Security</h3>
                  <p className="text-gray-600">
                    Robust encryption and authentication protocols protect every vote.
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
                <span className="text-blue-500 text-3xl">🌐</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">User-Friendly Interface</h3>
                  <p className="text-gray-600">
                    Intuitive design ensures a seamless voting experience for everyone.
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
                <span className="text-blue-500 text-3xl">📊</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
                  <p className="text-gray-600">
                    Monitor election progress and view results as they happen.
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
                <span className="text-blue-500 text-3xl">✅</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Transparency</h3>
                  <p className="text-gray-600">
                    Blockchain-inspired principles ensure verifiable and transparent elections.
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
                <span className="text-blue-500 text-3xl">📱</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Mobile Responsive</h3>
                  <p className="text-gray-600">
                    Vote from any device, whether it's your desktop, tablet, or smartphone.
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
                <span className="text-blue-500 text-3xl">⏱️</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Time-Saving</h3>
                  <p className="text-gray-600">
                    Eliminate manual processes and accelerate election management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          ref={faqRef}
          className="py-20 px-4 bg-gray-50 text-gray-800 opacity-0 transition-opacity duration-1000 ease-in-out"
        >
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold mb-12 text-blue-700 text-center">
              Your Questions, Answered.
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.question}
                    </h3>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`text-gray-500 transform transition-transform duration-300 ${
                        openFaqIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openFaqIndex === index ? 'max-h-96 mt-4' : 'max-h-0'
                    }`}
                  >
                    <p className="text-gray-600 border-t pt-4 mt-4 border-gray-200">
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section
          ref={ctaRef}
          className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-700 text-white text-center opacity-0 transition-opacity duration-1000 ease-in-out"
        >
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Make Your Voice Heard?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join VoteEase today and participate in the future of democratic elections.
            </p>
            <Link
              to="/login"
              className="inline-block bg-white text-purple-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-100 transform hover:scale-105 transition duration-300 ease-in-out text-lg"
            >
              Register Now
            </Link>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
};

export default Home;
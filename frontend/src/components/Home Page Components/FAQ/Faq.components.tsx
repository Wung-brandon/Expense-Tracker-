import React from 'react';
import { Accordion } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Faq.css';

// Define animation variants
const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Faq() {
  const { ref: titleRef, inView: titleInView } = useInView({
    threshold: 0.1,
  });

  const { ref: accordionRef, inView: accordionInView } = useInView({
    threshold: 0.1,
  });

  return (
    <div className="faq container">
      {/* Title section with animation */}
      <motion.h2
        className="text-center mb-4"
        ref={titleRef}
        variants={fadeInVariants}
        initial="hidden"
        animate={titleInView ? 'visible' : 'hidden'}
        transition={{ duration: 0.5 }}
      >
        Frequently Asked Questions
      </motion.h2>

      {/* Accordion with animation */}
      <motion.div
        ref={accordionRef}
        variants={fadeInVariants}
        initial="hidden"
        animate={accordionInView ? 'visible' : 'hidden'}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>What is ExpenseEye?</Accordion.Header>
            <Accordion.Body>
              ExpenseEye is a powerful expense tracking application designed to help you manage your finances with ease. It provides a user-friendly platform to keep track of your spending and stay within your budget.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>How do I get started with ExpenseEye?</Accordion.Header>
            <Accordion.Body>
              Getting started is simple. Sign up for a free account, and you can begin tracking your expenses right away. The intuitive interface makes it easy to add expenses, set budgets, and monitor your financial health.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Can I use ExpenseEye on multiple devices?</Accordion.Header>
            <Accordion.Body>
              Yes, ExpenseEye is accessible from any device with internet access. Whether you're on your computer, tablet, or smartphone, you can track your expenses and manage your finances wherever you are.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header>Is my financial data secure with ExpenseEye?</Accordion.Header>
            <Accordion.Body>
              Absolutely. We take your privacy and security seriously. ExpenseEye uses advanced encryption and security measures to ensure that your data is protected at all times.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4">
            <Accordion.Header>How can I contact support?</Accordion.Header>
            <Accordion.Body>
              If you need help or have any questions, you can contact our support team through the support page or by emailing us directly at support@expenseeye.com.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </motion.div>
    </div>
  );
}

export default Faq;

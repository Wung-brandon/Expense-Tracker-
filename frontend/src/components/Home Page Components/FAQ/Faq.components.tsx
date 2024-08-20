
import "./Faq.css";
import { Accordion } from "react-bootstrap";

function Faq() {
  return (
    <div className="faq container">
      <h2 className="text-center mb-4 slide-top">Frequently Asked Questions</h2>
      <Accordion className="slide-right">
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
    </div>
  );
}

export default Faq;

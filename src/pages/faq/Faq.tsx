import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const faqData = [
  {
    question: "Is it really interest-free?",
    answer:
      "Yes, all the loans are interest-free. However, it is a member only service and there are limits and certain conditions to get an interest-free loan which are discussed later.",
  },
  {
    question: "Who can become a member?",
    answer:
      "Anybody who agrees with the principles of Mercy Financials can become a member by submitting an application here.",
  },
  {
    question: "What are the conditions to become a member?",
    answer:
      "All members have to pay a non-refundable applications fee of $20, a membership fee of $2/month and have minimum savings starting from $50/month.",
  },
  {
    question: "What are the benefits of membership?",
    answer:
      "You can save with Mercy (starting at $50/month), you can grow your savings by investing with Mercy (with a risk of loss sharing) and you can get interest-free loan for personal need or small(halal) business.",
  },
  {
    question: "Is membership free?",
    answer: "No.",
  },
  {
    question: "How much is the membership fee?",
    answer:
      "The non-refundable one-time application fee is $20 and the membership fee is $24/year which is a dollar and a half per month.",
  },
  {
    question: "Is it registered?",
    answer:
      "Yes, It is registered as a 501c(3) not-for-profit business in the state of Texas.",
  },
  {
    question: "What are the conditions to get an interest-free loan?",
    answer:
      "You can get a interest-free loan for personal need or small business. For personal need, you have to show proof of need and your inability to pay along with a clean payment history of at least three months. If there's a history of miss/late payment during the last loan repayment period, an extra three months wait period will be applied. For business loan, is has to be Islami Shariah Compliant (Halal) and State/Fed registered.",
  },
  {
    question: "How much I can get as interest-free loan?",
    answer:
      "The limit for interest-free loan is a factor of the age of membership and the savings balance. The personal limit is shown in the loan limits table below.",
  },
  {
    question: "What are the loan return/repayment periods?",
    answer:
      "The loan return period is directly related to the loan amount and could be calculated as shown in the repayment periods table below.",
  },
  {
    question: "How can I repay the loan?",
    answer:
      "The loan can be repaid in installments. The first installment is due within 60 days of receiving the loan.",
  },
  {
    question: "Can I get interest-free loan to buy a house?",
    answer:
      "Yes, as long as it is a primary house (not a rental or investment property) and the loan amount is within the maximum personal limit.",
  },
  {
    question: "Which are classified as personal needs?",
    answer:
      "Anything which are not earning profit such as rent, grocery, tuition, medical/utility/credit card bill, buying a vehicle or apartment for living etc.",
  },
  {
    question: "Can I invest with Mercy Financials?",
    answer:
      "Yes, you can invest with Mercy Financials when available and eligible to grow your savings. We do not anticipate loss but you have to sign a profit/Loss Sharing agreement in order to invest with Mercy Financials as a basic Islamic principle.",
  },
  {
    question: "Can I get a business loan interest-free?",
    answer:
      "Yes, as long as it is Islamic Shariah Compliant (Halal) and the loan amount is within personal maximum limit.",
  },
  {
    question: "Can I repay the loan in installments?",
    answer: "Yes",
  },
  {
    question: "Can I repay the loan in Cash/one-time payment?",
    answer:
      "Yes, while making your installments for loan repayment you can payoff the loan at any time by not missing any installments.",
  },
  {
    question: "How much I can save with Mercy Financials?",
    answer: "Savings start at only $50/month and there is no maximum limit.",
  },
  {
    question: "Is it only for Muslims?",
    answer:
      "No, although is is based on Islamic concept but it is not limited to Muslims only. There is no discrimination for membership based on race, color, religion etc.",
  },
  {
    question: "Is it a religious organization?",
    answer:
      "No, it is a financial organization based on Islamic concept of business and finance.",
  },
  {
    question: "Is it a bank?",
    answer: "No, but you can save, invest and get loan at Mercy Financials.",
  },
  {
    question: "Is it a credit union?",
    answer:
      "No, but it provides loan 100% interest-free for personal need and small business.",
  },
  {
    question: "Is it an US only service?",
    answer:
      "Yes, you can become a member from anywhere in the world but in order to get a loan there should be at least one co-borrower with Social Security Number (SSN).",
  },
  {
    question: "How to make a payment?",
    answer:
      "Payment could be made only via PayPal. Please add a note for each payment. Please visit here to make any payment.",
  },
  {
    question: "How to apply for a loan?",
    answer: "Please visit here to apply for a loan.",
  },
  {
    question: "What are the eligibilities to get a loan?",
    answer: `Eligibility: A member of the trust shall be eligible for the interest-free loan if-
    
1. The applicant is an active member for at least 90 days with no disciplinary violation in the last three months.
2. The member has no unpaid loan balance, did not freeze the membership, did not withdraw any fund, or no late payment in the last 90 days.
3. No missed payment in the last 180 days.
4. No unpaid membership fee.
5. The member duly fills the loan application form and provides the credit score and social security number. Mercy Financials holds the right to check the credit history of the applicant.
6. If a member does not have Social Security Number (SSN) or credit score while applying for a loan will need a standing member who has an active SSN and resides in the US as a co-borrower.
7. The applicant clearly mentions the reason for borrowing in detail and submits a plan (whether in installments or full amount) for repayment including a specific time frame.
8. The member provides a verified document of proof of income and proof of the need or if a verified proof of need is not readily available- a handwritten and signed statement would work- if they must provide the documentation whenever it is available.
9. Applicants pay a non-refundable loan application fee of $20.
10. There's sufficient fund available.`,
  },
  {
    question: "What is the process of getting a loan?",
    answer: `Procedure:
    
i. The Administrative director examines the application for its completion and passes it to the executive board if all required fields are completed.
ii. The executive body approves the application, the administrative director signs the form within seven days.
iii. The finance director will issue the loan within a maximum of seven days from the day it got approved through PayPal or electronic transfer.
iv. The loan recipient signs a receipt of the cash form.
v. The whole procedure shall not take more than two weeks for administrative processing in total.
vi. If adequate fund is not readily available, a hold will be placed on the application and will be approved as soon as the fund is available.`,
  },
  {
    question:
      "Can I get a loan for personal/family business or to invest somewhere else?",
    answer:
      "No. Business loans are allowed for Islamic Shariah-compliant and registered business entities. You can invest with Mercy Financials. but won't get a loan to invest somewhere else.",
  },
  {
    question: "Is there a fee for loan application?",
    answer: "Yes, there is a non-refundable $20 application fee.",
  },
  {
    question: "What is the maximum limit for personal loan?",
    answer: "The maximum limit for a personal loan is $15000.",
  },
];

const loanLimitsData = [
  {
    period: "Less than 2 year",
    firstApp: "Three times the balance*",
    returning: "Three times the balance",
  },
  {
    period: "Between 2 and 4 years",
    firstApp: "Four times the balance",
    returning: "Three times the balance",
  },
  {
    period: "Between 4 and 6 years",
    firstApp: "Five times the balance",
    returning: "Three times the balance",
  },
  {
    period: "More than 6 years",
    firstApp: "Six times the balance",
    returning: "Three times the balance",
  },
];

const repaymentData = [
  { amount: "<$2000", period: "6 months" },
  { amount: "$2000-$3999", period: "9 months" },
  { amount: "$4000-$5999", period: "12 months" },
  { amount: "$6000-$7999", period: "15 months" },
  { amount: "$8000-$9999", period: "18 months" },
  { amount: ">$10000", period: "24 months" },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mt-9">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-emerald-800 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-emerald-600 max-w-2xl mx-auto">
            Find answers to common questions about Mercy Financials'
            interest-free loans and membership benefits.
          </p>
        </motion.div>

        {/* Loan Limits Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-emerald-100 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-700 text-xl">
                Maximum Loan Limits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-emerald-200">
                      <th className="border border-emerald-300 px-4 py-3 text-left text-emerald-800 font-semibold">
                        Membership Period
                      </th>
                      <th className="border border-emerald-300 px-4 py-3 text-left text-emerald-800 font-semibold">
                        Maximum Loan Limit (First Application)
                      </th>
                      <th className="border border-emerald-300 px-4 py-3 text-left text-emerald-800 font-semibold">
                        Maximum Loan Limit (Returning Application)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanLimitsData.map((row, index) => (
                      <tr
                        key={index}
                        className="hover:bg-emerald-200 transition-colors"
                      >
                        <td className="border border-emerald-300 px-4 py-3 text-emerald-700">
                          {row.period}
                        </td>
                        <td className="border border-emerald-300 px-4 py-3 text-emerald-700">
                          {row.firstApp}
                        </td>
                        <td className="border border-emerald-300 px-4 py-3 text-emerald-700">
                          {row.returning}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-emerald-600 mt-4">
                *The balance mentioned here is the total balance if the member
                makes an approximately equal amount every month. If any member
                makes different monthly payments, any payments made 20% higher
                than the average payment amount will be excluded in calculating
                the adjusted average which will be multiplied by the number of
                payments to calculate the total adjusted balance. The maximum
                limit for personal loan is $15000.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Repayment Periods Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <Card className="bg-emerald-100 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-700 text-xl">
                Loan Repayment Periods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-emerald-200">
                      <th className="border border-emerald-300 px-4 py-3 text-left text-emerald-800 font-semibold">
                        Loan Amount
                      </th>
                      <th className="border border-emerald-300 px-4 py-3 text-left text-emerald-800 font-semibold">
                        Maximum Return Period
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {repaymentData.map((row, index) => (
                      <tr
                        key={index}
                        className="hover:bg-emerald-200 transition-colors"
                      >
                        <td className="border border-emerald-300 px-4 py-3 text-emerald-700">
                          {row.amount}
                        </td>
                        <td className="border border-emerald-300 px-4 py-3 text-emerald-700">
                          {row.period}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-emerald-600 mt-4">
                All loans are paid in installments. The first installment is due
                within 60 days of receiving the loan.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-emerald-100 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-700 text-xl">
                Questions & Answers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {faqData.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-emerald-100 border border-emerald-200 rounded-lg px-4 hover:bg-emerald-200 transition-colors"
                  >
                    <AccordionTrigger className="text-emerald-700 hover:text-emerald-800 text-left font-medium py-4 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-emerald-600 pb-4 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link to="/contact" className="text-emerald-600">
            Have more questions? Contact us for additional information about our
            services.
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

import { Container } from "~/components/Container";

const faqs = [
  [
    {
      question: "How do I know the clothes are in good condition?",
      answer:
        "At Sprift, we ensure all listed items meet our quality standards. Sellers provide detailed information about each item, including condition, and we encourage open communication between buyers and sellers for additional inquiries.",
    },
    
    {
      question: "How secure is a transaction on Sprift?",
      answer:
        "Your security is our priority. We use industry-standard encryption to protect your data and ensure secure transactions.",
    },
    {
      question: "Is there any age limit to use Sprift?",
      answer:
        "Sprift is open to users of all ages. However, users under the age of 18 should obtain parental consent.",
    },
  ],
  [
    {
      question: "Can I sell any kind of clothing?",
      answer:
        "Yes, as long as they meet our quality standards. Remember, Sprift is about offering unique, second-hand fashion items that can find a new home.",
    },
    {
      question: "How do the personalized recommendations work?",
      answer:
        "Sprift uses a sophisticated algorithm that learns from your preferences as you use the app. The more you swipe, the better it understands your style and provides tailored recommendations.",
    },
    {
      question: "Why should I use Sprift instead of other second-hand shops?",
      answer:
        "Sprift allows you to like or dislike items with just a swipe right or left, creating a more personalized thrifting experience. Alongside easy filtering and search features, Sprift makes it easy and quick to find exactly what you are looking for!",
    },
  ],
  [
    {
      question: "How does Sprift promote sustainability?",
      answer:
        "Sprift promotes sustainable fashion by facilitating the resale and reuse of clothing, thus reducing textile waste and promoting a circular fashion economy.",
    },
    {
      question: "How do I become a seller?",
      answer:
        "It's simple! Just create an account, list your items with photos and descriptions, and start selling. Our community is ready to discover your unique style.",
    },
    {
      question: "How does Sprift give back to the community?",
      answer:
        "At Sprift we plan to work alongside local, nonprofit thrift stores to give back to our community. We hope to provide those stores a free online platform to increase awareness and support of their missons.",
    },
  ],
];

export function Faqs() {
  return (
    <section
      id="faqs"
      aria-labelledby="faqs-title"
      className="border-t border-gray-200 py-16 sm:py-16"
    >
      <Container>
        <ul
          role="list"
          className="mx-auto mt-4 grid max-w-2xl grid-cols-1 gap-8 sm:mt-4 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="space-y-5">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex} className="pb-5 rounded-xl p-5 bg-[#f0f0f0] shadow-lg shadow-gray-100">
                    <h3 className="text-xl font-satoshi-bold leading-6 text-gray-700">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm font-general-sans-regular text-gray-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

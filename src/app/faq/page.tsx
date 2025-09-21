
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqData from "@/lib/faq-data.json";

export default function FAQPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Have questions? We've got answers.
        </p>
      </header>

      <div className="mx-auto max-w-3xl">
        {Object.entries(faqData).map(([category, qas]) => (
          <div key={category} className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold tracking-tight border-b pb-2">{category}</h2>
            <Accordion type="single" collapsible className="w-full">
              {qas.map((qa, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{qa.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {qa.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
}

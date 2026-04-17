import { Status, StatusIndicator, StatusLabel } from "@/components/kibo-ui/status";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/Buttons/button";

export function FAQs() {
    return (
        <main className="mx-auto w-full max-w-7xl space-y-7 px-6 md:px-12 py-24">
            <div className="flex items-center justify-start">
                <Status status="maintenance" className="border-neutral-200 shadow-2xs font-manrope">
                    <StatusIndicator />
                    <StatusLabel>FAQs</StatusLabel>
                </Status>
            </div>
            <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-15 w-full">

                <div className="space-y-4 md:w-1/3">
                    <h2 className="text-3xl font-medium tracking-tight text-gray-900 font-manrope">
                        Everything You Need to Know
                    </h2>
                    <p className="text-gray-600 font-inter text-start max-w-2xl">
                        Clear answers about how it works, what to expect, and how you can get the most out of it.
                    </p>

                    <Button className="bg-[#1C4ED6] text-white font-manrope rounded-3xl cursor-pointer py-5 mt-5">Contact Us</Button>
                </div>

                <Accordion className="w-full md:w-3/5 space-y-3" collapsible type="single">
                    {questions.map((item) => (
                        <AccordionItem 
                            className="bg-white rounded-[1.25rem] border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] px-5 sm:px-6" 
                            key={item.id} 
                            value={item.id}
                        >
                            <AccordionTrigger className="py-4 hover:no-underline focus-visible:underline focus-visible:ring-0 cursor-pointer text-left text-base font-medium text-[#111827] font-inter">
                                {item.title}
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 pt-0 text-gray-600 font-inter text-sm pr-8 leading-relaxed">
                                {item.content}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </main>
    );
}

const questions = [
    {
        id: "item-1",
        title: "What does this platform do?",
        content:
            "Our AI-powered platform helps you create, improve, and optimize your resume to stand out. It analyzes your content and suggests better wording, structure, and impact.",
    },
    {
        id: "item-2",
        title: "How does the AI improve my resume?",
        content:
            "The AI evaluates your resume for clarity, keywords, and effectiveness. It rewrites bullet points, enhances descriptions, and aligns your resume with industry standards.",
    },
    {
        id: "item-3",
        title: "Is this suitable for freshers and experienced professionals?",
        content:
            "Yes, whether you're a student, fresher, or experienced professional, the platform adapts to your level and helps craft a strong resume.",
    },
    {
        id: "item-4",
        title: "Can I customize my resume design?",
        content:
            "Absolutely. You can choose from modern, professional templates and customize them to match your style and industry.",
    },
    {
        id: "item-5",
        title: "Does it help with ATS (Applicant Tracking Systems)?",
        content:
            "Yes, our AI optimizes your resume with the right keywords and formatting to improve your chances of passing ATS screenings.",
    },
    {
        id: "item-6",
        title: "Do I need prior experience to use it?",
        content:
            "Not at all. The platform guides you step-by-step, making it easy even if you're building your first resume.",
    },
    {
        id: "item-7",
        title: "How do I get started?",
        content:
            "Simply sign up, enter your details, and let the AI generate or enhance your resume instantly. You can edit and download it anytime.",
    },
];

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Volume2, Square, Phone, Mail, User, BookOpen, DollarSign } from 'lucide-react';
const CONVERSATION_STEPS = {
    START: 0,
    GUIDED_LEARNING: 1,
    SHOW_SUGGESTIONS: 2,
    GET_NAME: 10, 
    GET_EMAIL: 11,
    GET_PHONE: 12,
    QUERY_OR_END: 13, 
    CLOSING: 14,
};
interface QueryButtonsProps {
    onOptionClick: (option: 'yes' | 'no') => void;
}
const QueryButtons: React.FC<QueryButtonsProps> = ({ onOptionClick }) => (
    <div className="flex flex-col gap-2 mt-3">
        <button
            onClick={() => onOptionClick('yes')}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors shadow-md flex items-center justify-center gap-2"
        >
            Yes, I have a query
        </button>
        <button
            onClick={() => onOptionClick('no')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded-lg text-sm transition-colors shadow-md flex items-center justify-center gap-2"
        >
            No, please close
        </button>
    </div>
);
interface SuggestionButtonsProps {
    onOptionClick: (query: string) => void;
}
const SuggestionButtons: React.FC<SuggestionButtonsProps> = ({ onOptionClick }) => (
    <div className="flex flex-col gap-2 mt-3">
        <button
            onClick={() => onOptionClick('Tell me about your courses')}
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-start gap-2"
        >
            <BookOpen className="w-4 h-4" /> Course Details
        </button>
        <button
            onClick={() => onOptionClick('What are the fees?')}
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-start gap-2"
        >
            <DollarSign className="w-4 h-4" /> Fees / Pricing
        </button>
        <button
            onClick={() => onOptionClick('How do I say Hello in Hindi?')}
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-start gap-2"
        >
            <Bot className="w-4 h-4" /> Translate 'Hello'
        </button>
    </div>
);
const suggestions = [
    {
        topic: 'Numbers (1 to 10)',
        text: "**Lesson 1: Numbers (1-10)**\n\n1: **Ek** (एक)\n2: **Do** (दो)\n3: **Teen** (तीन)\n4: **Chaar** (चार)\n5: **Paanch** (पाँच)\n6: **Cheh** (छह)\n7: **Saat** (सात)\n8: **Aath** (आठ)\n9: **Nau** (नौ)\n10: **Dus** (दस)\n\nType **NEXT** to learn the Days of the Week.",
        speak: 'Here is lesson one, numbers 1 to 10. 1: Ek (एक). 2: Do (दो). 3: Teen (तीन). 4: Chaar (चार). 5: Paanch (पाँच). 6: Cheh (छह). 7: Saat (सात). 8: Aath (आठ). 9: Nau (नौ). 10: Dus (दस). Type NEXT to continue.',
        nextTrigger: 'NEXT',
    },
    {
        topic: 'Days of the Week',
        text: "**Lesson 2: Days of the Week**\n\nSunday: **Ravivaar** (रविवार)\nMonday: **Somvaar** (सोमवार)\nTuesday: **Mangalvaar** (मंगलवार)\nWednesday: **Budhvaar** (बुधवार)\nThursday: **Guruvaar** (गुरुवार)\nFriday: **Shukravaar** (शुक्रवार)\nSaturday: **Shanivaar** (शनिवार)\n\nType **NEXT** to learn the Months.",
        speak: 'Lesson two, days of the week. Sunday: Ravivaar (रविवार). Monday: Somvaar (सोमवार). Tuesday: Mangalvaar (मंगलवार). Wednesday: Budhvaar (बुधवार). Thursday: Guruvaar (गुरुवार). Friday: Shukravaar (शुक्रवार). Saturday: Shanivaar (शनिवार). Type NEXT to continue.',
        nextTrigger: 'NEXT',
    },
    {
        topic: 'Months',
        text: "**Lesson 3: Common Months**\n\nJanuary: **Janvari** (जनवरी)\nFebruary: **Farvari** (फ़रवरी)\nMarch: **March** (मार्च)\nApril: **April** (अप्रैल)\nMay: **Mai** (मई)\nJune: **Jun** (जून)\nJuly: **Julai** (जुलाई)\nAugust: **August** (अगस्त)\nSeptember: **Sitambar** (सितंबर)\nOctober: **Aktubar** (अक्टूबर)\nNovember: **Navambar** (नवंबर)\nDecember: **Disambar** (दिसंबर)\n\nThat completes your guided lessons for now! Please type **DONE**.",
        speak: 'Lesson three, months of the year. January: Janvari (जनवरी). February: Farvari (फ़रवरी). March: March (मार्च). April: April (अप्रैल). May: Mai (मई). June: Jun (जून). July: Julai (जुलाई). August: August (अगस्त). September: Sitambar (सितंबर). October: Aktubar (अक्टूबर). November: Navambar (नवंबर). December: Disambar (दिसंबर). Type DONE to finish.',
        nextTrigger: 'DONE', 
    },
];
const WhatsAppFloat = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: 'नमस्ते! (Namaste / வணக்கம்) I\'m your Hindi learning assistant. Would you like a quick guided lesson on basic words before proceeding? Type **YES** or **NO**.',
            speak: true,
            speakText: 'Namaste! (नमस्ते) I am your Hindi learning assistant. Would you like a quick guided lesson?',
        },
    ]);
    const [input, setInput] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [step, setStep] = useState(CONVERSATION_STEPS.GUIDED_LEARNING); 
    const [leadData, setLeadData] = useState({ name: '', email: '', phone: '' });
    const [lessonIndex, setLessonIndex] = useState(0); 
    const whatsappNumber = "6397255377";
    const whatsappMessage = "Hello! I'm interested in learning Hindi at Raanuva Veeran Spoken Hindi Academy. Could you please provide more information?";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{7,}$/;
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);
    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            const hindiRegex = /[\u0900-\u097F]/;
            if (hindiRegex.test(text)) {
                utterance.lang = 'hi-IN'; 
                utterance.rate = 0.8; 
            } else {
                utterance.lang = 'en-US'; 
                utterance.rate = 0.9;
            }      
            utterance.pitch = 1;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = (e) => {
                console.error("Speech Synthesis Error:", e);
                setIsSpeaking(false);
            };
            window.speechSynthesis.speak(utterance);
        } else {
            console.error("Speech Synthesis not supported.");
        }
    };
    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };
    const fetchSimulatedAIResponse = (prompt) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const lowerPrompt = prompt.toLowerCase();
                let responseText;
                let speakText;
                if (lowerPrompt.includes('food') || lowerPrompt.includes('eat') || lowerPrompt.includes('khaana')) {
                    responseText = `The Hindi word for food/meal is **Khaana** (खाना).\n\n**English Translation:** Food/Meal\n**Tamil Translation:** Unavu (உணவு)\n\n**Example Usage:** "Is the food good?" translates to "Kya khaana achha hai?"`;
                    speakText = 'The Hindi word for food or meal is Khaana (खाना).';
                } else if (lowerPrompt.includes('travel') || lowerPrompt.includes('go') || lowerPrompt.includes('jaana')) {
                    responseText = `The basic verb 'to go' is **Jaana** (जाना).\n\n**English Translation:** To Go\n**Tamil Translation:** Selvathu (செல்வது)\n\n**Example Usage:** To say "I am going," you would say "Main jaa raha hoon."`;
                    speakText = 'The basic verb to go is Jaana (जाना).';
                } else if (lowerPrompt.includes('please') || lowerPrompt.includes('kindly') || lowerPrompt.includes('kripya')) {
                    responseText = `The best word for please is **Kripya** (कृपया).\n\n**English Translation:** Please\n**Tamil Translation:** Thayavuseydhu (தயவுசெய்து)`;
                    speakText = 'The best word for please is Kripya (कृपया).';
                } else if (lowerPrompt.includes('how are you')) {
                     responseText = `I'm doing well, thank you for asking! I'm ready to help you learn Hindi.`;
                     speakText = 'I am doing well, thank you for asking! I am ready to help you learn Hindi.';
                } else {
                    responseText = `I see you are asking about **${prompt.split(' ')[0]}**! The Hindi word for 'Need' or 'Requirement' is a valuable word to learn: **Zaroorat** (ज़रूरत).\n\nWhat other words do you need translated?`;
                    speakText = 'I am translating your word now. The Hindi word for need is Zaroorat (ज़रूरत).';
                }
                resolve({ text: responseText, speak: speakText });
            }, 1500);
        });
    };
    const lessons = {
        'hello|greetings|வணக்கம்': {
            text: `**Hindi Greetings / வாழ்த்துகள்:**\n\nThe formal and respectful greeting is **Namaste** (नमस्ते).\n\n**English Translation:** Hello/Greetings\n**Tamil Translation:** Vanakkam (வணக்கம்)`,
            speak: 'The formal and respectful greeting is Namaste (नमस्ते).'
        },
        'course|courses|क्लास|classes': {
            text: `📚 **Our Hindi Courses:**\nWe offer structured courses at Raanuva Veeran Academy. Our courses run for 3 months with daily online classes. Contact us via WhatsApp for enrollment!`,
            speak: 'We offer structured courses at Raanuva Veeran Academy. Our courses run for 3 months with daily online classes.'
        },
        'fee|fees|price|cost': {
            text: `💰 **Course Fees:**\nMonthly: ₹5,000 per month. Total course fee is ₹15,000. Please contact us on WhatsApp for flexible installment options.`,
            speak: 'Our course fees are five thousand rupees per month. Total course fee is fifteen thousand rupees.'
        },
    };
    const getResponse = (userInput) => {
        const input = userInput.toLowerCase();
        for (const [key, value] of Object.entries(lessons)) {
            const patterns = key.split('|');
            if (patterns.some(pattern => input.includes(pattern))) {
                return value;
            }
        }
        return null;
    };
    const isTerminationKeyword = (input) => {
        const lowerInput = input.toLowerCase().trim();
        return ['stop', 'end', 'close', 'thank you', 'done', 'finish', 'exit', 'bye'].some(keyword => lowerInput.includes(keyword));
    };
    const botReply = (text, stepChange = null, speakTextContent = null, options = {}) => {
        const speechText = speakTextContent || text;
        const newMsg = { type: 'bot', text, speak: true, speakText: speechText, ...options };
        setMessages(prev => [...prev, newMsg]);
        if (stepChange !== null) {
            setStep(stepChange);
        }
        setTimeout(() => speakText(newMsg.speakText), 300);
    };
    const startLeadCapture = () => {
        const initialLeadMessage = "That completes your lessons for now! We'd love to send you a complete vocabulary guide. Could you please provide your **full name** to continue?";
        botReply(initialLeadMessage, CONVERSATION_STEPS.GET_NAME, "That completes your lessons. Please provide your full name to receive a complete vocabulary guide.");
    };
    const handleGuidedLearning = (userInput) => {
        const lowerInput = userInput.toLowerCase();
        const currentLesson = suggestions[lessonIndex];
        if (lessonIndex === 0 && (lowerInput.includes('yes') || lowerInput.includes('no'))) {
            if (lowerInput.includes('yes')) {
                if (messages.length > 2 && messages[messages.length-2]?.text?.includes(currentLesson.text.split('\n')[0])) { 
                    botReply("You are already on Lesson 1. Type **NEXT** to continue.", null, "You are already on Lesson one. Type next to continue.");
                } else {
                    botReply(currentLesson.text, CONVERSATION_STEPS.GUIDED_LEARNING, currentLesson.speak);
                }
            } else {
                startLeadCapture(); 
            }
            return { status: 'lesson_proceed' };
        }
        if (lowerInput === currentLesson.nextTrigger.toLowerCase()) {
            if (currentLesson.nextTrigger === 'DONE') {
                startLeadCapture();
            } else if (lessonIndex < suggestions.length - 1) {
                const nextLessonIndex = lessonIndex + 1;
                const nextLesson = suggestions[nextLessonIndex];
                setLessonIndex(nextLessonIndex); 
                botReply(nextLesson.text, CONVERSATION_STEPS.GUIDED_LEARNING, nextLesson.speak);
            }
            return { status: 'lesson_proceed' };
        } 
        return { status: 'general_query' };
    };
    const handleLeadCapture = async (userInput) => {
        let nextStep = step;
        let botMessage = '';
        let valid = true;
        let speakText = '';
        switch (step) {
            case CONVERSATION_STEPS.GET_NAME:
                if (userInput.length < 2) {
                    botMessage = "Please enter your full name (at least 2 characters).";
                    speakText = botMessage;
                    valid = false;
                } else {
                    setLeadData(p => ({ ...p, name: userInput }));
                    botMessage = `Great, ${userInput}! Next, what's your best email address?`;
                    speakText = `Great, ${userInput}! Next, what's your best email address?`;
                    nextStep = CONVERSATION_STEPS.GET_EMAIL;
                }
                break;
            case CONVERSATION_STEPS.GET_EMAIL:
                if (!emailRegex.test(userInput)) {
                    botMessage = "That doesn't look like a valid email. Please try again (e.g., example@domain.com).";
                    speakText = "That doesn't look like a valid email. Please try again.";
                    valid = false;
                } else {
                    setLeadData(p => ({ ...p, email: userInput }));
                    botMessage = "Thank you. Finally, what's your contact number so we can reach you?";
                    speakText = "Thank you. Finally, what's your contact number?";
                    nextStep = CONVERSATION_STEPS.GET_PHONE;
                }
                break;
            case CONVERSATION_STEPS.GET_PHONE:
                if (!phoneRegex.test(userInput.replace(/\D/g, ''))) {
                    botMessage = "Please enter a valid phone number (digits only).";
                    speakText = "Please enter a valid phone number.";
                    valid = false;
                } else {
                    setLeadData(p => ({ ...p, phone: userInput }));
                    botMessage = "Perfect! Your details are saved. What would you like to ask about the courses or Hindi language? Choose an option or type your question.";
                    speakText = "Perfect! Your details are saved. What would you like to ask?";
                    nextStep = CONVERSATION_STEPS.SHOW_SUGGESTIONS;
                }
                break;
        }
        if (valid) {
            await new Promise(resolve => setTimeout(resolve, 300));
            if (nextStep === CONVERSATION_STEPS.SHOW_SUGGESTIONS) {
                setMessages(prev => [...prev, { 
                    type: 'bot', 
                    text: botMessage, 
                    speak: true, 
                    speakText: speakText, 
                    showSuggestions: true 
                }]);
                setStep(CONVERSATION_STEPS.SHOW_SUGGESTIONS);
                setTimeout(() => speakText(speakText), 300);
            } else {
                 botReply(botMessage, nextStep, speakText);
            }
        } else {
            botReply(botMessage, null, speakText);
        }
    };
    const handleButtonOptionClick = async (option) => {
        setMessages(prev => [...prev, { type: 'user', text: option === 'yes' ? 'Yes, I have a query' : 'No, please close' }]);
        setIsLoading(true);
        if (option === 'no') {
            const finalMsg = `Understood! I'm closing the chat now. If you need us, use the WhatsApp button below. Have a great day!`;
            botReply(finalMsg, CONVERSATION_STEPS.CLOSING, "Understood! I'm closing the chat now. Have a great day!");
            setTimeout(() => setChatOpen(false), 3000);
        } else {
            botReply("Great! What would you like to ask about? Choose an option or type your question.", CONVERSATION_STEPS.SHOW_SUGGESTIONS, "Great! What would you like to ask about?", { showSuggestions: true });
        }
        setIsLoading(false);
    };
    const handleSuggestionClick = async (query) => {
        setMessages(prev => [...prev, { type: 'user', text: query }]);
        setInput('');
        setIsLoading(true);
        const botResponse = await handleGeneralQuery(query);
        setMessages(prev => {
            const cleaned = prev.filter(msg => !(msg.type === 'bot' && (msg as any).showSuggestions));
            return [...cleaned, { type: 'bot', text: botResponse.text, speak: true, speakText: botResponse.speak }];
        });
        setStep(CONVERSATION_STEPS.START); 
        setIsLoading(false);
        const reQueryMsg = "Do you have any *other* questions, or are you ready to close the chat?";
        botReply(reQueryMsg, CONVERSATION_STEPS.QUERY_OR_END, "Do you have any other questions, or are you ready to close the chat?", { showButtons: true });
    };
    const handleGeneralQuery = async (userInput) => {
        const localResponse = getResponse(userInput);
        if (localResponse) {
            return localResponse;
        } else {
            try {
                const apiData = await fetchSimulatedAIResponse(userInput);
                return apiData;
            } catch (error) {
                console.error("Chatbot API Error:", error);
                return {
                    text: `Sorry, the AI service is currently unavailable. Please contact us via WhatsApp or try asking about 'greetings'.`,
                    speak: "Sorry, the AI service is currently unavailable. Please contact us via WhatsApp or try asking about greetings."
                };
            }
        }
    };
    const handleSend = async () => {
        const userInput = input.trim();
        if (!userInput || isLoading) return;
        setMessages(prev => [...prev, { type: 'user', text: userInput }]);
        setInput('');
        setIsLoading(true);
        if (isTerminationKeyword(userInput) && (step < CONVERSATION_STEPS.GET_NAME || step > CONVERSATION_STEPS.GET_PHONE)) {
            if (!leadData.name) {
                 startLeadCapture(); 
            } else {
                const finalMsg = `Understood! I'm closing the chat now. If you need us, use the WhatsApp button below. Have a great day!`;
                botReply(finalMsg, CONVERSATION_STEPS.CLOSING, "Understood! I'm closing the chat now. Have a great day!");
                setTimeout(() => setChatOpen(false), 3000);
            }
            setIsLoading(false);
            return;
        }
        let flowInterrupted = false; 

        if (step === CONVERSATION_STEPS.GUIDED_LEARNING) {
            const lessonResult = handleGuidedLearning(userInput);
            
            if (lessonResult.status === 'lesson_proceed') {
                setIsLoading(false);
                return;
            }
            if (lessonResult.status === 'general_query') {
                flowInterrupted = true;
            }
        } 
        else if (step >= CONVERSATION_STEPS.GET_NAME && step <= CONVERSATION_STEPS.GET_PHONE) {
            await handleLeadCapture(userInput);
            setIsLoading(false);
            return;
        }
        else if (step === CONVERSATION_STEPS.SHOW_SUGGESTIONS) {
             setMessages(prev => prev.filter(msg => !(msg.type === 'bot' && (msg as any).showSuggestions)));
        }
        else if (step === CONVERSATION_STEPS.QUERY_OR_END) {
             botReply("Please choose one of the buttons below to proceed.", CONVERSATION_STEPS.QUERY_OR_END, "Please choose one of the buttons below to proceed.", { showButtons: true });
             setIsLoading(false);
             return;
        }
        const typingMessage = { type: 'bot', text: 'Typing...', speak: false, id: Date.now() };
        setMessages(prev => [...prev, typingMessage]);
        const botResponse = await handleGeneralQuery(userInput);
        setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));
        botReply(botResponse.text, null, botResponse.speak);
        if (flowInterrupted) {
            const currentLesson = suggestions[lessonIndex];
            const resumeMsg = `Hope that helped! To continue your lesson, please type **${currentLesson.nextTrigger}**.`;
            botReply(resumeMsg, CONVERSATION_STEPS.GUIDED_LEARNING, `Hope that helped! To continue your lesson, please type ${currentLesson.nextTrigger}.`);
        } else {
            const reQueryMsg = "Do you have any *other* questions, or are you ready to close the chat?";
            botReply(reQueryMsg, CONVERSATION_STEPS.QUERY_OR_END, "Do you have any other questions, or are you ready to close the chat?", { showButtons: true });
        }
        setIsLoading(false);
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };
    const TypingIndicator = () => (
        <div className="flex items-center gap-1.5 px-2">
            <div className="w-2 w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
    );
    const getInputProps = () => {
        let type = 'text';
        let placeholder = "Type your answer here...";
        let icon = null;
        let disabled = isLoading || step === CONVERSATION_STEPS.CLOSING || step === CONVERSATION_STEPS.QUERY_OR_END || step === CONVERSATION_STEPS.SHOW_SUGGESTIONS;
        if (step === CONVERSATION_STEPS.GUIDED_LEARNING) {
            const currentLesson = suggestions[lessonIndex] || suggestions[0]; 
            placeholder = `Ask a question or type '${currentLesson.nextTrigger}'...`;
            disabled = isLoading || step === CONVERSATION_STEPS.CLOSING; 
        } else if (step === CONVERSATION_STEPS.SHOW_SUGGESTIONS) {
             placeholder = "Type or choose an option above...";
        } else if (step === CONVERSATION_STEPS.QUERY_OR_END) {
             placeholder = "Please click a button above...";
        } else if (step >= CONVERSATION_STEPS.GET_NAME && step <= CONVERSATION_STEPS.GET_PHONE) {
             placeholder = `Enter your ${step === CONVERSATION_STEPS.GET_NAME ? 'full name' : step === CONVERSATION_STEPS.GET_EMAIL ? 'email address' : 'phone number'}...`;
             disabled = isLoading || step === CONVERSATION_STEPS.CLOSING; 
        } else if (step === CONVERSATION_STEPS.CLOSING) {
             placeholder = "Chat closing...";
        } else { 
             placeholder = "Ask your question or type 'stop' to close...";
             disabled = isLoading || step === CONVERSATION_STEPS.CLOSING; 
        }
        switch (step) {
            case CONVERSATION_STEPS.GET_NAME: icon = <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />; break;
            case CONVERSATION_STEPS.GET_EMAIL: icon = <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />; type = 'email'; break;
            case CONVERSATION_STEPS.GET_PHONE: icon = <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />; type = 'tel'; break;
        }
        return { type, placeholder, icon, disabled };
    };
    const inputProps = getInputProps();
    return (
        <>
            {chatOpen && (
                <div
                    className="fixed z-50 flex flex-col bg-gray-100 dark:bg-slate-900 shadow-2xl transition-all duration-300 bottom-[70px] right-4 rounded-lg w-[calc(100vw-32px)] max-w-sm h-auto max-h-[400px] 
                                sm:w-80 md:w-96 md:max-h-[80vh] md:h-[600px] md:top-20 md:bottom-auto md:right-8"
                >
                    <div className="p-4 flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md rounded-t-lg">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Hindi AI Tutor</h3>
                                <p className="text-white/80 text-xs">हिंदी / தமிழ் / English</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isSpeaking && (
                                <button
                                    onClick={stopSpeaking}
                                    className="bg-red-500/80 hover:bg-red-600 p-2 rounded-full transition-colors"
                                    title="Stop Speaking"
                                >
                                    <Square className="w-4 h-4 text-white" />
                                </button>
                            )}
                            <button
                                onClick={() => { setChatOpen(false); stopSpeaking(); }}
                                className="text-white/80 hover:text-white transition-colors"
                                title="Close Chat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-xl text-sm shadow-md ${
                                        msg.type === 'user'
                                            ? 'rounded-tr-none bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                            : 'rounded-tl-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white'
                                    }`}
                                >
                                    {msg.text === 'Typing...' ? (
                                        <TypingIndicator />
                                    ) : (
                                        <div
                                            className="whitespace-pre-line"
                                            dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                                        />
                                    )}
                                    {msg.speak && msg.type === 'bot' && msg.text !== 'Typing...' && (
                                        <button
                                            onClick={() => speakText(msg.speakText || msg.text)}
                                            className="mt-2 flex items-center gap-2 bg-gray-100 dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500 px-3 py-1 rounded-full text-xs transition-colors"
                                        >
                                            <Volume2 className="w-3 h-3" />
                                            Listen / கேளுங்கள்
                                        </button>
                                    )}
                                    {(msg as any).showButtons && step === CONVERSATION_STEPS.QUERY_OR_END && (
                                        <QueryButtons onOptionClick={handleButtonOptionClick} />
                                    )}
                                    {(msg as any).showSuggestions && step === CONVERSATION_STEPS.SHOW_SUGGESTIONS && (
                                        <SuggestionButtons onOptionClick={handleSuggestionClick} />
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                        {step > CONVERSATION_STEPS.GET_PHONE && leadData.name && (
                            <div className="text-center p-3 mt-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-xs text-gray-700 dark:text-gray-300">
                                🔒 **Lead Saved:** {leadData.name} ({leadData.phone})
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-b-lg">
                        <div className="flex gap-2 relative items-center">
                            {inputProps.icon && 
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none ${inputProps.disabled ? 'opacity-50' : ''}`}>
                                    {inputProps.icon}
                                </div>
                            } 
                            <input
                                type={inputProps.type}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={inputProps.placeholder}
                                className={`flex-1 bg-white dark:bg-slate-700 dark:text-white text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputProps.icon ? 'pl-11 pr-4' : 'px-4'}`}
                                disabled={inputProps.disabled}
                            />
                            <button
                                onClick={handleSend}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!input.trim() || inputProps.disabled} >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-4">
                {!chatOpen && (
                    <button
                        onClick={() => { setChatOpen(true); stopSpeaking(); }}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-105"
                        title="Open AI Tutor"
                    >
                        <Bot className="w-6 h-6" />
                    </button>
                )}
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-105"
                    title="WhatsApp Us"
                >
                    <MessageCircle className="w-6 h-6" />
                </a>
            </div>
        </>
    );
};
export default WhatsAppFloat;


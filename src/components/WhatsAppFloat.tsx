import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Volume2, Square, Phone, Mail, User } from 'lucide-react';

// Define Conversation Steps
const CONVERSATION_STEPS = {
    START: 0,              // General Query Mode (after lead capture)
    GUIDED_LEARNING: 1,    // Step to guide user through basic lessons
    GET_NAME: 10,          // Start Lead Capture
    GET_EMAIL: 11,
    GET_PHONE: 12,
    QUERY_OR_END: 13,      // Control Flow (Yes/No)
    CLOSING: 14,
};

// --- Custom Components for Clickable Buttons ---
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
// ----------------------------------------------------

// --- Guided Learning Data ---
const suggestions = [
    {
        topic: 'Numbers (1 to 5)',
        text: "**Lesson 1: Numbers (1-5)**\n\n1: **Ek** (एक)\n2: **Do** (दो)\n3: **Teen** (तीन)\n4: **Chaar** (चार)\n5: **Paanch** (पाँच)\n\nType **NEXT** to learn the Days of the Week.",
        speak: 'Here is your first lesson on numbers one to five.',
        nextTrigger: 'NEXT',
    },
    {
        topic: 'Days of the Week',
        text: "**Lesson 2: Days of the Week**\n\nMonday: **Somvaar** (सोमवार)\nTuesday: **Mangalvaar** (मंगलवार)\nWednesday: **Budhvaar** (बुधवार)\n\nType **NEXT** to learn the Months.",
        speak: 'Lesson two is the days of the week.',
        nextTrigger: 'NEXT',
    },
    {
        topic: 'Months',
        text: "**Lesson 3: Common Months**\n\nJanuary: **Janvari** (जनवरी)\nFebruary: **Farvari** (फ़रवरी)\nMarch: **March** (मार्च)\n\nThat completes your guided lessons for now! Please type **DONE**.",
        speak: 'Lesson three covers some common months.',
        nextTrigger: 'DONE', // Special trigger to start lead capture
    },
];

const WhatsAppFloat = () => {
    // --- State and Refs ---
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: 'नमस्ते! (Namaste / வணக்கம்) I\'m your Hindi learning assistant. Would you like a quick guided lesson on basic words before proceeding? Type **YES** or **NO**.',
            speak: true,
            speakText: 'नमस्ते! मैं आपकी हिंदी सीखने में मदद कर सकता हूं',
        },
    ]);
    const [input, setInput] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [step, setStep] = useState(CONVERSATION_STEPS.GUIDED_LEARNING); // Start at GUIDED_LEARNING state
    const [leadData, setLeadData] = useState({ name: '', email: '', phone: '' });
    const [lessonIndex, setLessonIndex] = useState(0); // Tracks current position in suggestions array

    // --- Data and Consts ---
    const whatsappNumber = "6397255377";
    const whatsappMessage = "Hello! I'm interested in learning Hindi at Raanuva Veeran Spoken Hindi Academy. Could you please provide more information?";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{7,}$/;


    // --- Core Functions ---
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

    const speakText = (text, lang = 'hi-IN') => {
        // Simple logic to switch language for better pronunciation
        const speechLang = ['नमस्ते', 'कृपया', 'ज़रूरत', 'क्षमा करें', 'Great! Go ahead and ask your question.'].includes(text) ? 'hi-IN' : 'en-US';
        
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = speechLang;
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
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

    // Simulated AI response for language queries (unchanged)
    const fetchSimulatedAIResponse = (prompt) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const lowerPrompt = prompt.toLowerCase();
                let responseText;
                let speakText = "Here is the information you requested.";

                if (lowerPrompt.includes('food') || lowerPrompt.includes('eat')) {
                    responseText = `The Hindi word for food/meal is **Khaana** (खाना).\n\n**English Translation:** Food/Meal\n**Tamil Translation:** Unavu (உணவு)\n\n**Example Usage:** "Is the food good?" translates to "Kya khaana achha hai?"`;
                } else if (lowerPrompt.includes('travel') || lowerPrompt.includes('go')) {
                    responseText = `The basic verb 'to go' is **Jaana** (जाना).\n\n**English Translation:** To Go\n**Tamil Translation:** Selvathu (செல்வது)\n\n**Example Usage:** To say "I am going," you would say "Main jaa raha hoon."`;
                } else if (lowerPrompt.includes('please') || lowerPrompt.includes('kindly')) {
                    responseText = `The best word for please is **Kripya** (कृपया).\n\n**English Translation:** Please\n**Tamil Translation:** Thayavuseydhu (தயவுசெய்து)`;
                } else {
                    responseText = `I see you are asking about **${prompt.split(' ')[0]}**! The Hindi word for 'Need' or 'Requirement' is a valuable word to learn: **Zaroorat** (ज़रूरत).\n\nWhat other words do you need translated?`;
                }

                resolve({ text: responseText, speak: speakText });
            }, 1500);
        });
    };

    // Static lessons data (unchanged)
    const lessons = {
        'greetings|hello|வணக்கம்': {
            text: `**Hindi Greetings / வாழ்த்துகள்:**\n\nThe formal and respectful greeting is **Namaste** (नमस्ते).\n\n**English Translation:** Hello/Greetings\n**Tamil Translation:** Vanakkam (வணக்கம்)`,
            speak: 'नमस्ते'
        },
        'numbers|எண்கள்|संख्या': {
            text: `**Hindi Numbers / எண்கள்:**\n\n**One:** Ek (एक)\n**Two:** Do (दो)\n\nThese are essential for counting!`,
            speak: 'Here are the first few numbers.'
        },
        'course|courses|क्लास|classes': {
            text: `📚 **Our Hindi Courses:**\nWe offer structured courses at Raanuva Veeran Academy. Contact us via WhatsApp for enrollment!`,
            speak: 'हम कोर्स प्रदान करते हैं'
        },
        'fee|fees|price|cost': {
            text: `💰 **Course Fees:**\nMonthly: ₹5,000 per month. Please contact us on WhatsApp for flexible installment options.`,
            speak: 'हमारे कोर्स की फीस पांच हजार रुपये प्रति माह है'
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


    const botReply = (text, stepChange = null, speakText = null, options = {}) => {
        const newMsg = { type: 'bot', text, speak: true, speakText: speakText || text, ...options };
        setMessages(prev => [...prev, newMsg]);
        if (stepChange !== null) {
            setStep(stepChange);
        }
        setTimeout(() => speakText(newMsg.speakText), 300);
    };

    // --- Guided Learning Logic ---
    const startLeadCapture = () => {
        const initialLeadMessage = "That completes your lessons for now! We'd love to send you a complete vocabulary guide. Could you please provide your **full name** to continue?";
        botReply(initialLeadMessage, CONVERSATION_STEPS.GET_NAME, initialLeadMessage);
    };

    const handleGuidedLearning = (userInput) => {
        const lowerInput = userInput.toLowerCase();
        const currentLesson = suggestions[lessonIndex];
        
        // Logic for the INITIAL START/SKIP prompt
        if (lessonIndex === 0 && (lowerInput.includes('yes') || lowerInput.includes('no'))) {
            if (lowerInput.includes('yes')) {
                // User agrees to start lessons
                // Check if we are past the initial prompt (messages.length > 1) to avoid duplicating lesson 1 if user types YES
                if (messages.length > 1 && messages[1]?.text?.includes(currentLesson.text.split('\n')[0])) {
                    botReply("You are already on Lesson 1. Type **NEXT** to continue.");
                    return;
                }
                botReply(currentLesson.text, CONVERSATION_STEPS.GUIDED_LEARNING, currentLesson.speak);
            } else {
                // User rejects lessons, go directly to lead capture
                startLeadCapture(); 
            }
            return;
        }

        // Logic for progressing through lessons (must type the specific nextTrigger)
        if (lowerInput === currentLesson.nextTrigger.toLowerCase()) {
            if (currentLesson.nextTrigger === 'DONE') {
                // Last lesson completed, transition to lead capture
                startLeadCapture();
            } else if (lessonIndex < suggestions.length - 1) {
                // Move to the next lesson
                const nextLessonIndex = lessonIndex + 1;
                const nextLesson = suggestions[nextLessonIndex];
                setLessonIndex(nextLessonIndex); // FIX: Increment lessonIndex
                botReply(nextLesson.text, CONVERSATION_STEPS.GUIDED_LEARNING, nextLesson.speak);
            }
        } else {
             // User typed something irrelevant during a lesson step
             botReply(`To proceed, please type **${currentLesson.nextTrigger}** to see the next lesson.`);
        }
    };
    // --- END Guided Learning Logic ---


    const handleLeadCapture = async (userInput) => {
        let nextStep = step;
        let botMessage = '';
        let valid = true;

        switch (step) {
            case CONVERSATION_STEPS.GET_NAME:
                if (userInput.length < 2) {
                    botMessage = "Please enter your full name (at least 2 characters).";
                    valid = false;
                } else {
                    setLeadData(p => ({ ...p, name: userInput }));
                    botMessage = `Great, ${userInput}! Next, what's your best email address?`;
                    nextStep = CONVERSATION_STEPS.GET_EMAIL;
                }
                break;

            case CONVERSATION_STEPS.GET_EMAIL:
                if (!emailRegex.test(userInput)) {
                    botMessage = "That doesn't look like a valid email. Please try again (e.g., example@domain.com).";
                    valid = false;
                } else {
                    setLeadData(p => ({ ...p, email: userInput }));
                    botMessage = "Thank you. Finally, what's your contact number so we can reach you?";
                    nextStep = CONVERSATION_STEPS.GET_PHONE;
                }
                break;

            case CONVERSATION_STEPS.GET_PHONE:
                if (!phoneRegex.test(userInput.replace(/\D/g, ''))) {
                    botMessage = "Please enter a valid phone number (digits only).";
                    valid = false;
                } else {
                    setLeadData(p => ({ ...p, phone: userInput }));
                    botMessage = "Perfect! Your details are saved. Do you have any immediate questions about the courses or Hindi language?";
                    nextStep = CONVERSATION_STEPS.QUERY_OR_END;
                }
                break;
        }

        if (valid) {
            await new Promise(resolve => setTimeout(resolve, 300));
            // For QUERY_OR_END, we send a special message that renders the buttons
            if (nextStep === CONVERSATION_STEPS.QUERY_OR_END) {
                setMessages(prev => [...prev, { 
                    type: 'bot', 
                    text: botMessage, 
                    speak: true, 
                    speakText: botMessage, 
                    showButtons: true 
                }]);
                setStep(CONVERSATION_STEPS.QUERY_OR_END);
                setTimeout(() => speakText(botMessage), 300);
            } else {
                 botReply(botMessage, nextStep, botMessage);
            }
        } else {
            botReply(botMessage, null, botMessage);
        }
    };
    
    // Function to handle the button click action (Unchanged)
    const handleButtonOptionClick = async (option) => {
        setMessages(prev => [...prev, { type: 'user', text: option === 'yes' ? 'Yes, I have a query' : 'No, please close' }]);
        setIsLoading(true);

        if (option === 'no') {
            const finalMsg = `Understood! I'm closing the chat now. If you need us, use the WhatsApp button below. Have a great day!`;
            botReply(finalMsg, CONVERSATION_STEPS.CLOSING, "Understood! I'm closing the chat now. If you need us, use the WhatsApp button below. Have a great day!");
            setTimeout(() => setChatOpen(false), 3000);
        } else {
            // "Yes" logic: Transition to general chat flow
            botReply("Great! Go ahead and ask your question.", CONVERSATION_STEPS.START, "Great! Go ahead and ask your question.");
        }
        setIsLoading(false);
    };


    // Logic for General Chat (Termination Keywords added)
    const handleGeneralQuery = async (userInput) => {
        // Check for local lesson match first
        const localResponse = getResponse(userInput);
        if (localResponse) {
            return localResponse;
        } else {
            // No local match, call the SIMULATED API
            try {
                const apiData = await fetchSimulatedAIResponse(userInput);
                return apiData;
            } catch (error) {
                console.error("Chatbot API Error:", error);
                return {
                    text: `Sorry, the AI service is currently unavailable. Please contact us via WhatsApp or try asking about 'greetings'.`,
                    speak: "क्षमा करें"
                };
            }
        }
    };
    
    // Unified send handler
    const handleSend = async () => {
        const userInput = input.trim();
        if (!userInput || isLoading) return;

        // 1. Handle Termination (If user is not in a structured data capture step)
        if (isTerminationKeyword(userInput) && step !== CONVERSATION_STEPS.GET_NAME && step !== CONVERSATION_STEPS.GET_EMAIL && step !== CONVERSATION_STEPS.GET_PHONE) {
            setMessages(prev => [...prev, { type: 'user', text: userInput }]);
            setInput('');
            setIsLoading(true);
            
            // If lead data is not collected yet, go to lead capture first
            if (!leadData.name) {
                 startLeadCapture();
            } else {
                // If lead data collected, proceed to close
                const finalMsg = `Understood! I'm closing the chat now. If you need us, use the WhatsApp button below. Have a great day!`;
                botReply(finalMsg, CONVERSATION_STEPS.CLOSING, "Understood! I'm closing the chat now. If you need us, use the WhatsApp button below. Have a great day!");
                setTimeout(() => setChatOpen(false), 3000);
            }
            setIsLoading(false);
            return;
        }
        
        // 2. Add user message
        setMessages(prev => [...prev, { type: 'user', text: userInput }]);
        setInput('');
        setIsLoading(true);
        
        // 3. Handle Guided Learning Track
        if (step === CONVERSATION_STEPS.GUIDED_LEARNING) {
            handleGuidedLearning(userInput);
            setIsLoading(false);
            return;
        }
        
        // 4. Handle Lead Capture State Machine
        if (step >= CONVERSATION_STEPS.GET_NAME && step <= CONVERSATION_STEPS.GET_PHONE) {
            await handleLeadCapture(userInput);
            setIsLoading(false);
            return;
        }
        
        // 5. Query or End State Machine (If button click is required)
        if (step === CONVERSATION_STEPS.QUERY_OR_END) {
             botReply("Please choose one of the buttons below to proceed.", CONVERSATION_STEPS.QUERY_OR_END, "Please choose one of the buttons below to proceed.");
             setIsLoading(false);
             return;
        }

        // 6. General Query Flow (START state)
        const typingMessage = { type: 'bot', text: 'Typing...', speak: false, id: Date.now() };
        setMessages(prev => [...prev, typingMessage]);

        const botResponse = await handleGeneralQuery(userInput);

        // Remove typing indicator and add final response
        setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));
        setMessages(prev => [...prev, { type: 'bot', text: botResponse.text, speak: true, speakText: botResponse.speak }]);

        // 7. Periodically ask for confirmation to end
        if (Math.random() < 0.40) { 
             const reQueryMsg = "Do you have any *other* questions before I close the chat?";
             setMessages(prev => [...prev, { 
                type: 'bot', 
                text: reQueryMsg, 
                speak: true, 
                speakText: reQueryMsg, 
                showButtons: true 
            }]);
             setStep(CONVERSATION_STEPS.QUERY_OR_END);
        } else {
             setStep(CONVERSATION_STEPS.START); // Stay in START state
        }
        
        setIsLoading(false);

        // Auto-speak the response
        if (botResponse.speak) {
            setTimeout(() => speakText(botResponse.speak), 300);
        }
    };


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const TypingIndicator = () => (
        <div className="flex items-center gap-1.5 px-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
    );

    const getInputProps = () => {
        let type = 'text';
        let placeholder = "Type your answer here...";
        let icon = null;
        let disabled = isLoading || step === CONVERSATION_STEPS.CLOSING;
        
        if (step === CONVERSATION_STEPS.GUIDED_LEARNING) {
            const currentLesson = suggestions[lessonIndex] || suggestions[0]; // Fallback to first lesson
            placeholder = `Type '${currentLesson.nextTrigger}' to proceed...`;
        } else if (step >= CONVERSATION_STEPS.GET_NAME && step <= CONVERSATION_STEPS.GET_PHONE) {
             placeholder = `Enter your ${step === CONVERSATION_STEPS.GET_NAME ? 'full name' : step === CONVERSATION_STEPS.GET_EMAIL ? 'email address' : 'phone number'}...`;
        } else if (step === CONVERSATION_STEPS.QUERY_OR_END) {
             placeholder = "Please click a button above...";
             disabled = true; // Disable input when waiting for button click
        } else if (step === CONVERSATION_STEPS.CLOSING) {
             placeholder = "Chat closing...";
        } else { // START
             placeholder = "Ask your question or type 'stop' to close...";
        }

        switch (step) {
            case CONVERSATION_STEPS.GET_NAME: icon = <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />; break;
            case CONVERSATION_STEPS.GET_EMAIL: icon = <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />; type = 'email'; break;
            case CONVERSATION_STEPS.GET_PHONE: icon = <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />; type = 'tel'; break;
        }
        
        return { type, placeholder, icon, disabled };
    };
    
    const inputProps = getInputProps();

    // --- Component Render ---
    return (
        <>
            {/* Chatbot Window */}
            {chatOpen && (
                <div
                    // MODIFIED: Reduced max-height for mobile to max-h-[400px]
                    // Changed rounded-xl to rounded-lg for a smaller feel
                    className="fixed z-50 flex flex-col bg-gray-100 dark:bg-slate-900 shadow-2xl transition-all duration-300 bottom-[70px] right-4 rounded-lg w-[calc(100vw-32px)] max-w-sm h-auto max-h-[400px] sm:w-80 md:w-96 md:max-h-[550px]"
                >
                    {/* Header */}
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

                    {/* Messages Area */}
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

                                    {/* Speak Button */}
                                    {msg.speak && msg.type === 'bot' && msg.text !== 'Typing...' && (
                                        <button
                                            onClick={() => speakText(msg.speakText || msg.text)}
                                            className="mt-2 flex items-center gap-2 bg-gray-100 dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500 px-3 py-1 rounded-full text-xs transition-colors"
                                        >
                                            <Volume2 className="w-3 h-3" />
                                            Listen / கேளுங்கள்
                                        </button>
                                    )}
                                    
                                    {/* Clickable Yes/No Buttons */}
                                    {(msg as any).showButtons && step === CONVERSATION_STEPS.QUERY_OR_END && (
                                        <QueryButtons onOptionClick={handleButtonOptionClick} />
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                        
                        {/* Final Lead Data Summary (Only shows when data is fully captured) */}
                        {step > CONVERSATION_STEPS.GET_PHONE && leadData.name && (
                            <div className="text-center p-3 mt-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-xs text-gray-700 dark:text-gray-300">
                                🔒 **Lead Saved:** {leadData.name} ({leadData.phone})
                            </div>
                        )}
                        
                    </div>

                    {/* Input Area */}
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
                                // Adjusted padding for icon positioning
                                className={`flex-1 bg-white dark:bg-slate-700 dark:text-white text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputProps.icon ? 'pl-11 pr-4' : 'px-4'}`}
                                disabled={inputProps.disabled}
                            />
                            <button
                                onClick={handleSend}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!input.trim() || inputProps.disabled}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Buttons Container: Positions buttons relative to the viewport */}
            <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-4">
                
                {/* Chatbot Toggle Button (Only visible when chat is CLOSED) */}
                {!chatOpen && (
                    <button
                        onClick={() => { setChatOpen(true); stopSpeaking(); }}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-105"
                        title="Open AI Tutor"
                    >
                        <Bot className="w-6 h-6" />
                    </button>
                )}

                {/* WhatsApp Button (Always visible) */}
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
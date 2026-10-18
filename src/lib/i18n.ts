export type Lang = "en" | "hi" | "mr";
export const LANG_LABEL: Record<Lang, string> = { en: "English", hi: "हिन्दी", mr: "मराठी" };
export const SPEECH_LOCALE: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

const dict = {
  en: {
    explore: "Explore", route: "My route", next: "My next step", facilitator: "Facilitator",
    demo: "Demo uses fictional learners only", who: "Who is learning today?",
    profileQ: "Is this information about me correct?", trialsQ: "What does this work involve?",
    routesQ: "Which options fit me and why?", planQ: "What can I do this week?",
    appQ: "What is missing and what is confirmed?", queueQ: "Who needs help, for what, and by when?",
    save: "Save and confirm", edit: "Edit", speak: "Speak", listen: "Listen", typeHere: "Or type here",
    unknown: "Unknown", choose: "Choose this route", chosen: "Chosen", reset: "Reset demo",
    meets: "Meets the listed requirements", does_not_meet: "Missing a requirement", unknownElig: "Need more information",
    check: "Check my answer", submit: "Submit for review", switch: "Switch learner",
  },
  hi: {
    explore: "खोजें", route: "मेरा रास्ता", next: "मेरा अगला कदम", facilitator: "सहायक",
    demo: "डेमो में केवल काल्पनिक शिक्षार्थी हैं", who: "आज कौन सीख रहा है?",
    profileQ: "क्या मेरी यह जानकारी सही है?", trialsQ: "इस काम में क्या करना होता है?",
    routesQ: "कौन से विकल्प मेरे लिए ठीक हैं और क्यों?", planQ: "इस हफ्ते मैं क्या कर सकता/सकती हूँ?",
    appQ: "क्या बाकी है और क्या पक्का हुआ?", queueQ: "किसे मदद चाहिए, किस बात की, और कब तक?",
    save: "सहेजें और पुष्टि करें", edit: "बदलें", speak: "बोलें", listen: "सुनें", typeHere: "या यहाँ लिखें",
    unknown: "अज्ञात", choose: "यह रास्ता चुनें", chosen: "चुना गया", reset: "डेमो रीसेट करें",
    meets: "दी गई शर्तें पूरी होती हैं", does_not_meet: "एक शर्त बाकी है", unknownElig: "और जानकारी चाहिए",
    check: "मेरा उत्तर जाँचें", submit: "समीक्षा के लिए भेजें", switch: "शिक्षार्थी बदलें",
  },
  mr: {
    explore: "शोधा", route: "माझा मार्ग", next: "माझे पुढचे पाऊल", facilitator: "सहाय्यक",
    demo: "डेमोमध्ये फक्त काल्पनिक विद्यार्थी आहेत", who: "आज कोण शिकत आहे?",
    profileQ: "माझी ही माहिती बरोबर आहे का?", trialsQ: "या कामात काय करावे लागते?",
    routesQ: "कोणते पर्याय मला योग्य आहेत आणि का?", planQ: "या आठवड्यात मी काय करू शकतो/शकते?",
    appQ: "काय बाकी आहे आणि काय निश्चित झाले?", queueQ: "कोणाला मदत हवी, कशासाठी, आणि कधीपर्यंत?",
    save: "जतन करा आणि पुष्टी करा", edit: "बदला", speak: "बोला", listen: "ऐका", typeHere: "किंवा येथे लिहा",
    unknown: "अज्ञात", choose: "हा मार्ग निवडा", chosen: "निवडला", reset: "डेमो रीसेट करा",
    meets: "दिलेल्या अटी पूर्ण होतात", does_not_meet: "एक अट बाकी आहे", unknownElig: "अधिक माहिती हवी",
    check: "माझे उत्तर तपासा", submit: "पुनरावलोकनासाठी पाठवा", switch: "विद्यार्थी बदला",
  },
} as const;

export type TKey = keyof (typeof dict)["en"];
export const t = (lang: Lang, k: TKey) => dict[lang][k];

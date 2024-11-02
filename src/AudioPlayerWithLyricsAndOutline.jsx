import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
} from "lucide-react";
// import soundVikesh from "https://assets.yadavvi.com/vikesh-june15-2024.aac";
// import soundPavan from "https://assets.yadavvi.com/pavan-dec23-2023.aac";

// import hanumanji from "./assets/Hanuman_slaying_demons_on_each_side.jpg";

const AudioPlayerWithLyricsAndOutline = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentOutlineIndex, setCurrentOutlineIndex] = useState(0);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [manualScroll, setManualScroll] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState(null);
  const [currentFootnote, setCurrentFootnote] = useState(null);
  const [footnoteAudio, setFootnoteAudio] = useState(null);

  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  const outlineContainerRef = useRef(null);

  const AUDIO_BASE_URL = import.meta.env.VITE_AUDIO_BASE_URL;
  const AUDIO_SOURCES = {
    vikesh: `${AUDIO_BASE_URL}/vikesh-june15-2024.aac`,
    pavan: `${AUDIO_BASE_URL}/pavan-dec23-2023.aac`
  };

  // import hanumanji from "./assets/Hanuman_slaying_demons_on_each_side.jpg";
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
  const IMAGE_SOURCES = {
    hanumanji: `${IMAGE_BASE_URL}/Hanuman_slaying_demons_on_each_side.jpg`
  };

  const outline = [
    "सुंदरकांड",
    "सुंदरकांड मंगलाचरण",
    "हनुमान का लंका का प्रस्थान, सुरसा से भे...",
    "लंका वर्णन, लंकिनी वध, लंका में प्रवेश",
    "हनुमान-विभीषण संवाद",
    "हनुमानजी का अशोक वाटिका में सीताजी ...",
    "श्री सीता-हनुमान संवाद",
    "श्री सीता-हनुमान संवाद",
    "हनुमान द्वारा अशोक वाटिका विध्वंस, अक्ष...",
    "हनुमान-रावण संवाद",
    "लंकादहन",
    "लंका जलाने के बाद हनुमानजी का सीता...",
    "समुद्र के इस पार आना, सबका लौटना, रा...",
    "श्रीराम जी को वानरों की सेना के साथ च...",
    "मंदोदरी-रावण संवाद",
    "रावण को विभीषण का समझाना और वि...",
    "विभीषण का भगवान् श्री रामजी की शरण ...",
    "समुद्र पार करने के लिए विचार, रामदूत ...",
    "दूत का रावण को समझाना और लक्ष्मण...",
    "समुद्र पर श्री रामजी का क्रोध और समुद्र ...",
  ];

  //   const lyrics = [
  //     { time: 0, text: "नाथ सो नयननि को अपराधा। निसरत प्रान करहु जनि बाधा॥", outlineIndex: 12 },
  //     { time: 5, text: "बिरह अगनि तनु तूल समीरा। स्वास जरइ छन माहि सरीरा॥" },
  //     { time: 10, text: "नयन स्रवहि जलु निज हित लागी। जरै न पाव देह बिरहागी॥" },
  //     { time: 15, text: "सीता के अति बिपति बिसाला। बिनहिं कहे भलि दीनदयाला॥" },
  //   ];

  const footnotes = [
    {
      id: 5,
      text: "हनुमान-विभीषण संवाद",
      audio: {sound: AUDIO_SOURCES.pavan}
    },
    {
      id: 9,
      text: "हनुमान द्वारा अशोक वाटिका विध्वंस, अक्ष...",
      audio: {sound: AUDIO_SOURCES.pavan}
    },
    {
      id: 14,
      text: "श्रीराम जी को वानरों की सेना के साथ च...",
      audio: {sound: AUDIO_SOURCES.pavan}
    },
    {
      id: 19,
      text: "हनुमान द्वारा अशोक वाटिका विध्वंस, अक्ष...",
      audio: {sound: AUDIO_SOURCES.pavan}
    },
    {
      id: 21,
      text: "श्रीराम जी को वानरों की सेना के साथ च...",
      audio: {sound: AUDIO_SOURCES.pavan}
    }
  ];

  const lyrics3 = [
    { type: "doha", time: 0, text: "निमिष निमिष करुनानिधि जाहिं कलप सम बीति ।", outlineIndex: 5, footnoteIds: [ 5 ] },
    { type: "doha", time: 9, text: "बेगि चलिय प्रभु आनिअ भुज बल खल दल जीति ॥31॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { type: "samput", time: 17, text: "मंगल भवन अमंगल हारी । द्ररबहु सुदसरथ अजिर बिहारी ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { type: "chaupai", time: 36, text: "सुनि सीता दुख प्रभु सुख अयना । भरि आए जल राजिव नयना ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { type: "chaupai", time: 50, text: "बचन काँय मन मम गति जाही । सपनेहुँ बूझिअ बिपति कि ताही ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { type: "chaupai", time: 65, text: "कह हनुमंत बिपति प्रभु सोई । जब तव सुमिरन भजन न होई ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { type: "chaupai", time: 81, text: "केतिक बात प्रभु जातुधान की । रिपुहि जीति आनिबी जानकी ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { type: "chaupai", time: 96, text: "सुनु कपि तोहि समान उपकारी । नहिं कोउ सुर नर मुनि तनुधारी ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { type: "chaupai", time: 111, text: "प्रति उपकार करौं का तोरा । सनमुख होइ न सकत मन मोरा ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { type: "chaupai", time: 127, text: "सुनु सुत तोहि उरिन मैं नाहीं । देखेउँ करि बिचार मन माहीं ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { type: "chaupai", time: 141, text: "पुनि पुनि कपिहि चितव सुरत्राता । लोचन नीर पुलक अति गाता ॥", outlineIndex: 5, footnoteIds: [ 9 ] },
    { type: "samput", time: 157, text: "मंगल भवन अमंगल हारी । द्ररबहु सुदसरथ अजिर बिहारी ॥", outlineIndex: 5, footnoteIds: [ 9 ] },
    { type: "doha", time: 173, text: "सुनि प्रभु बचन बिलोकि मुख गात हरषि हनुमंत ।", outlineIndex: 9, footnoteIds: [ 9 ] },
    { type: "doha", time: 188, text: "चरन परेउ प्रेमाकुल त्राहि त्राहि भगवंत ॥32॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { type: "samput", time: 203, text: "मंगल भवन अमंगल हारी । द्ररबहु सुदसरथ अजिर बिहारी ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { type: "chaupai", time: 217, text: "बार बार प्रभु चहइ उठावा । प्रेम मगन तेहि उठब न भावा ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { type: "chaupai", time: 233, text: "प्रभु कर पंकज कपि कें सीसा । सुमिरि सो दसा मगन गौरीसा ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { type: "chaupai", time: 247, text: "सावधान मन करि पुनि संकर । लागे कहन कथा अति सुंदर ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { type: "chaupai", time: 261, text: "कपि उठाइ प्रभु हृदयँ लगावा । कर गहि परम निकट बैठावा ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { type: "chaupai", time: 275, text: "कहु कपि रावन पालित लंका । केहि बिधि दहेउ दुर्ग अति बंका ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { type: "chaupai", time: 290, text: "प्रभु प्रसन्न जाना हनुमाना । बोला बचन बिगत अभिमाना ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { type: "chaupai", time: 304, text: "साखामृग के बड़ि मनुसाई । साखा तें साखा पर जाई ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { type: "chaupai", time: 312, text: "नाघि सिंधु हाटकपुर जारा । निसिचर गन बिधि बिपिन उजारा ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { type: "chaupai", time: 318, text: "सो सब तव प्रताप रघुराई । नाथ न कछू मोरि प्रभुताई ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { type: "samput", time: 326, text: "मंगल भवन अमंगल हारी । द्ररबहु सुदसरथ अजिर बिहारी ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { type: "doha", time: 340, text: "ता कहुँ प्रभु कछु अगम नहिं जा पर तुम्ह अनुकुल ।", outlineIndex: 14, footnoteIds: [ 14 ] },
    { type: "doha", time: 353, text: "तब प्रभावँ बड़वानलहिं जारि सकइ खलु तूल ॥33॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { type: "samput", time: 360, text: "मंगल भवन अमंगल हारी । द्ररबहु सुदसरथ अजिर बिहारी ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { type: "chaupai", time: 367, text: "नाथ भगति अति सुखदायनी । देहु कृपा करि अनपायनी ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { type: "chaupai", time: 375, text: "सुनि प्रभु परम सरल कपि बानी । एवमस्तु तब कहेउ भवानी ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { type: "chaupai", time: 389, text: "उमा राम सुभाउ जेहिं जाना । ताहि भजनु तजि भाव न आना ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { type: "chaupai", time: 402, text: "यह संवाद जासु उर आवा । रघुपति चरन भगति सोइ पावा ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { type: "chaupai", time: 409, text: "सुनि प्रभु बचन कहहिं कपिबृंदा । जय जय जय कृपाल सुखकंदा ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { type: "chaupai", time: 415, text: "तब रघुपति कपिपतिहि बोलावा । कहा चलैं कर करहु बनावा ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { type: "chaupai", time: 423, text: "अब बिलंबु केहि कारन कीजे । तुरत कपिन्ह कहुँ आयसु दीजे ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { type: "chaupai", time: 430, text: "कौतुक देखि सुमन बहु बरषी । नभ तें भवन चले सुर हरषी ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { type: "samput", time: 443, text: "मंगल भवन अमंगल हारी । द्ररबहु सुदसरथ अजिर बिहारी ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
  ];

  const lyrics = [
    { time: 0, type: "chaupai", text: "कादर मन कहुँ एक अधारा । दैव दैव आलसी पुकारा ॥", outlineIndex: 5, footnoteIds: [ 5, 9, 14, 19, 21 ] },
    { time: 11, type: "chaupai", text: "सुनत बिहसि बोले रघुबीरा । ऐसेहिं करब धरहु मन धीरा ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 24, type: "chaupai", text: "अस कहि प्रभु अनुजहि समुझाई । सिंधु समीप गए रघुराई ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 36, type: "chaupai", text: "प्रथम प्रनाम कीन्ह सिरु नाई । बैठे पुनि तट दर्भ डसाई ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 49, type: "chaupai", text: "जबहिं बिभीषन प्रभु पहिं आए । पाछें रावन दूत पठाए ॥", outlineIndex: 5, footnoteIds: [ 5 ] },

    { time: 61, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 5, footnoteIds: [ 5 ] },

    { time: 74, type: "doha", text: "सकल चरित तिन्ह देखे धरें कपट कपि देह ।", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 86, type: "doha", text: "प्रभु गुन हृदयँ सराहहिं सरनागत पर नेह ॥51॥", outlineIndex: 5, footnoteIds: [ 5 ] },

    { time: 97, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 5, footnoteIds: [ 5 ] },

    { time: 104, type: "chaupai", text: "प्रगट बखानहिं राम सुभाऊ । अति सप्रेम गा बिसरि दुराऊ ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 110, type: "chaupai", text: "रिपु के दूत कपिन्ह तब जाने । सकल बाँधि कपीस पहिं आने ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 123, type: "chaupai", text: "कह सुग्रीव सुनहु सब बानर । अंग भंग करि पठवहु निसिचर ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 134, type: "chaupai", text: "सुनि सुग्रीव बचन कपि धाए । बाँधि कटक चहु पास फिराए ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 146, type: "chaupai", text: "बहु प्रकार मारन कपि लागे । दीन पुकारत तदपि न त्यागे ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 158, type: "chaupai", text: "जो हमार हर नासा काना । तेहि कोसलाधीस कै आना ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 165, type: "chaupai", text: "सुनि लछिमन सब निकट बोलाए । दया लागि हँसि तुरत छोडाए ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 171, type: "chaupai", text: "रावन कर दीजहु यह पाती । लछिमन बचन बाचु कुलघाती ॥", outlineIndex: 5, footnoteIds: [ 5 ] },

    { time: 177, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 5, footnoteIds: [ 5 ] },

    { time: 182, type: "doha", text: "कहेहु मुखागर मूढ़ सन मम संदेसु उदार ।", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 189, type: "doha", text: "सीता देइ मिलेहु न त आवा काल तुम्हार ॥52॥", outlineIndex: 5, footnoteIds: [ 5 ] },

    { time: 195, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 5, footnoteIds: [ 5 ] },

    { time: 201, type: "chaupai", text: "तुरत नाइ लछिमन पद माथा । चले दूत बरनत गुन गाथा ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 207, type: "chaupai", text: "कहत राम जसु लंकाँ आए । रावन चरन सीस तिन्ह नाए ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 220, type: "chaupai", text: "बिहसि दसानन पूँछी बाता । कहसि न सुक आपनि कुसलाता ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 231, type: "chaupai", text: "पुनि कहु खबरि बिभीषन केरी । जाहि मृत्यु आई अति नेरी ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 243, type: "chaupai", text: "करत राज लंका सठ त्यागी । होइहि जब कर कीट अभागी ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 255, type: "chaupai", text: "पुनि कहु भालु कीस कटकाई । कठिन काल प्रेरित चलि आई ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 261, type: "chaupai", text: "जिन्ह के जीवन कर रखवारा । भयउ मृदुल चित सिंधु बिचारा ॥", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 267, type: "chaupai", text: "कहु तपसिन्ह कै बात बहोरी । जिन्ह के हृदयँ त्रास अति मोरी ॥", outlineIndex: 5, footnoteIds: [ 5 ] },

    { time: 273, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 5, footnoteIds: [ 5 ] },

    { time: 279, type: "doha", text: "की भइ भेंट कि फिरि गए श्रवन सुजसु सुनि मोर ।", outlineIndex: 5, footnoteIds: [ 5 ] },
    { time: 285, type: "doha", text: "कहसि न रिपु दल तेज बल बहुत चकित चित तोर ॥53॥", outlineIndex: 5, footnoteIds: [ 5 ] },

    { time: 291, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 5, footnoteIds: [ 5 ] },

    { time: 301, type: "chaupai", text: "नाथ कृपा करि पूँछेहु जैसें । मानहु कहा क्रोध तजि तैसें ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { time: 309, type: "chaupai", text: "मिला जाइ जब अनुज तुम्हारा । जातहिं राम तिलक तेहि सारा ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { time: 320, type: "chaupai", text: "रावन दूत हमहि सुनि काना । कपिन्ह बाँधि दीन्हे दुख नाना ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { time: 329, type: "chaupai", text: "श्रवन नासिका काटै लागे । राम सपथ दीन्हे हम त्यागे ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { time: 334, type: "chaupai", text: "पूँछिहु नाथ राम कटकाई । बदन कोटि सत बरनि न जाई ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { time: 338, type: "chaupai", text: "नाना बरन भालु कपि धारी । बिकटानन बिसाल भयकारी ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { time: 343, type: "chaupai", text: "जेहिं पुर दहेउ हतेउ सुत तोरा । सकल कपिन्ह महँ तेहि बलु थोरा ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { time: 348, type: "chaupai", text: "अमित नाम भट कठिन कराला । अमित नाग बल बिपुल बिसाला ॥", outlineIndex: 9, footnoteIds: [ 9 ] },

    { time: 358, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 9, footnoteIds: [ 9 ] },

    { time: 367, type: "doha", text: "द्विबिद मयंद नील नल अंगद गद बिकटासि ।", outlineIndex: 9, footnoteIds: [ 9 ] },
    { time: 377, type: "doha", text: "दधिमुख केहरि निसठ सठ जामवंत बलरासि ॥54॥", outlineIndex: 9, footnoteIds: [ 9 ] },

    { time: 385, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 9, footnoteIds: [ 9 ] },

    { time: 395, type: "chaupai", text: "ए कपि सब सुग्रीव समाना । इन्ह सम कोटिन्ह गनइ को नाना ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { time: 404, type: "chaupai", text: "राम कृपाँ अतुलित बल तिन्हहीं । तृन समान त्रेलोकहि गनहीं ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { time: 422, type: "chaupai", text: "अस मैं सुना श्रवन दसकंधर । पदुम अठारह जूथप बंदर ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { time: 439, type: "chaupai", text: "नाथ कटक महँ सो कपि नाहीं । जो न तुम्हहि जीतै रन माहीं ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { time: 456, type: "chaupai", text: "परम क्रोध मीजहिं सब हाथा । आयसु पै न देहिं रघुनाथा ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { time: 473, type: "chaupai", text: "सोषहिं सिंधु सहित झष ब्याला । पूरहीं न त भरि कुधर बिसाला ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { time: 482, type: "chaupai", text: "मर्दि गर्द मिलवहिं दससीसा । ऐसेइ बचन कहहिं सब कीसा ॥", outlineIndex: 9, footnoteIds: [ 9 ] },
    { time: 490, type: "chaupai", text: "गर्जहिं तर्जहिं सहज असंका । मानहु ग्रसन चहत हहिं लंका ॥", outlineIndex: 9, footnoteIds: [ 9 ] },

    { time: 494, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 9, footnoteIds: [ 9 ] },

    { time: 499, type: "doha", text: "सहज सूर कपि भालु सब पुनि सिर पर प्रभु राम ।", outlineIndex: 14, footnoteIds: [ 14 ] },
    { time: 503, type: "doha", text: "रावन काल कोटि कहु जीति सकहिं संग्राम ॥55॥", outlineIndex: 14, footnoteIds: [ 14 ] },

    { time: 507, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 14, footnoteIds: [ 14 ] },

    { time: 512, type: "chaupai", text: "राम तेज बल बुधि बिपुलाई । सेष सहस सत सकहिं न गाई ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { time: 515, type: "chaupai", text: "सक सर एक सोषि सत सागर । तब भ्रातहि पूँछेउ नय नागर ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { time: 519, type: "chaupai", text: "तासु बचन सुनि सागर पाहीं । मागत पंथ कृपा मन माहीं ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { time: 523, type: "chaupai", text: "सुनत बचन बिहसा दससीसा । जौं असि मति सहाय कृत कीसा ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { time: 532, type: "chaupai", text: "सहज भीरु कर बचन दृढ़ाई । सागर सन ठानी मचलाई ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { time: 540, type: "chaupai", text: "मूढ़ मृषा का करसि बड़ाई । रिपु बल बुद्धि थाह मैं पाई ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { time: 548, type: "chaupai", text: "सचिव सभीत बिभीषन जाकें । बिजय बिभूति कहाँ जग ताकें ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { time: 555, type: "chaupai", text: "सुनि खल बचन दूत रिस बाढ़ी । समय बिचारि पत्रिका काढ़ी ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { time: 562, type: "chaupai", text: "रामानुज दीन्ही यह पाती । नाथ बचाइ जुड़ावहु छाती ॥", outlineIndex: 14, footnoteIds: [ 14 ] },
    { time: 570, type: "chaupai", text: "बिहसि बाम कर लीन्ही रावन । सचिव बोलि सठ लाग बचावन ॥", outlineIndex: 14, footnoteIds: [ 14 ] },

    { time: 578, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 14, footnoteIds: [ 14 ] },

    { time: 585, type: "doha", text: "बातन्ह मनहि रिझाइ सठ जनि घालसि कुल खीस ।", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 592, type: "doha", text: "राम बिरोध न उबरसि सरन बिष्नु अज ईस ॥56(क)॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 598, type: "doha", text: "की तजि मान अनुज इव प्रभु पद पंकज भृंग ।", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 605, type: "doha", text: "होहि कि राम सरानल खल कुल सहित पतंग ॥56(ख)॥", outlineIndex: 19, footnoteIds: [ 19 ] },

    { time: 612, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 19, footnoteIds: [ 19 ] },

    { time: 622, type: "chaupai", text: "सुनत सभय मन मुख मुसुकाई । कहत दसानन सबहि सुनाई ॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 634, type: "chaupai", text: "भूमि परा कर गहत अकासा । लघु तापस कर बाग बिलासा ॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 646, type: "chaupai", text: "कह सुक नाथ सत्य सब बानी । समुझहु छाड़ि प्रकृति अभिमानी ॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 656, type: "chaupai", text: "सुनहु बचन मम परिहरि क्रोधा । नाथ राम सन तजहु बिरोधा ॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 667, type: "chaupai", text: "अति कोमल रघुबीर सुभाऊ । जद्यपि अखिल लोक कर राऊ ॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 677, type: "chaupai", text: "मिलत कृपा तुम्ह पर प्रभु करिही । उर अपराध न एकउ धरिही ॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 688, type: "chaupai", text: "जनकसुता रघुनाथहि दीजे । एतना कहा मोर प्रभु कीजे ।", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 699, type: "chaupai", text: "जब तेहिं कहा देन बैदेही । चरन प्रहार कीन्ह सठ तेही ॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 709, type: "chaupai", text: "नाइ चरन सिरु चला सो तहाँ । कृपासिंधु रघुनायक जहाँ ॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 722, type: "chaupai", text: "करि प्रनामु निज कथा सुनाई । राम कृपाँ आपनि गति पाई ॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 731, type: "chaupai", text: "रिषि अगस्ति कीं साप भवानी । राछस भयउ रहा मुनि ग्यानी ॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 740, type: "chaupai", text: "बंदि राम पद बारहिं बारा । मुनि निज आश्रम कहुँ पगु धारा ॥", outlineIndex: 19, footnoteIds: [ 19 ] },

    { time: 751, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 19, footnoteIds: [ 19 ] },

    { time: 761, type: "doha", text: "बिनय न मानत जलधि जड़ गए तीन दिन बीति ।", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 772, type: "doha", text: "बोले राम सकोप तब भय बिनु होइ न प्रीति ॥57॥", outlineIndex: 19, footnoteIds: [ 19 ] },

    { time: 782, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 19, footnoteIds: [ 19 ] },

    { time: 792, type: "chaupai", text: "लछिमन बान सरासन आनू । सोषौं बारिधि बिसिख कृसानू ॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 803, type: "chaupai", text: "सठ सन बिनय कुटिल सन प्रीती । सहज कृपन सन सुंदर नीती ॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 831, type: "chaupai", text: "ममता रत सन ग्यान कहानी । अति लोभी सन बिरति बखानी ॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 852, type: "chaupai", text: "क्रोधिहि सम कामिहि हरि कथा । ऊसर बीज बएँ फल जथा ॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 872, type: "chaupai", text: "अस कहि रघुपति चाप चढ़ावा । यह मत लछिमन के मन भावा ॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 884, type: "chaupai", text: "संघानेउ प्रभु बिसिख कराला । उठी उदधि उर अंतर ज्वाला ॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 894, type: "chaupai", text: "मकर उरग झष गन अकुलाने । जरत जंतु जलनिधि जब जाने ॥", outlineIndex: 19, footnoteIds: [ 19 ] },
    { time: 899, type: "chaupai", text: "कनक थार भरि मनि गन नाना । बिप्र रूप आयउ तजि माना ॥", outlineIndex: 19, footnoteIds: [ 19 ] },

    { time: 902, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 19, footnoteIds: [ 19 ] },

    { time: 913, type: "doha", text: "काटेहिं पइ कदरी फरइ कोटि जतन कोउ सींच ।", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 923, type: "doha", text: "बिनय न मान खगेस सुनु डाटेहिं पइ नव नीच ॥58॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },

    { time: 933, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },

    { time: 943, type: "chaupai", text: "सभय सिंधु गहि पद प्रभु केरे । छमहु नाथ सब अवगुन मेरे ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 952, type: "chaupai", text: "गगन समीर अनल जल धरनी । इन्ह कइ नाथ सहज जड़ करनी ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 958, type: "chaupai", text: "तव प्रेरित मायाँ उपजाए । सृष्टि हेतु सब ग्रंथनि गाए ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 962, type: "chaupai", text: "प्रभु आयसु जेहि कहँ जस अहई । सो तेहि भाँति रहे सुख लहई ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 968, type: "chaupai", text: "प्रभु भल कीन्ही मोहि सिख दीन्ही । मरजादा पुनि तुम्हरी कीन्ही ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 972, type: "chaupai", text: "ढोल गवाँर सूद्र पसु नारी । सकल ताड़ना के अधिकारी ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 977, type: "chaupai", text: "प्रभु प्रताप मैं जाब सुखाई । उतरिहि कटकु न मोरि बड़ाई ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 982, type: "chaupai", text: "प्रभु अग्या अपेल श्रुति गाई । करौं सो बेगि जौ तुम्हहि सोहाई ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },

    { time: 986, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },

    { time: 992, type: "doha", text: "सुनत बिनीत बचन अति कह कृपाल मुसुकाइ ।", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1001, type: "doha", text: "जेहि बिधि उतरै कपि कटकु तात सो कहहु उपाइ ॥59॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },

    { time: 1010, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },

    { time: 1021, type: "chaupai", text: "नाथ नील नल कपि द्वौ भाई । लरिकाई रिषि आसिष पाई ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1029, type: "chaupai", text: "तिन्ह के परस किएँ गिरि भारे । तरिहहिं जलधि प्रताप तुम्हारे ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1038, type: "chaupai", text: "मैं पुनि उर धरि प्रभुताई । करिहउँ बल अनुमान सहाई ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1048, type: "chaupai", text: "एहि बिधि नाथ पयोधि बँधाइअ । जेहिं यह सुजसु लोक तिहुँ गाइअ ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1058, type: "chaupai", text: "एहि सर मम उत्तर तट बासी । हतहु नाथ खल नर अघ रासी ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1068, type: "chaupai", text: "सुनि कृपाल सागर मन पीरा । तुरतहिं हरी राम रनधीरा ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1077, type: "chaupai", text: "देखि राम बल पौरुष भारी । हरषि पयोनिधि भयउ सुखारी ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1086, type: "chaupai", text: "सकल चरित कहि प्रभुहि सुनावा । चरन बंदि पाथोधि सिधावा ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },

    { time: 1094, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },

    { time: 1105, type: "doha", text: "निज भवन गवनेउ सिंधु श्रीरघुपतिहि यह मत भायऊ ।", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1114, type: "doha", text: "यह चरित कलि मलहर जथामति दास तुलसी गायऊ ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1123, type: "doha", text: "सुख भवन संसय समन दवन बिषाद रघुपति गुन गना ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1133, type: "doha", text: "तजि सकल आस भरोस गावहि सुनहि संतत सठ मना ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },

    { time: 1143, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },

    { time: 1152, type: "sortha", text: "सकल सुमंगल दायक रघुनायक गुन गान ।", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1162, type: "sortha", text: "सादर सुनहिं ते तरहिं भव सिंधु बिना जलजान ॥60॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },

    { time: 1172, type: "samput", text: "दीन दयाल बिरिदु संभारी । हरहु नाथ मम संकट भारी ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },

    { time: 1182, type: "samput", text: "मंगल भवन अमंगल हारी । द्ररबहु सुदसरथ अजिर बिहारी ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1191, type: "samput", text: "देबि पूजि पद कमल तुम्हारे । सुर नर मुनि सब होहिं सुखारे ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1200, type: "samput", text: "नाथ सकल सम्पदा तुम्हारी । में सेवक समेत सुत नारी ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1210, type: "samput", text: "मंगल मूरति मारुति नंदन । सकल अमंगल मूल निकंदन ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1220, type: "samput", text: "पवनतनय संतन हितकारी । हृदय बिराजत अवध बिहारी ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1229, type: "samput", text: "मंगल भवन अमंगल हारी । उमा सहित जेहि जपत पुरारी ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] },
    { time: 1244, type: "samput", text: "बोलो सिया बर रामचंद्र की जय ॥", outlineIndex: 21, footnoteIds: [ 19, 21 ] }
  ];

  const scrollToHighlightedLyric = () => {
    if (manualScroll) return;

    const container = lyricsContainerRef.current;
    const highlightedLyric = container.querySelector('.bg-yellow-200');
    if (highlightedLyric) {
      const containerRect = container.getBoundingClientRect();
      const lyricRect = highlightedLyric.getBoundingClientRect();
      const containerHeight = containerRect.height;
      const lyricTop = lyricRect.top - containerRect.top;

      if (lyricTop < containerHeight * 0.25 || lyricTop > containerHeight * 0.75) {
        container.scrollTo({
          top: container.scrollTop + lyricTop - containerHeight * 0.25,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      const newIndex = lyrics.findIndex(lyric => lyric.time > audio.currentTime) - 1;
      if (newIndex !== currentLyricIndex) {
        setCurrentLyricIndex(newIndex);
        const newOutlineIndex = lyrics[newIndex]?.outlineIndex || 0;
        setCurrentOutlineIndex(newOutlineIndex);
        if (!manualScroll) {
          scrollToHighlightedLyric();
          scrollToCurrentOutline();
        }
      }
    };
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [lyrics, currentLyricIndex, manualScroll]);  

  useEffect(() => {
    if (!manualScroll) {
      scrollToHighlightedLyric();
    }
  }, [currentTime, currentLyricIndex, manualScroll]);

  useEffect(() => {
    const container = lyricsContainerRef.current;
    const handleScroll = () => {
      setManualScroll(true);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      const newTimeout = setTimeout(() => {
        setManualScroll(false);
      }, 15000);
      setScrollTimeout(newTimeout);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [scrollTimeout]);

  const scrollToCurrentOutline = () => {
    if (manualScroll) return;
  
    const container = outlineContainerRef.current;
    const currentOutlineElement = container.children[currentOutlineIndex];
    if (currentOutlineElement) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = currentOutlineElement.getBoundingClientRect();
      const containerHeight = containerRect.height;
      const elementTop = elementRect.top - containerRect.top;
  
      if (elementTop < containerHeight * 0.25 || elementTop > containerHeight * 0.75) {
        container.scrollTo({
          top: container.scrollTop + elementTop - containerHeight * 0.25,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    scrollToCurrentOutline();
  }, [currentOutlineIndex]);

  useEffect(() => {
    const container = outlineContainerRef.current;
    const handleScroll = () => {
      setManualScroll(true);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      const newTimeout = setTimeout(() => {
        setManualScroll(false);
      }, 15000);
      setScrollTimeout(newTimeout);
    };
  
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [scrollTimeout]); 

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    const progressBar = progressRef.current;
    const clickPosition =
      (e.clientX - progressBar.getBoundingClientRect().left) /
      progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  
    // Find the new lyric index based on the new time
    const newLyricIndex = lyrics.findIndex(lyric => lyric.time > newTime) - 1;
    const newOutlineIndex = lyrics[newLyricIndex]?.outlineIndex || 0;
    
    setCurrentLyricIndex(newLyricIndex);
    setCurrentOutlineIndex(newOutlineIndex);
  
    // Force scroll to the new position for both lyrics and outline
    setManualScroll(false);
    setTimeout(() => {
      scrollToHighlightedLyric();
      scrollToCurrentOutline();
    }, 0);
  };  

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const getCurrentLyric = () => {
    return lyrics.reduce((prev, curr) => {
      if (curr.time <= currentTime) return curr;
      return prev;
    }, lyrics[0]);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  
  function splitOnSpaceExceptLast(str) {
    // Find the last space in the string
    const secondLastSpaceIndex = str.lastIndexOf(' ');

    // If there's no space or only one space, return the string as the only element in an array
    if (secondLastSpaceIndex === -1) {
      return [str];
    }

    // Find the second-to-last space in the string
    const lastSpaceIndex = str.lastIndexOf(' ', secondLastSpaceIndex - 1);
  
    // Split the string into two parts: before the last space and after
    const beforeLastSpace = str.slice(0, lastSpaceIndex);
    const afterLastSpace = str.slice(lastSpaceIndex + 1);
  
    // Split the part before the last space on spaces
    const splitBeforeLastSpace = beforeLastSpace.split(' ');
  
    // Combine the two parts
    return [...splitBeforeLastSpace, afterLastSpace];
  }
    
  const handleFootnoteClick = (e, footnoteId) => {
    e.stopPropagation(); // Prevent triggering the lyric click event
    const footnote = footnotes.find(f => f.id === footnoteId);
    if (footnote) {
      setCurrentFootnote(footnote);
      if (footnoteAudio) {
        footnoteAudio.pause();
        footnoteAudio.currentTime = 0;
      }
      const newAudio = new Audio(footnote.audio.sound);
      setFootnoteAudio(newAudio);
      newAudio.play();
    }
  };
  
  const FootnotesDisplay = ({ footnotes, onFootnoteClick }) => {
    return (
      <div className="mt-8 border-t pt-4">
        <h3 className="text-xl font-bold mb-4">Footnotes</h3>
        {footnotes.map(footnote => (
          <div key={footnote.id} className="mb-2">
            <sup className="text-blue-500 cursor-pointer" onClick={() => onFootnoteClick(footnote.id)}>
              [{footnote.id}]
            </sup>
            <span className="ml-2">{footnote.text}</span>
          </div>
        ))}
      </div>
    );
  };

  const isFirstOccurrence = (footnoteId, currentIndex) => {
    return lyrics.findIndex(lyric => lyric.footnoteIds.includes(footnoteId)) === currentIndex;
  };

  const renderLyric = (lyric, index) => {
    const footnoteIds = lyric.footnoteIds.reduce((acc, footnoteId, i) => {
      if (isFirstOccurrence(footnoteId, index)) acc.push(footnoteId);
      return acc;
    }, []);
    const footnoteIndicator =
      footnoteIds && footnoteIds.length > 0 ? (
        <div className="flex items-center">
          {footnoteIds.map((noteId) => (
            <sup
              key={`notedId-${noteId}`}
              className="text-blue-500 cursor-pointer ml-1"
              onClick={(e) => handleFootnoteClick(e, noteId)}
            >
              [{noteId}]
            </sup>
          ))}
        </div>
      ) : null;
  
    if (lyric.type === 'doha' || lyric.type === 'sortha') {
      const pattern = /॥\d+॥/;
      const isLine2 = pattern.test(lyric.text);
      return (
        <div className="flex items-center">
          <p className="flex justify-between w-full px-2" style={{ width: isLine2 ? '400px' : '370px'}}>
            {splitOnSpaceExceptLast(lyric.text.trim()).map((word, i) => <span key={i}>{word}</span>)}
          </p>
          <div className="w-[20px]"> {/* Fixed width container for footnote */}
            {footnoteIndicator}
          </div>
        </div>
      );
    } else if (lyric.type === 'samput') {
      const midPoint = lyric.text.indexOf('।');
      const firstPart = lyric.text.slice(0, midPoint + 1);
      const secondPart = lyric.text.slice(midPoint + 1) + "  ";
      return (
        <div className="flex items-center">
          <div
            className="flex w-full px-2 italic text-gray-600 font-bold"
            style={{ width: "500px" }}
          >
            <p className="w-[245px] flex justify-between">
              {splitOnSpaceExceptLast(firstPart.trim()).map((word, i) => (
                <span key={i}>{word}</span>
              ))}
            </p>
            <p className="w-[255px] flex justify-between pl-2">
              {splitOnSpaceExceptLast(secondPart.trim()).map((word, i) => (
                <span key={i}>{word}</span>
              ))}
            </p>
          </div>
          <div className="w-[20px]"> {/* Fixed width container for footnote */}
            {footnoteIndicator}
          </div>
        </div>
      );
    
    } else {
      const midPoint = lyric.text.indexOf('।');
      const firstPart = lyric.text.slice(0, midPoint + 1);
      const secondPart = lyric.text.slice(midPoint + 1) + "  ";
      return (
        <div className="flex items-center style={{ minHeight: '2em' }}">
          <div className="flex w-full px-2" style={{ width: "500px" }}>
            <p className="w-[245px] flex justify-between">
              {splitOnSpaceExceptLast(firstPart.trim()).map((word, i) => (
                <span key={i}>{word}</span>
              ))}
            </p>
            <p className="w-[255px] flex justify-between pl-2">
              {splitOnSpaceExceptLast(secondPart.trim()).map((word, i) => (
                <span key={i}>{word}</span>
              ))}
            </p>
          </div>
          <div className="w-[20px]"> {/* Fixed width container for footnote */}
            {footnoteIndicator}
          </div>
        </div>
      );
    }
  };

  const renderLyrics = () => {
    let currentSection = null;
    return (
      <div className="w-full flex flex-col items-center">
        {lyrics.reduce((acc, lyric, index) => {
          if (lyric.outlineIndex !== currentSection) {
            // very important!!
            currentSection = lyric.outlineIndex;
            acc.push(
              <div
                key={`section-${lyric.outlineIndex}`}
                className={`w-full mb-4 p-2 ${
                  lyric.outlineIndex === currentOutlineIndex ? 'bg-blue-100' : ''
                }`}
              >
                {[]}
              </div>
            );
          }
          acc[acc.length - 1].props.children.push(
            <div
              key={index}
              className={`text-lg cursor-pointer flex justify-center items-center w-full 
                ${index === currentLyricIndex ? "bg-yellow-200" : ""}`}
              onClick={() => {
                audioRef.current.currentTime = lyric.time;
                setCurrentTime(lyric.time);
                setCurrentLyricIndex(index);
                setCurrentOutlineIndex(lyric.outlineIndex);
                setManualScroll(false);
                setTimeout(() => {
                  scrollToHighlightedLyric();
                  scrollToCurrentOutline();
                }, 0);
              }}
            >
              {renderLyric(lyric, index)}
            </div>
          );
          return acc;
        }, [])}
      </div>
    );
  };
  
  const renderOutline = (outline) => {
    return (
      <div ref={outlineContainerRef} className="w-[300px] bg-gray-100 p-4 overflow-y-auto border-r border-gray-200 outline-container">
        <h3 className="font-bold mb-4 text-lg pl-4">प्रसंग</h3>
        {outline.map((item, index) => (
          <div
            key={index}
            className={`mb-2 text-sm cursor-pointer p-2 rounded pl-4 ${
              index === currentOutlineIndex
                ? "bg-blue-100"
                : "hover:bg-gray-200"
            }`}
            onClick={() => {
              const firstLyricOfOutline = lyrics.find(
                (lyric) => lyric.outlineIndex === index
              );
              if (firstLyricOfOutline) {
                audioRef.current.currentTime = firstLyricOfOutline.time;
                setCurrentTime(firstLyricOfOutline.time);
                setCurrentLyricIndex(lyrics.indexOf(firstLyricOfOutline));
                setCurrentOutlineIndex(index);
                setManualScroll(false);
              }
            }}
          >
            {item}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 absolute inset-0">
      <div className="flex w-full max-w-[1600px]"> {/* Increased max-width */}
        {renderOutline(outline)}
        <div className="flex-grow p-8 overflow-y-auto flex flex-col items-center" ref={lyricsContainerRef}>
          <div className="w-full max-w-[1000px]">
            <h2 className="text-4xl font-bold mb-8 text-center w-full">सुंदरकाण्‍‍ड</h2>
            {renderLyrics()}
            <FootnotesDisplay 
              footnotes={footnotes} 
              onFootnoteClick={(footnoteId) => handleFootnoteClick(new Event('click'), footnoteId)}
            />
          </div>
        </div>
        <div className="w-[400px] bg-white p-8 flex flex-col justify-end border-l border-gray-200">
          <div className="mb-4">
            <div className="w-full h-32 bg-gray-200 mb-4 flex justify-center items-center p-2">
              <div className="h-full w-full bg-gray-200 flex justify-center items-center">
                <img src={IMAGE_SOURCES.hanumanji} className="max-h-full max-w-full object-contain" alt="Hanumanji" />
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Vikesh Bhaiyya Recitation June 15 2024
            </div>
            <div
              ref={progressRef}
              className="h-2 bg-gray-300 rounded-full cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-sm text-gray-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button className="text-gray-600 hover:text-gray-800">
              <SkipBack size={20} />
            </button>
            <button
              onClick={togglePlayPause}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              <SkipForward size={20} />
            </button>
            <button
              onClick={toggleMute}
              className="text-gray-600 hover:text-gray-800"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20"
            />
          </div>
          <audio ref={audioRef} src={AUDIO_SOURCES.pavan} />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerWithLyricsAndOutline;

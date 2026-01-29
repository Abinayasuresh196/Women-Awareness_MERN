import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";
import "../../styles/FIRAssistant.css";
import "../../styles/lawModal.css";

const FIRAssistant = () => {
  const { t, i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';
  const [activeTab, setActiveTab] = useState("fir-info");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    date: "",
    time: "",
    place: "",
    description: "",
    accused: "",
    witnesses: "",
    evidence: ""
  });
  const [generatedFIR, setGeneratedFIR] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", description: "" });

  // Sample data for testing
  const fillSampleData = () => {
    setFormData({
      name: isTamil ? "ராஜேஷ் குமார்" : "Rajesh Kumar",
      age: "32",
      gender: isTamil ? "ஆண்" : "Male",
      phone: "+91 9876543210",
      address: isTamil ? "123, முருகன் தெரு, சென்னை, தமிழ்நாடு" : "123, Murugan Street, Chennai, Tamil Nadu",
      date: "2024-01-15",
      time: "14:30",
      place: isTamil ? "மெரினா கடற்கரை, சென்னை" : "Marina Beach, Chennai",
      description: isTamil ? "நான் கடற்கரையில் நடந்து கொண்டிருந்தபோது, மூன்று நபர்கள் என்னை சுற்றி வளைத்து தாக்கினார்கள். அவர்கள் எனது பணப்பையை பறித்து சென்றனர். நான் பயந்து போனேன் மற்றும் உடல் ரீதியாக பாதிக்கப்பட்டேன்." : "While walking on the beach, three individuals surrounded and attacked me. They snatched my wallet and fled. I was physically injured and traumatized by the incident.",
      accused: isTamil ? "மூன்று அடையாளம் தெரியாத நபர்கள், வயது 25-30, சிவப்பு மற்றும் கருப்பு நிற ஆடைகளில்" : "Three unidentified individuals, aged 25-30, wearing red and black colored clothes",
      witnesses: isTamil ? "கடற்கரையில் இருந்த சில பார்வையாளர்கள், ஆனால் அவர்கள் உதவ பயந்தார்கள்" : "Some beach visitors witnessed the incident but were afraid to help",
      evidence: isTamil ? "அருகில் உள்ள CCTV கேமராக்கள், சம்பவ இடத்தில் இருந்த எனது கைப்பேழையின் பாகங்கள்" : "Nearby CCTV cameras, parts of my bag found at the scene"
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateFIRDraft = () => {
    if (!formData.name || !formData.description || !formData.date) {
      toast.error(isTamil ? "பெயர், தேதி மற்றும் சம்பவ விவரங்கள் கட்டாயமானவை" : "Name, date, and incident description are required");
      return;
    }

    setIsGenerating(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const firTemplate = isTamil ? `
புகார் பதிவு எண்: FIR/2024/${Math.floor(Math.random() * 10000)}
தேதி: ${formData.date}
நேரம்: ${formData.time}

புகார்தாரர் விவரங்கள்:
பெயர்: ${formData.name}
வயது: ${formData.age}
பாலினம்: ${formData.gender}
தொலைபேசி: ${formData.phone}
முகவரி: ${formData.address}

சம்பவ விவரங்கள்:
தேதி: ${formData.date}
நேரம்: ${formData.time}
இடம்: ${formData.place}

சம்பவ விவரம்:
${formData.description}

குற்றவாளி விவரங்கள்:
${formData.accused}

சாட்சிகள்:
${formData.witnesses}

ஆதாரங்கள்:
${formData.evidence}

புகார் பதிவு செய்த அதிகாரி: உதவி ஆய்வாளர்
துறை: சென்னை மத்திய காவல் நிலையம்
` : `
FIR Number: FIR/2024/${Math.floor(Math.random() * 10000)}
Date: ${formData.date}
Time: ${formData.time}

Complainant Details:
Name: ${formData.name}
Age: ${formData.age}
Gender: ${formData.gender}
Phone: ${formData.phone}
Address: ${formData.address}

Incident Details:
Date: ${formData.date}
Time: ${formData.time}
Place: ${formData.place}

Incident Description:
${formData.description}

Accused Details:
${formData.accused}

Witnesses:
${formData.witnesses}

Evidence:
${formData.evidence}

FIR Registered By: Assistant Sub Inspector
Station: Central Police Station, Chennai
`;

      setGeneratedFIR(firTemplate);
      setIsGenerating(false);
      toast.success(isTamil ? "FIR டிராஃப்ட் உருவாக்கப்பட்டது!" : "FIR draft generated successfully!");
    }, 1500);
  };

  const downloadPDF = () => {
    if (!generatedFIR) {
      toast.error(isTamil ? "முதலில் FIR ஐ உருவாக்கவும்" : "Please generate FIR first");
      return;
    }

    // Create a simple PDF-like text file
    const element = document.createElement('a');
    const file = new Blob([generatedFIR], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `FIR_${formData.name.replace(/\s+/g, '_')}_${formData.date}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(isTamil ? "FIR டவுன்லோட் செய்யப்பட்டது!" : "FIR downloaded successfully!");
  };

  const analyzeWithAI = async () => {
    if (!aiQuestion.trim()) {
      toast.error(isTamil ? "தயவுசெய்து ஒரு கேள்வியை உள்ளிடவும்" : "Please enter a question");
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI response
    setTimeout(() => {
      const mockResponse = isTamil ? {
        problem: "பணம் பறிப்பு மற்றும் உடல் தாக்குதல்",
        applicableLaws: [
          "IPC Section 392: கொள்ளை",
          "IPC Section 323: உடல் காயம் விளைவிக்கும் தாக்குதல்",
          "IPC Section 506: குற்ற இருப்பு"
        ],
        punishment: "3 முதல் 7 ஆண்டுகள் சிறை",
        whatToDo: [
          "உடனடியாக உங்கள் வங்கியில் தொடர்பு கொள்ளவும்",
          "மருத்துவ சான்றிதழ் பெறவும்",
          "காவல் நிலையத்தில் புகார் பதிவு செய்யவும்",
          "தேசிய மகளிர் ஆணையத்திற்கு புகார் அளிக்கவும்"
        ],
        relevantLaws: ["IPC 392", "IPC 323", "IPC 506"],
        schemes: ["தேசிய மகளிர் ஆணையம்", "பாதிக்கப்பட்டோர் நிதி உதவி"],
        articles: ["பணியில் பாதுகாப்பு", "பாதிக்கப்பட்டோர் உரிமைகள்"]
      } : {
        problem: "Robbery and Physical Assault",
        applicableLaws: [
          "IPC Section 392: Robbery",
          "IPC Section 323: Voluntarily causing hurt",
          "IPC Section 506: Criminal intimidation"
        ],
        punishment: "3 to 7 years imprisonment",
        whatToDo: [
          "Immediately contact your bank to block cards",
          "Get medical certificate for injuries",
          "File FIR at nearest police station",
          "Lodge complaint with National Commission for Women"
        ],
        relevantLaws: ["IPC 392", "IPC 323", "IPC 506"],
        schemes: ["National Commission for Women", "Victim Compensation Scheme"],
        articles: ["Workplace Safety", "Victim Rights"]
      };

      setAiResponse(mockResponse);
      setIsAnalyzing(false);
      toast.success(isTamil ? "AI பகுப்பாய்வு முடிந்தது!" : "AI analysis completed!");
    }, 2000);
  };

  const quickQuestions = [
    isTamil ? "FIR எப்படி பதிவு செய்வது?" : "How to file an FIR?",
    isTamil ? "தாக்குதலுக்கு பிறகு என்ன செய்வது?" : "What to do after assault?",
    isTamil ? "பணியில் பாதுகாப்பு உரிமைகள் என்ன?" : "What are workplace safety rights?"
  ];

  const handleLearnMoreClick = (title, description) => {
    setModalContent({ title, description });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "fir-info":
        return (
          <div className="tab-content">
            <div className="content-container">
              <div className="cards-row">
                <div className="info-card">
                  <div className="card-image">
                    <img src="/assets/images/fir2.jpg" alt="FIR Information" />
                  </div>
                  <div className="card-content">
                    <div className="card-text-content">
                      <h3>{isTamil ? "FIR என்றால் என்ன?" : "What is an FIR?"}</h3>
                      <p>
                        {isTamil ?
                          "FIR (First Information Report) என்பது ஒரு குற்றத்தைப் பற்றி காவல் துறைக்கு அளிக்கப்படும் முதல் தகவல் அறிக்கை. இது குற்ற விசாரணையின் அடிப்படையாகும்." :
                          "FIR (First Information Report) is the initial report filed with the police regarding a cognizable offense. It serves as the foundation for criminal investigation."
                        }
                      </p>
                    </div>
                    <button className="learn-more-btn" onClick={() => handleLearnMoreClick(
                      isTamil ? "FIR என்றால் என்ன?" : "What is an FIR?",
                      isTamil ?
                        "FIR (First Information Report) என்பது ஒரு குற்றத்தைப் பற்றி காவல் துறைக்கு அளிக்கப்படும் முதல் தகவல் அறிக்கை. இது குற்ற விசாரணையின் அடிப்படையாகும். FIR என்பது இந்தியாவின் குற்றவியல் நீதி அமைப்பில் மிகவும் முக்கியமான ஆவணங்களில் ஒன்றாகும். இது காவல் துறையால் ஒரு அறியக்கூடிய குற்றம் நடந்ததற்கான முதல் அதிகாரப்பூர்வ பதிவாகும். அறியக்கூடிய குற்றம் என்பது காவல் துறைக்கு முன் அனுமதி இல்லாமல் நடவடிக்கை எடுக்கவும் குற்றம் சாட்டப்பட்டவரை கைது செய்யவும் அதிகாரம் உள்ள தீவிர குற்றமாகும். FIR பதிவு செய்வது குற்ற சட்டத்தை செயல்படுத்தும் முதல் படியாகும் மற்றும் காவல் துறைக்கு விசாரணையை தொடங்க அனுமதிக்கிறது.\n\nFIR பொதுவாக ஒரு காவல் நிலையத்தில் பதிவு செய்யப்படுகிறது, அங்கு ஒரு பாதிக்கப்பட்டவர், சாட்சி அல்லது சம்பவம் பற்றி அறிந்துள்ள வேறு எவரும் குற்றத்தை புகாரளிக்க காவல் துறையை அணுகும்போது. தகவல் வாய்வழியாகவோ அல்லது எழுத்து மூலமாகவோ கொடுக்கப்படலாம். தகவல் வாய்வழியாக கொடுக்கப்பட்டால், காவல் அதிகாரி அதை துல்லியமாக எழுத வேண்டும், புகார்தாரருக்கு மீண்டும் வாசிக்க வேண்டும் மற்றும் விவரங்கள் சரியானதா என்பதை உறுதிப்படுத்த அவர்களின் கையொப்பத்தை பெற வேண்டும். FIR பதிவு செய்யப்பட்ட பிறகு, புகார்தாரருக்கு FIR இன் இலவச நகலை பெற சட்டபூர்வ உரிமை உள்ளது.\n\nFIR இன் முக்கிய நோக்கம் குற்றத்துடன் தொடர்புடைய நிகழ்வுகளின் ஆரம்பகால பதிப்பை பதிவு செய்வதாகும். இது பின்னர் கட்டத்தில் உண்மைகள் மாற்றப்படுவதை அல்லது மோசடி செய்யப்படுவதை தடுக்க உதவுகிறது. FIR பொதுவாக குற்றத்தின் தேதி, நேரம் மற்றும் இடம், என்ன நடந்தது என்பதன் விவரம், தெரிந்தால் தொடர்புடைய நபர்களின் பெயர்கள் மற்றும் எந்த சாட்சிகளின் பெயர்கள் ஆகிய முக்கியமான விவரங்களை கொண்டுள்ளது. FIR இல் வழங்கப்பட்ட தகவலின் அடிப்படையில், காவல் துறை ஆதாரங்களை சேகரிப்பது, சாட்சிகளை விசாரிப்பது மற்றும் தேவையான சட்ட நடவடிக்கை எடுப்பது ஆகியவற்றை உள்ளடக்கிய விசாரணையை தொடங்குகிறது.\n\nFIR கள் கொலை, பாலியல் வன்கொடுமை, வீட்டுவெறுப்பு, மணமகள் துன்புறுத்தல், கடத்தல், பாலியல் தாக்குதல், கொள்ளை மற்றும் சைபர் குற்றங்கள் போன்ற தீவிர குற்றங்களுக்கு பதிவு செய்யப்படுகின்றன. பெண்களை உள்ளடக்கிய வழக்குகளில், பாதுகாப்பு மற்றும் மரியாதையை உறுதி செய்வதற்காக சட்டம் சிறப்பு பாதுகாப்புகளை வழங்குகிறது. உதாரணமாக, ஒரு பெண்ணுக்கு அவரது அறிக்கையை ஒரு பெண் காவல் அதிகாரி பதிவு செய்யும் உரிமை உள்ளது, மற்றும் உணர்வுபூர்வமான வழக்குகளில், அறிக்கை அவரது வீட்டில் அல்லது அவரது தேர்வின் இடத்தில் பதிவு செய்யப்படலாம்.\n\nFIR பதிவு செய்வதற்கு கடுமையான கால வரம்பு இல்லை. ஒரு சம்பவத்திற்குப் பிறகு உடனடியாக FIR பதிவு செய்வது பொதுவாக நல்லது என்றாலும், பல சூழ்நிலைகளில் தாமதங்கள் புரிந்துகொள்ளக்கூடியவை, குறிப்பாக பாலியல் குற்றங்கள் அல்லது வீட்டுவெறுப்பு தொடர்பான வழக்குகளில் தாமதங்கள் புரிந்துகொள்ளக்கூடியவை. சட்டம் இந்த சவால்களை அங்கீகரிக்கிறது மற்றும் தாமதத்திற்குப் பிறகும் FIR களை பதிவு செய்ய அனுமதிக்கிறது.\n\nFIR அமைப்பின் மற்றொரு முக்கிய அம்சம் பூஜ்ஜிய FIR என்ற கருத்தாகும். பூஜ்ஜிய FIR என்பது ஒரு நபர் குற்றம் நடந்த இடத்தைப் பொருட்படுத்தாமல் எந்த காவல் நிலையத்திலும் FIR பதிவு செய்ய அனுமதிக்கிறது. காவல் துறை அதிகார வரம்பு காரணங்களுக்காக இத்தகைய FIR ஐ பதிவு செய்ய மறுக்க முடியாது. பதிவுக்குப் பிறகு, FIR சரியான அதிகார வரம்பைக் கொண்ட காவல் நிலையத்திற்கு மாற்றப்படுகிறது. இந்த விதிமுறை அவசரகால சூழ்நிலைகளில் குறிப்பாக பயனுள்ளதாக உள்ளது மற்றும் உடனடி சட்ட பாதுகாப்பை உறுதி செய்கிறது.\n\nகாவல் துறை அறியக்கூடிய குற்றத்திற்கான FIR ஐ பதிவு செய்ய மறுத்தால், சட்டம் புகார்தாரருக்கு சட்ட உதவி சேவைகள் அல்லது மகளிர் ஆணையங்களிடமிருந்து உதவி கோருதல், நீதிபதி மாஜிஸ்ட்ரேட் முன் புகார் அளித்தல் அல்லது உயர் காவல் அதிகாரிகளை அணுகுதல் போன்ற தீர்வுகளை வழங்குகிறது. அறியக்கூடிய வழக்குகளில் FIR ஐ பதிவு செய்ய காவல் துறை மறுப்பது சட்ட கடமை மீறலாக கருதப்படுகிறது.\n\nமுடிவில், FIR நீதி உறுதி செய்வதில் மற்றும் சட்டம் மற்றும் ஒழுங்கை பராமரிப்பதில் முக்கிய பங்கு வகிக்கிறது. இது தனிநபர்களுக்கு குற்றங்களை புகார் அளிக்க, பாதிக்கப்பட்டவர்களின் உரிமைகளை பாதுகாக்க மற்றும் குற்றங்கள் சரியான முறையில் விசாரிக்கப்படுவதை உறுதி செய்கிறது. FIR களைப் பற்றிய விழிப்புணர்வு, குறிப்பாக பெண்களுக்கு, பயத்தை மீறி, அவர்களின் உரிமைகளை உறுதிப்படுத்தி, காலத்திற்கு ஏற்ற சட்ட பாதுகாப்பை கோர உதவுகிறது. FIR பதிவு செய்வதன் முக்கியத்துவம் மற்றும் செயல்முறை பற்றிய புரிதல், பாதுகாப்பான மற்றும் நீதியான சமூகத்தை உருவாக்குவதற்கான முக்கியமான படியாகும்."
                        :
                        "A First Information Report, commonly known as an FIR, is one of the most important documents in the criminal justice system of India. It is the first official record made by the police when they receive information about the commission of a cognizable offence. A cognizable offence is a serious offence in which the police have the authority to take action and arrest the accused without prior permission from a court. Filing an FIR is the first step that activates the criminal law and allows the police to begin an investigation.\n\nAn FIR is usually registered at a police station when a victim, a witness, or any other person with knowledge of the incident approaches the police to report a crime. The information can be given either orally or in writing. If the information is given orally, the police officer is required to write it down accurately, read it back to the informant, and obtain their signature to confirm that the details are correct. After the FIR is registered, the informant has the legal right to receive a free copy of the FIR.\n\nThe main purpose of an FIR is to record the earliest version of events related to a crime. This helps prevent changes or manipulation of facts at a later stage. An FIR generally contains important details such as the date, time, and place of the offence, a description of what happened, the names of the persons involved if known, and the names of any witnesses. Based on the information provided in the FIR, the police start their investigation, which includes collecting evidence, questioning witnesses, and taking necessary legal action.\n\nFIRs are registered for serious offences such as murder, rape, domestic violence, dowry harassment, kidnapping, sexual assault, robbery, and cyber crimes. In cases involving women, the law provides special safeguards to ensure safety and dignity. For example, a woman has the right to have her statement recorded by a woman police officer, and in sensitive cases, the statement may be recorded at her home or a place of her choice.\n\nThere is no strict time limit for filing an FIR. Although it is generally better to file an FIR as soon as possible after the incident, delays are understandable in many situations, especially in cases involving trauma, fear, or social pressure. The law recognizes these challenges and allows FIRs to be filed even after a delay, particularly in cases related to sexual offences or domestic abuse.\n\nAnother important feature of the FIR system is the concept of a Zero FIR. A Zero FIR allows a person to file an FIR at any police station, regardless of where the offence took place. The police cannot refuse to register such an FIR on the grounds of jurisdiction. After registration, the FIR is transferred to the police station that has proper jurisdiction. This provision is especially useful during emergencies and helps ensure immediate legal protection.\n\nIf the police refuse to register an FIR for a cognizable offence, the law provides remedies to the complainant. The person can approach higher police authorities such as the Superintendent of Police, file a complaint before a Judicial Magistrate, or seek assistance from legal aid services or women's commissions. Refusal by the police to register an FIR in cognizable cases is considered a violation of legal duty.\n\nIn conclusion, an FIR plays a crucial role in ensuring justice and maintaining law and order. It empowers individuals to report crimes, protects the rights of victims, and ensures that offences are properly investigated. Awareness about FIRs helps people, especially women, to overcome fear, assert their rights, and seek timely legal protection. Understanding the importance and process of filing an FIR is an essential step toward building a safer and more just society."
                    )}>
                      {isTamil ? "மேலும் படிக்க" : "Learn More"}
                    </button>
                  </div>
                </div>
                <div className="info-card">
                  <div className="card-image">
                    <img src="/assets/images/fir1.jpg" alt="Filing FIR" />
                  </div>
                  <div className="card-content">
                    <div className="card-text-content">
                      <h3>{isTamil ? "எப்போது FIR பதிவு செய்ய வேண்டும்?" : "When to File an FIR?"}</h3>
                      <p>
                        {isTamil ?
                          "குற்றம் நடந்தவுடன், உடனடியாக FIR பதிவு செய்ய வேண்டும். இது உங்கள் பாதுகாப்புக்கும், நீதிக்கும் முக்கியமானது." :
                          "File an FIR immediately after a crime occurs. It's crucial for your protection and for ensuring justice is served."
                        }
                      </p>
                    </div>
                    <button className="learn-more-btn" onClick={() => handleLearnMoreClick(
                      isTamil ? "எப்போது FIR பதிவு செய்ய வேண்டும்?" : "When to File an FIR?",
                      isTamil ?
                        "ஒரு குற்றம் நடந்த உடனேயே FIR பதிவு செய்ய வேண்டும். இது உங்கள் பாதுகாப்புக்கு மற்றும் நீதி உறுதி செய்யப்படுவதற்கு மிகவும் முக்கியமானது. FIR பதிவு செய்வது என்பது குற்ற சட்டத்தை செயல்படுத்தும் முதல் படியாகும் மற்றும் காவல் துறைக்கு விசாரணையை தொடங்க அனுமதிக்கிறது. FIR பதிவு செய்யும் நேரம் என்பது சம்பவம் நடந்த நேரத்திலிருந்து சம்பவம் பற்றிய தகவல் காவல் துறைக்கு கிடைக்கும் நேரம் வரை இருக்கும். சம்பவம் நடந்த உடனேயே FIR பதிவு செய்வது முக்கியமானது, ஏனெனில் இது சம்பவம் பற்றிய ஆரம்பகால மற்றும் துல்லியமான பதிவை உறுதி செய்கிறது, இது பின்னர் கட்டத்தில் உண்மைகள் மாற்றப்படுவதை அல்லது மோசடி செய்யப்படுவதை தடுக்க உதவுகிறது.\n\nFIR பதிவு செய்ய வேண்டிய சில முக்கிய சூழ்நிலைகள்:\n\n1. குற்றம் நடந்த உடனேயே: ஒரு குற்றம் நடந்த உடனேயே FIR பதிவு செய்ய வேண்டும். தாமதம் செய்வது ஆதாரங்கள் அழிக்கப்படலாம் அல்லது சாட்சிகள் மறக்கலாம் அல்லது மாறலாம்.\n\n2. பாதுகாப்பு அச்சுறுத்தல்: நீங்கள் உங்கள் பாதுகாப்பு அச்சுறுத்தப்படுவதாக உணர்ந்தால், உடனடியாக FIR பதிவு செய்ய வேண்டும். இது உங்களுக்கு சட்ட பாதுகாப்பை வழங்குகிறது மற்றும் காவல் துறைக்கு உங்களுக்கு தேவையான உதவியை வழங்க அனுமதிக்கிறது.\n\n3. சட்ட உரிமைகள்: FIR பதிவு செய்வது உங்களுக்கு சட்ட உரிமைகளை வழங்குகிறது. உதாரணமாக, நீங்கள் ஒரு குற்றத்தின் பாதிக்கப்பட்டவராக இருந்தால், FIR பதிவு செய்வது உங்களுக்கு சட்ட உதவி மற்றும் நிவாரணத்தை பெற உதவுகிறது.\n\n4. நீதி உறுதி: FIR பதிவு செய்வது நீதி உறுதி செய்யப்படுவதற்கு உதவுகிறது. இது காவல் துறைக்கு குற்றவாளிகளை கண்டறியவும் கைது செய்யவும் அனுமதிக்கிறது மற்றும் குற்றம் நடந்ததற்கான ஆதாரங்களை சேகரிக்க உதவுகிறது.\n\nFIR பதிவு செய்ய வேண்டிய சில முக்கிய சூழ்நிலைகள்:\n\n1. கொலை அல்லது கொலை முயற்சி\n2. பாலியல் வன்கொடுமை அல்லது பாலியல் தாக்குதல்\n3. வீட்டுவெறுப்பு அல்லது குடும்ப வன்கொடுமை\n4. கடத்தல் அல்லது கிட்னாப்பிங்\n5. கொள்ளை அல்லது திருட்டு\n6. சைபர் குற்றங்கள் அல்லது இணைய துன்புறுத்தல்\n7. வாகன விபத்துகள் அல்லது தவறான வாகன ஓட்டம்\n8. பொது அமைதி மீறல் அல்லது கலவரம்\n\nFIR பதிவு செய்ய வேண்டிய நேரம் பற்றிய சில முக்கிய புள்ளிகள்:\n\n- FIR பதிவு செய்ய வேண்டிய நேரம் என்பது சம்பவம் நடந்த நேரத்திலிருந்து சம்பவம் பற்றிய தகவல் காவல் துறைக்கு கிடைக்கும் நேரம் வரை இருக்கும்.\n- FIR பதிவு செய்ய வேண்டிய நேரம் என்பது சம்பவம் நடந்த இடத்திலிருந்து அருகிலுள்ள காவல் நிலையத்திற்கு செல்லும் நேரம் வரை இருக்கும்.\n- FIR பதிவு செய்ய வேண்டிய நேரம் என்பது சம்பவம் நடந்த நேரத்திலிருந்து சம்பவம் பற்றிய தகவல் காவல் துறைக்கு கிடைக்கும் நேரம் வரை இருக்கும்.\n- FIR பதிவு செய்ய வேண்டிய நேரம் என்பது சம்பவம் நடந்த நேரத்திலிருந்து சம்பவம் பற்றிய தகவல் காவல் துறைக்கு கிடைக்கும் நேரம் வரை இருக்கும்.\n\nFIR பதிவு செய்ய வேண்டிய நேரம் பற்றிய சில முக்கிய புள்ளிகள்:\n\n- FIR பதிவு செய்ய வேண்டிய நேரம் என்பது சம்பவம் நடந்த நேரத்திலிருந்து சம்பவம் பற்றிய தகவல் காவல் துறைக்கு கிடைக்கும் நேரம் வரை இருக்கும்.\n- FIR பதிவு செய்ய வேண்டிய நேரம் என்பது சம்பவம் நடந்த இடத்திலிருந்து அருகிலுள்ள காவல் நிலையத்திற்கு செல்லும் நேரம் வரை இருக்கும்.\n- FIR பதிவு செய்ய வேண்டிய நேரம் என்பது சம்பவம் நடந்த நேரத்திலிருந்து சம்பவம் பற்றிய தகவல் காவல் துறைக்கு கிடைக்கும் நேரம் வரை இருக்கும்.\n- FIR பதிவு செய்ய வேண்டிய நேரம் என்பது சம்பவம் நடந்த நேரத்திலிருந்து சம்பவம் பற்றிய தகவல் காவல் துறைக்கு கிடைக்கும் நேரம் வரை இருக்கும்."
                        :
                        "An FIR should be filed immediately after a crime occurs. It is crucial for your protection and for ensuring that justice is served. Filing an FIR is the first step that activates the criminal law and allows the police to begin an investigation. The timing of filing an FIR can range from the moment the incident occurs to the time when information about the incident reaches the police. It is important to file an FIR as soon as possible after the incident, as this ensures an early and accurate record of the event, which helps prevent changes or manipulation of facts at a later stage.\n\nHere are some key situations when an FIR should be filed:\n\n1. Immediately After the Crime: An FIR should be filed as soon as a crime occurs. Delaying can result in the loss of evidence or witnesses forgetting or changing their statements.\n\n2. Threat to Safety: If you feel that your safety is threatened, you should file an FIR immediately. This provides you with legal protection and allows the police to provide you with the necessary assistance.\n\n3. Legal Rights: Filing an FIR gives you legal rights. For example, if you are a victim of a crime, filing an FIR helps you get legal aid and compensation.\n\n4. Ensuring Justice: Filing an FIR helps ensure that justice is served. It allows the police to identify and arrest the culprits and helps gather evidence that the crime occurred.\n\nHere are some key situations when an FIR should be filed:\n\n1. Murder or Attempt to Murder\n2. Rape or Sexual Assault\n3. Domestic Violence or Family Abuse\n4. Kidnapping or Abduction\n5. Robbery or Theft\n6. Cyber Crimes or Online Harassment\n7. Vehicle Accidents or Reckless Driving\n8. Public Disturbance or Rioting\n\nHere are some key points about the timing of filing an FIR:\n\n- The timing of filing an FIR can range from the moment the incident occurs to the time when information about the incident reaches the police.\n- The timing of filing an FIR can range from the moment the incident occurs to the time it takes to reach the nearest police station from the scene of the incident.\n- The timing of filing an FIR can range from the moment the incident occurs to the time when information about the incident reaches the police.\n- The timing of filing an FIR can range from the moment the incident occurs to the time when information about the incident reaches the police."
                    )}>
                      {isTamil ? "மேலும் படிக்க" : "Learn More"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "legal-process":
        return (
          <div className="tab-content">
            <div className="content-container">
              <div className="cards-row">
                <div className="info-card">
                  <div className="card-image">
                    <img src="/assets/images/fir3.jpg" alt="FIR Process" />
                  </div>
                  <div className="card-content">
                    <div className="card-text-content">
                      <h3>{isTamil ? "FIR பதிவு செயல்முறை" : "FIR Filing Process"}</h3>
                      <p>
                        {isTamil ?
                          "படி 1: அருகிலுள்ள காவல் நிலையத்திற்கு செல்லவும்\nபடி 2: உங்கள் பெயர் மற்றும் சம்பவ விவரங்களை பதிவு செய்யவும்\nபடி 3: FIR பதிவு எண்ணைப் பெறவும்\nபடி 4: விசாரணைக்கு ஒத்துழைக்கவும்" :
                          "Step 1: Visit nearest police station\nStep 2: Register your name and incident details\nStep 3: Obtain FIR number\nStep 4: Cooperate with investigation"
                        }
                      </p>
                    </div>
                    <button className="learn-more-btn" onClick={() => handleLearnMoreClick(
                      isTamil ? "FIR பதிவு செயல்முறை" : "FIR Filing Process",
                      isTamil ?
                        "FIR பதிவு செயல்முறை என்பது ஒரு குற்றம் நடந்த பிறகு நீங்கள் பின்பற்ற வேண்டிய படிகளின் வரிசையாகும். இந்த செயல்முறை உங்கள் பாதுகாப்பை உறுதி செய்வது மட்டுமல்லாமல், குற்றவாளிகளை நீதி முன் கொண்டு வருவதற்கான அடிப்படை ஆவணத்தை உருவாக்குகிறது.\n\n1. அருகிலுள்ள காவல் நிலையத்திற்கு செல்லவும்: குற்றம் நடந்த உடனேயே உங்கள் அருகிலுள்ள காவல் நிலையத்திற்கு செல்லவும். தாமதம் செய்வது ஆதாரங்கள் அழிக்கப்படலாம் அல்லது சாட்சிகள் மறக்கலாம்.\n\n2. உங்கள் பெயர் மற்றும் சம்பவ விவரங்களை பதிவு செய்யவும்: காவல் நிலையத்தில், உங்கள் முழு பெயர், முகவரி, தொடர்பு விவரங்கள் மற்றும் சம்பவம் பற்றிய விரிவான விவரங்களை வழங்கவும். சம்பவம் நடந்த தேதி, நேரம், இடம் மற்றும் என்ன நடந்தது என்பதன் விவரம் ஆகியவை முக்கியமானவை.\n\n3. FIR பதிவு எண்ணைப் பெறவும்: உங்கள் புகாரை பதிவு செய்த பிறகு, உங்களுக்கு ஒரு FIR எண் வழங்கப்படும். இந்த எண் உங்கள் புகாரின் அதிகாரப்பூர்வ பதிவாகும் மற்றும் விசாரணை செயல்முறையை தொடங்கும்.\n\n4. விசாரணைக்கு ஒத்துழைக்கவும்: FIR பதிவு செய்யப்பட்ட பிறகு, காவல் துறை விசாரணையை தொடங்கும். நீங்கள் காவல் துறைக்கு முழு ஒத்துழைப்பை வழங்க வேண்டும், ஆதாரங்களை வழங்க வேண்டும் மற்றும் தேவையான சாட்சிகளை வழங்க வேண்டும்.\n\nFIR பதிவு செயல்முறை என்பது உங்கள் உரிமைகளை பாதுகாக்கும் மற்றும் நீதி உறுதி செய்யும் முக்கியமான படியாகும். இந்த செயல்முறையை புரிந்துகொள்வது உங்களுக்கு நம்பிக்கையை அளிக்கும் மற்றும் உங்கள் பாதுகாப்பை உறுதி செய்யும்." :
                        "The FIR filing process is a series of steps you need to follow after a crime has occurred. This process not only ensures your safety but also creates the foundation for bringing the culprits to justice.\n\n1. Visit the nearest police station: Immediately after the crime, go to your nearest police station. Delaying can result in the loss of evidence or witnesses forgetting important details.\n\n2. Register your name and incident details: At the police station, provide your full name, address, contact details, and a detailed description of the incident. The date, time, location of the incident, and what happened are crucial details.\n\n3. Obtain FIR number: After registering your complaint, you will be given an FIR number. This number is the official record of your complaint and initiates the investigation process.\n\n4. Cooperate with the investigation: Once the FIR is registered, the police will begin their investigation. You should provide full cooperation to the police, provide any evidence you have, and give statements if required.\n\nThe FIR filing process is a crucial step in protecting your rights and ensuring justice. Understanding this process will give you confidence and ensure your safety."
                    )}>
                      {isTamil ? "மேலும் படிக்க" : "Learn More"}
                    </button>
                  </div>
                </div>
                <div className="info-card">
                  <div className="card-image">
                    <img src="/assets/images/fir4.jpg" alt="Legal Rights" />
                  </div>
                  <div className="card-content">
                    <div className="card-text-content">
                      <h3>{isTamil ? "விசாரணையின் போது சட்ட உரிமைகள்" : "Legal Rights During Investigation"}</h3>
                      <p>
                        {isTamil ?
                          "• உங்கள் பெயர் மற்றும் விவரங்கள் ரகசியமாக வைக்கப்படும்\n• உங்கள் வாக்குமூலம் பதிவு செய்யப்படும்\n• நீதிக்காக உதவி கோரலாம்\n• வழக்கின் நிலையை கேட்கலாம்" :
                          "• Your identity and details remain confidential\n• Your statement will be recorded\n• You can seek legal aid\n• You can inquire about case status"
                        }
                      </p>
                    </div>
                    <button className="learn-more-btn" onClick={() => handleLearnMoreClick(
                      isTamil ? "விசாரணையின் போது சட்ட உரிமைகள்" : "Legal Rights During Investigation",
                      isTamil ?
                        "விசாரணையின் போது உங்களுக்கு பல சட்ட உரிமைகள் உள்ளன, அவை உங்கள் பாதுகாப்பை உறுதி செய்வது மட்டுமல்லாமல், நீதி உறுதி செய்யப்படும் என்பதை உறுதி செய்கின்றன.\n\n1. ரகசியம்: உங்கள் பெயர் மற்றும் தனிப்பட்ட விவரங்கள் ரகசியமாக வைக்கப்படும். காவல் துறை உங்கள் விவரங்களை பாதுகாக்க வேண்டும் மற்றும் அவற்றை பொதுமக்களிடம் வெளிப்படுத்தக் கூடாது.\n\n2. வாக்குமூலம் பதிவு: உங்கள் வாக்குமூலம் துல்லியமாக பதிவு செய்யப்படும். நீங்கள் வழங்கும் தகவல்கள் சரியானதாக இருக்கும் என்பதை உறுதி செய்ய, காவல் அதிகாரி உங்களுக்கு மீண்டும் வாசிக்க வேண்டும் மற்றும் உங்கள் கையொப்பத்தை பெற வேண்டும்.\n\n3. சட்ட உதவி: நீங்கள் சட்ட உதவியை கோரலாம். உங்களுக்கு சட்ட ஆலோசனை மற்றும் உதவி தேவைப்பட்டால், நீங்கள் ஒரு வழக்கறிஞரை அணுகலாம் அல்லது சட்ட உதவி சேவைகளை கோரலாம்.\n\n4. வழக்கின் நிலை: நீங்கள் வழக்கின் நிலை பற்றி கேட்கலாம். காவல் துறை உங்களுக்கு வழக்கின் முன்னேற்றம் பற்றிய தகவல்களை வழங்க வேண்டும் மற்றும் விசாரணையின் நிலை பற்றி உங்களுக்கு தெரிவிக்க வேண்டும்.\n\n5. பாதுகாப்பு: நீங்கள் பாதுகாப்பாக உணர வேண்டும். காவல் துறை உங்கள் பாதுகாப்பை உறுதி செய்ய வேண்டும் மற்றும் உங்களுக்கு தேவையான பாதுகாப்பை வழங்க வேண்டும்.\n\nஇந்த சட்ட உரிமைகள் உங்களுக்கு நம்பிக்கையை அளிக்கும் மற்றும் நீதி உறுதி செய்யப்படும் என்பதை உறுதி செய்யும். உங்கள் உரிமைகளை புரிந்துகொள்வது உங்களுக்கு வலிமையை அளிக்கும் மற்றும் உங்கள் பாதுகாப்பை உறுதி செய்யும்." :
                        "During an investigation, you have several legal rights that not only ensure your safety but also guarantee that justice will be served.\n\n1. Confidentiality: Your name and personal details will remain confidential. The police are required to protect your information and not disclose it to the public.\n\n2. Statement Recording: Your statement will be recorded accurately. The police officer should read back the information to you to ensure that the details are correct and obtain your signature.\n\n3. Legal Aid: You can seek legal aid. If you need legal advice and assistance, you can approach a lawyer or request legal aid services.\n\n4. Case Status: You can inquire about the case status. The police should provide you with information about the progress of the case and keep you informed about the status of the investigation.\n\n5. Protection: You should feel safe. The police are required to ensure your safety and provide you with the necessary protection.\n\nThese legal rights will give you confidence and ensure that justice is served. Understanding your rights will empower you and ensure your safety."
                    )}>
                      {isTamil ? "மேலும் படிக்க" : "Learn More"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "generate-fir":
        return (
          <div className="tab-content">
            <div className="fir-layout">
              <div className="fir-form">
                <h3>{isTamil ? "FIR உருவாக்கு" : "Generate FIR"}</h3>
                <form>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{isTamil ? "பெயர்" : "Name"}</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={isTamil ? "உங்கள் பெயர்" : "Your full name"}
                      />
                    </div>
                    <div className="form-group">
                      <label>{isTamil ? "வயது" : "Age"}</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="30"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>{isTamil ? "பாலினம்" : "Gender"}</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="">{isTamil ? "தேர்வு செய்" : "Select"}</option>
                        <option value={isTamil ? "ஆண்" : "Male"}>{isTamil ? "ஆண்" : "Male"}</option>
                        <option value={isTamil ? "பெண்" : "Female"}>{isTamil ? "பெண்" : "Female"}</option>
                        <option value={isTamil ? "பிறர்" : "Other"}>{isTamil ? "பிறர்" : "Other"}</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>{isTamil ? "தொலைபேசி" : "Phone"}</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{isTamil ? "முகவரி" : "Address"}</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder={isTamil ? "உங்கள் முழு முகவரி" : "Your complete address"}
                      rows="3"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>{isTamil ? "தேதி" : "Date"}</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>{isTamil ? "நேரம்" : "Time"}</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{isTamil ? "சம்பவ இடம்" : "Place of Incident"}</label>
                    <input
                      type="text"
                      name="place"
                      value={formData.place}
                      onChange={handleInputChange}
                      placeholder={isTamil ? "சம்பவம் நடந்த இடம்" : "Location where incident occurred"}
                    />
                  </div>

                  <div className="form-group">
                    <label>{isTamil ? "சம்பவ விவரம்" : "Incident Description"}</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder={isTamil ? "சம்பவத்தின் விரிவான விவரம்" : "Detailed description of the incident"}
                      rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label>{isTamil ? "குற்றவாளி விவரங்கள்" : "Accused Details"}</label>
                    <textarea
                      name="accused"
                      value={formData.accused}
                      onChange={handleInputChange}
                      placeholder={isTamil ? "குற்றவாளியின் விவரங்கள்" : "Details about the accused"}
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label>{isTamil ? "சாட்சிகள்" : "Witnesses"}</label>
                    <textarea
                      name="witnesses"
                      value={formData.witnesses}
                      onChange={handleInputChange}
                      placeholder={isTamil ? "சாட்சிகள் பற்றிய விவரங்கள்" : "Information about witnesses"}
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label>{isTamil ? "ஆதாரங்கள்" : "Evidence"}</label>
                    <textarea
                      name="evidence"
                      value={formData.evidence}
                      onChange={handleInputChange}
                      placeholder={isTamil ? "கிடைத்த ஆதாரங்கள்" : "Available evidence"}
                      rows="3"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={fillSampleData}
                      className="sample-btn"
                    >
                      {isTamil ? "மாதிரி தரவு நிரப்பு" : "Fill Sample Data"}
                    </button>
                    <button
                      type="button"
                      onClick={generateFIRDraft}
                      className="generate-btn"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (isTamil ? "உருவாக்குகிறது..." : "Generating...") : (isTamil ? "FIR டிராஃப்ட் உருவாக்கு" : "Generate FIR Draft")}
                    </button>
                  </div>
                </form>
              </div>

              <div className="fir-preview">
                <div className="preview-card">
                  <h3>{isTamil ? "FIR முன்னோட்டம்" : "FIR Preview"}</h3>
                  {generatedFIR ? (
                    <div className="fir-content">
                      <pre>{generatedFIR}</pre>
                      <div className="preview-actions">
                        <button className="view-btn">
                          {isTamil ? "FIR ஐப் பார்" : "View FIR"}
                        </button>
                        <button
                          className="download-btn"
                          onClick={downloadPDF}
                        >
                          {isTamil ? "PDF ஐப் பதிவிறக்கு" : "Download PDF"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="no-preview">
                      <div className="empty-state">
                        <span className="empty-icon">📄</span>
                        <p>{isTamil ? "FIR ஐ உருவாக்க தயாராக உள்ளது" : "Ready to generate FIR"}</p>
                        <p className="sub-text">
                          {isTamil ? "மேலே உள்ள படிவத்தை நிரப்பி 'FIR டிராஃப்ட் உருவாக்கு' ஐக்கோப்பை கிளிக் செய்யவும்" : "Fill the form above and click 'Generate FIR Draft'"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="disclaimer">
              <p>
                <strong>{isTamil ? "குறிப்பு:" : "Disclaimer:"}</strong>{" "}
                {isTamil ?
                  "இந்த சேவை உதவிக்குறிப்பாக மட்டுமே. உண்மையான FIR பதிவு செய்ய, உங்கள் அருகிலுள்ள காவல் நிலையத்திற்கு செல்லவும்." :
                  "This service is for informational purposes only. To file an actual FIR, visit your nearest police station."
                }
              </p>
            </div>
          </div>
        );

      case "ai-assistant":
        return (
          <div className="tab-content">
            <div className="ai-assistant-card">
              <h3>{isTamil ? "AI சட்ட உதவி" : "AI Legal Assistant"}</h3>
              <div className="ai-input-section">
                <textarea
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder={isTamil ?
                    "உங்கள் சட்ட கேள்வியை இங்கே உள்ளிடவும்..." :
                    "Enter your legal question here..."
                  }
                  rows="4"
                />
                <button
                  onClick={analyzeWithAI}
                  className="analyze-btn"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (isTamil ? "பகுப்பாய்வு செய்கிறது..." : "Analyzing...") : (isTamil ? "AI க்கு கேள்" : "Ask AI")}
                </button>
              </div>

              {aiResponse && (
                <div className="ai-response">
                  <div className="response-section">
                    <h4>{isTamil ? "அடையாளம் காணப்பட்ட பிரச்சனை" : "Problem Identified"}</h4>
                    <p>{aiResponse.problem}</p>
                  </div>

                  <div className="response-section">
                    <h4>{isTamil ? "பொருந்தக்கூடிய சட்டங்கள்" : "Applicable Laws"}</h4>
                    <ul>
                      {aiResponse.applicableLaws.map((law, index) => (
                        <li key={index}>{law}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="response-section">
                    <h4>{isTamil ? "தண்டனை" : "Punishment"}</h4>
                    <p>{aiResponse.punishment}</p>
                  </div>

                  <div className="response-section">
                    <h4>{isTamil ? "நீங்கள் செய்ய வேண்டியவை" : "What You Can Do"}</h4>
                    <ul>
                      {aiResponse.whatToDo.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="related-info">
                    <div className="info-grid">
                      <div className="info-card">
                        <h5>{isTamil ? "தொடர்புடைய சட்டங்கள்" : "Relevant Laws"}</h5>
                        <ul>
                          {aiResponse.relevantLaws.map((law, index) => (
                            <li key={index}>{law}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="info-card">
                        <h5>{isTamil ? "திட்டங்கள்" : "Schemes"}</h5>
                        <ul>
                          {aiResponse.schemes.map((scheme, index) => (
                            <li key={index}>{scheme}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="info-card">
                        <h5>{isTamil ? "கட்டுரைகள்" : "Articles"}</h5>
                        <ul>
                          {aiResponse.articles.map((article, index) => (
                            <li key={index}>{article}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="quick-questions">
                <h4>{isTamil ? "விரைவான கேள்விகள்" : "Quick Questions"}</h4>
                <div className="quick-questions-grid">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setAiQuestion(question)}
                      className="quick-question-btn"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {(isGenerating || isAnalyzing) && <Loader fullScreen />}
      
      <div className="fir-assistant">
      <div className="fir-main">
        {/* FIR Assistant Header - Like Schemes page */}
        <div className="fir-header">
          <h1 className="fir-title">
            {isTamil ? "FIR உதவி" : "FIR Assistant"}
          </h1>
          <p className="fir-subtitle">
            {isTamil ?
              "உங்கள் பாதுகாப்புக்கான சட்ட உதவி மற்றும் வழிகாட்டி. FIR பதிவு செயல்முறை, சட்ட உரிமைகள் மற்றும் உதவிக்குறிப்புகள்." :
              "Your legal guide and assistant for safety and protection. Learn about FIR filing process, legal rights, and helpful tips."
            }
          </p>
        </div>

        {/* FIR Tabs - Like Schemes filters section */}
        <div className="fir-tabs">
          <div className="tabs-buttons">
            {[
              { key: "fir-info", label: isTamil ? "FIR தகவல்" : "FIR Information" },
              { key: "legal-process", label: isTamil ? "சட்ட செயல்முறை" : "Legal Process" },
              { key: "generate-fir", label: isTamil ? "FIR உருவாக்கு" : "Generate FIR" },
              { key: "ai-assistant", label: isTamil ? "AI உதவி" : "AI Assistant" }
            ].map((tab) => (
              <button
                key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* FIR Content */}
        <div className="fir-content">
          {renderTabContent()}
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{modalContent.title}</h2>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>{modalContent.description}</p>
            </div>
            <div className="modal-footer">
              <button className="ok-btn" onClick={closeModal}>
                {isTamil ? "சரி" : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default FIRAssistant;

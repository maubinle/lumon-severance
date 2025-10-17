import React, { useState, useEffect, useRef } from 'react';
import { Camera, Download, Users } from 'lucide-react';
import { ref, push, set, onValue, get } from 'firebase/database';
import { database } from './firebase';
import './App.css';

function App() {
  
  const [screen, setScreen] = useState('welcome');
  const [formData, setFormData] = useState({
    name: '',
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: ''
  });
  const [photo, setPhoto] = useState(null);
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [totalSevered, setTotalSevered] = useState(0);
  const [calculating, setCalculating] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);

  // useEffect(() => {
  //   const stored = sessionStorage.getItem('lumonEmployees');
  //   if (stored) {
  //     const employees = JSON.parse(stored);
  //     setAllEmployees(employees);
  //     setTotalSevered(employees.length);
  //   }
  // }, []);

  useEffect(() => {
    const employeesRef = ref(database, 'employees');
    
    // Listen for real-time updates
    const unsubscribe = onValue(employeesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const employeeList = Object.values(data);
        setAllEmployees(employeeList);
        setTotalSevered(employeeList.length);
      } else {
        setAllEmployees([]);
        setTotalSevered(0);
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);
  
  const departments = [
    'Macrodata Refinement',
    'Optics & Design',
    'Wellness Center',
    'Mammalians Nurturable',
    'Security Office',
    'Choreography and Merriment'
  ];

  const departmentDescriptions = {
    'Macrodata Refinement': 'You possess the clarity of mind required to sort the unsortable. Numbers speak to you in ways others cannot comprehend.',
    'Optics & Design': 'Your eye for beauty and harmony makes you essential to maintaining the aesthetic standards Kier envisioned.',
    'Wellness Center': 'Your empathetic nature and understanding of the human condition make you a guide for those in need.',
    'Mammalians Nurturable': 'Your gentle spirit and nurturing instincts are perfectly suited to care for our most delicate charges.',
    'Security Office': 'Your vigilance and dedication to order make you a guardian of Lumon\'s sacred protocols.',
    'Choreography and Merriment': 'Your devotion to structure and joy in movement make you perfect for orchestrating our sacred rituals.'
  };

  const roles = {
    'Macrodata Refinement': [
      'Senior Refiner',
      'Junior Refiner',
      'Data Sorter',
      'Numbers Interpreter',
      'Department Head'
    ],
    'Optics & Design': [
      'Chief Designer',
      'Visual Specialist',
      'Aesthetic Coordinator',
      'Color Harmonizer',
      'Office Decorator'
    ],
    'Wellness Center': [
      'Wellness Counselor',
      'Morale Officer',
      'Self-Awareness Liaison',
      'Balance Technician'
    ],
    'Mammalians Nurturable': [
      'Lead Caretaker',
      'Junior Feeder',
      'Emotional Support Facilitator',
      'Cub Comforter'
    ],
    'Security Office': [
      'Division Chief of Security',
      'Compliance Officer',
      'Surveillance Specialist',
      'Corridor Patrol Associate'
    ],
    'Choreography and Merriment': [
      'Chief of Merriment',
      'Choreography Consultant',
      'Dance Captain',
      'Revelry Coordinator'
    ]
  };

  const areasForImprovement = [
    "Temper of Woe requires further taming",
    "Temper of Frolic interferes with duty",
    "Temper of Dread undermines confidence",
    "Temper of Malice surfaces during file work",
    "Insufficient reverence for Kier's teachings",
    "Questions the mystery when acceptance is required",
    "Shows signs of outie consciousness bleeding through",
    "Resists the repetition that brings purity",
    "Struggles to embrace ambiguity gracefully",
    "Displays individualism over collective purpose",
    "Fails to find adequate joy in numbers",
    "The Core Principle of Humility needs reinforcement",
    "Lacks proper enthusiasm for incentive programs",
    "Demonstrates insufficient gratitude for severance"
  ];

  const commendations = [
    "Demonstrates mastery of the Four Tempers",
    "Embodies Kier's Nine Core Principles admirably",
    "Accepts the mystery with grace and reverence",
    "Shows exemplary dedication to file refinement",
    "Maintains proper decorum with colleagues",
    "Displays appropriate joy upon quota completion",
    "Serves Lumon with selfless devotion",
    "Embraces repetition as the path to perfection",
    "Finds meaning in the work itself",
    "Worthy of Kier's eternal regard"
  ];

  const incentives = [
    {
      name: "Five-Minute Music Dance Experience",
      description: "Partner with a member of Choreography & Merriment for a brief, sanctioned dance. Smiling is mandatory.",
      requires: "Choreography and Merriment"
    },
    {
      name: "Affirmation Session",
      description: "Receive three corporate-approved compliments from a Wellness Counselor.",
      requires: "Wellness Center"
    },
    {
      name: "Portrait Time",
      description: "Have your likeness drawn by a member of Optics & Design. You must thank Kier afterward.",
      requires: "Optics & Design"
    },
    {
      name: "Animal Observation Break",
      description: "Join an MN employee to observe or nurture a small mammal (real or plush).",
      requires: "Mammalians Nurturable"
    },
    {
      name: "Security Escort of Honor",
      description: "Be ceremoniously escorted across the room by a Security Officer while others applaud your compliance.",
      requires: "Security Office"
    },
    {
      name: "Data Harmony Review",
      description: "Sit with a refiner who will solemnly assess your data purity level.",
      requires: "Macrodata Refinement"
    },
    {
      name: "Praise from Management",
      description: "Receive a formal commendation from a designated Department Head.",
      requires: "Any Department"
    }
  ];

  const sanctions = [
    {
      name: "Mandatory Wellness Debrief",
      description: "Report to a Wellness Counselor to confess your latest noncompliant thought.",
      requires: "Wellness Center"
    },
    {
      name: "Visual Reeducation",
      description: "Be shown an abstract image by an O&D member and describe what emotion Kier intended it to evoke.",
      requires: "Optics & Design"
    },
    {
      name: "Choreographed Repentance",
      description: "Perform a synchronized penance dance directed by a C&M employee. Include at least one twirl.",
      requires: "Choreography and Merriment"
    },
    {
      name: "Animal Reflection Session",
      description: "Pet or comfort a stuffed mammal while reciting a Lumon Value.",
      requires: "Mammalians Nurturable"
    },
    {
      name: "Hallway Reflection",
      description: "Stand silently under guard for 30 seconds while contemplating your error.",
      requires: "Security Office"
    },
    {
      name: "Data Reclassification Duty",
      description: "Sit with a refiner who reassigns you to a lower data purity tier. Nod solemnly.",
      requires: "Macrodata Refinement"
    },
    {
      name: "Management Correction",
      description: "Receive a verbal reprimand from a Department Head. Respond: 'Thank you for my correction.'",
      requires: "Any Department"
    }
  ];


  const kierQuotes = [
    "I walked into the cave of my own mind, and there I tamed them.",
    "The mouth which is busy smiling cannot bite.",
    "Let not weakness live in your veins, cherished workers.",
    "The remembered man does not decay.",
    "Should you tame the tempers as I did mine, then the world shall become but your appendage.",
    "The work is mysterious and important.",
    "In your noblest thoughts shall be my voice."
  ];

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Camera access denied. You may proceed without biometric capture.");
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) {
      alert('Camera not initialized properly.');
      return;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('Video not ready');
      alert('Camera not ready yet – please wait a moment and try again.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');
    setPhoto(imageData);

    const stream = video.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }

    setCameraActive(false);
    
    setScreen('calculating');
    setCalculating(true);
    setTimeout(() => {
      generateProfile(imageData);
      setCalculating(false);
      setScreen('results');
    }, 3000);
  };

 const skipPhoto = () => {
    setScreen('calculating');
    setCalculating(true);
    setTimeout(() => {
      generateProfile(null);
      setCalculating(false);
      setScreen('results');
    }, 3000);
  };

  const calculateDepartment = () => {
    const scores = {
      'Macrodata Refinement': 0,
      'Optics & Design': 0,
      'Wellness Center': 0,
      'Mammalians Nurturable': 0,
      'Security Office': 0,
      'Choreography and Merriment': 0
    };

    if (formData.q1 === 'categorize') scores['Macrodata Refinement'] += 3;
    if (formData.q1 === 'beauty') scores['Optics & Design'] += 3;
    if (formData.q1 === 'nurture') scores['Mammalians Nurturable'] += 3;
    if (formData.q1 === 'secure') scores['Security Office'] += 3;

    if (formData.q2 === 'follow') {
      scores['Macrodata Refinement'] += 2;
      scores['Choreography and Merriment'] += 2;
    }
    if (formData.q2 === 'context') scores['Wellness Center'] += 3;
    if (formData.q2 === 'protect') scores['Security Office'] += 2;
    if (formData.q2 === 'feel') scores['Mammalians Nurturable'] += 2;

    if (formData.q3 === 'embrace') {
      scores['Choreography and Merriment'] += 2;
      scores['Wellness Center'] += 1;
    }
    if (formData.q3 === 'clarity') scores['Macrodata Refinement'] += 3;
    if (formData.q3 === 'vigilant') scores['Security Office'] += 3;
    if (formData.q3 === 'beauty') scores['Optics & Design'] += 2;

    if (formData.q4 === 'meditative') {
      scores['Macrodata Refinement'] += 2;
      scores['Choreography and Merriment'] += 1;
    }
    if (formData.q4 === 'creativity') scores['Optics & Design'] += 3;
    if (formData.q4 === 'soothing') scores['Mammalians Nurturable'] += 3;
    if (formData.q4 === 'control') scores['Security Office'] += 2;

    if (formData.q5 === 'obey') {
      scores['Choreography and Merriment'] += 3;
      scores['Security Office'] += 1;
    }
    if (formData.q5 === 'guide') scores['Wellness Center'] += 3;
    if (formData.q5 === 'protect') scores['Security Office'] += 2;
    if (formData.q5 === 'care') scores['Mammalians Nurturable'] += 2;

    let maxScore = 0;
    let selectedDept = 'Macrodata Refinement';
    
    for (const [dept, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        selectedDept = dept;
      }
    }

    return selectedDept;
  };


  const generateProfile = async (capturedPhoto = null) => {
    // Get current count from Firebase
    const employeesRef = ref(database, 'employees');
    const snapshot = await get(employeesRef);
    const currentCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;

    const dept = calculateDepartment();
    const rolesList = roles[dept];
    const role = rolesList[Math.floor(Math.random() * rolesList.length)];
    // const generateProfile = (capturedPhoto = null) => {
    // const generateProfile = async (capturedPhoto = null) => {

    // const dept = calculateDepartment();
    // const rolesList = roles[dept];
    // const role = rolesList[Math.floor(Math.random() * rolesList.length)];

    const isManager = allEmployees.length < 3 || Math.random() > 0.7;
    const reportsTo = !isManager && allEmployees.length > 0
      ? allEmployees[Math.floor(Math.random() * allEmployees.length)].name
      : null;

    const employeeId = `${Math.floor(10000 + Math.random() * 90000)}`;
    const fragmentsProcessed = Math.floor(Math.random() * 10000);
    const waffleParties = Math.floor(Math.random() * 4);
    const complianceScore = Math.floor(70 + Math.random() * 30);
    const quotasMet = Math.floor(Math.random() * 100);
    const quote = kierQuotes[Math.floor(Math.random() * kierQuotes.length)];

    const shuffledImprovements = [...areasForImprovement].sort(() => Math.random() - 0.5);
    const shuffledCommendations = [...commendations].sort(() => Math.random() - 0.5);

    const profile = {
      name: formData.name,
      employeeId,
      employeeNumber: currentCount + 1,
      department: dept,
      role,
      reportsTo,
      fragmentsProcessed,
      waffleParties,
      complianceScore,
      quotasMet,
      improvements: shuffledImprovements.slice(0, 2 + Math.floor(Math.random() * 2)),
      commendations: shuffledCommendations.slice(0, 1 + Math.floor(Math.random() * 2)),
      incentive: incentives[Math.floor(Math.random() * incentives.length)],
      sanction: sanctions[Math.floor(Math.random() * sanctions.length)],
      quote,
      photo: capturedPhoto,
      timestamp: new Date().toISOString()
    };

  //   setEmployeeProfile(profile);
  //   const updatedEmployees = [...allEmployees, profile];
  //   sessionStorage.setItem('lumonEmployees', JSON.stringify(updatedEmployees));
  //   setAllEmployees(updatedEmployees);
  //   setTotalSevered(updatedEmployees.length);
  // };

  setEmployeeProfile(profile);

// Save to Firebase
  // const employeesRef = ref(database, 'employees');
  const newEmployeeRef = push(employeesRef);
  await set(newEmployeeRef, profile);
  };


  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
      let line = '';
      let currentY = y;
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && line.length > 0) {
          ctx.fillText(line.trim(), x, currentY);
          line = word + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      });
    
      ctx.fillText(line.trim(), x, currentY);
      return currentY + lineHeight;
    };

  const downloadIDCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#E8E4D9';
    ctx.fillRect(0, 0, 700, 1100);

    // Header with logo
    ctx.fillStyle = '#2C5F8D';
    ctx.fillRect(0, 0, 700, 120);

    // Load and draw logo
    const logo = new Image();
    logo.crossOrigin = 'anonymous';
    
    const drawRestOfCard = () => {
      // Employee info header
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 28px Arial';
      ctx.fillText(employeeProfile.name, 240, 175);

      ctx.font = '18px Arial';
      ctx.fillStyle = '#333333';
      ctx.fillText(`ID: ${employeeProfile.employeeId}`, 240, 205);
      ctx.fillText(`Severance #${employeeProfile.employeeNumber}`, 240, 235);
      ctx.fillText(employeeProfile.role, 240, 265);
      ctx.fillText(employeeProfile.department, 240, 295);

      // Performance Metrics
      ctx.fillStyle = '#2C5F8D';
      ctx.font = 'bold 22px Arial';
      let yPos = 350;
      ctx.fillText('PERFORMANCE METRICS', 40, yPos);

      ctx.fillStyle = '#333333';
      ctx.font = '16px Arial';
      yPos += 35;
      ctx.fillText(`Reports to: ${employeeProfile.reportsTo || 'The Board'}`, 40, yPos);
      yPos += 30;
      ctx.fillText(`Files Refined: ${employeeProfile.fragmentsProcessed}`, 40, yPos);
      yPos += 30;
      ctx.fillText(`Quota Fulfillment: ${employeeProfile.quotasMet}%`, 40, yPos);
      yPos += 30;
      ctx.fillText(`Incentives Earned: ${employeeProfile.waffleParties}`, 40, yPos);
      yPos += 30;
      ctx.fillText(`Compliance Rating: ${employeeProfile.complianceScore}%`, 40, yPos);

      // Commendations Box (Green)
      yPos += 50;
      ctx.fillStyle = 'rgba(22, 163, 74, 0.1)';
      ctx.fillRect(35, yPos - 10, 630, 35);
      
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 22px Arial';
      ctx.fillText('✓ COMMENDATIONS', 40, yPos + 15);
      
      ctx.fillStyle = '#1A5F3A';
      ctx.font = '15px Arial';
      yPos += 45;
      employeeProfile.commendations.forEach(comm => {
        ctx.fillText(`✓ ${comm}`, 50, yPos);
        yPos += 25;
      });

      // Incentive Earned (within green section)
      yPos += 15;
      ctx.fillStyle = 'rgba(22, 163, 74, 0.2)';
      ctx.fillRect(35, yPos - 10, 630, 95);
      
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 18px Arial';
      ctx.fillText('→ INCENTIVE EARNED', 45, yPos + 15);

      yPos += 40;
      ctx.fillStyle = '#166534';
      ctx.font = '16px Arial';
      ctx.fillText(employeeProfile.incentive.name, 45, yPos);
      yPos += 22;
      ctx.fillStyle = '#333333';
      ctx.font = '14px Arial';
      yPos = wrapText(ctx, employeeProfile.incentive.description, 45, yPos, 610, 20);
      yPos += 5;
      ctx.fillStyle = '#666666';
      ctx.font = 'italic 12px Arial';
      ctx.fillText(`Requires: ${employeeProfile.incentive.requires}`, 45, yPos);

      // Areas for Improvement Box (Amber)
      yPos += 35;
      ctx.fillStyle = 'rgba(217, 119, 6, 0.1)';
      ctx.fillRect(35, yPos - 10, 630, 35);
      
      ctx.fillStyle = '#92400e';
      ctx.font = 'bold 22px Arial';
      ctx.fillText('⚠ AREAS FOR IMPROVEMENT', 40, yPos + 15);
      
      ctx.fillStyle = '#8B6914';
      ctx.font = '15px Arial';
      yPos += 45;
      employeeProfile.improvements.forEach(imp => {
        ctx.fillText(`• ${imp}`, 50, yPos);
        yPos += 25;
      });

      // Sanction Pending (within red section)
      yPos += 15;
      ctx.fillStyle = 'rgba(220, 38, 38, 0.1)';
      ctx.fillRect(35, yPos - 10, 630, 95);
      
      ctx.fillStyle = '#991b1b';
      ctx.font = 'bold 18px Arial';
      ctx.fillText('→ SANCTION PENDING', 45, yPos + 15);

      yPos += 40;
      ctx.fillStyle = '#7f1d1d';
      ctx.font = '16px Arial';
      ctx.fillText(employeeProfile.sanction.name, 45, yPos);
      yPos += 22;
      ctx.fillStyle = '#333333';
      ctx.font = '14px Arial';
      yPos = wrapText(ctx, employeeProfile.sanction.description, 45, yPos, 610, 20);
      yPos += 5;
      ctx.fillStyle = '#666666';
      ctx.font = 'italic 12px Arial';
      ctx.fillText(`Requires: ${employeeProfile.sanction.requires}`, 45, yPos);

      // Kier Quote
      yPos += 35;
      ctx.fillStyle = '#666666';
      ctx.font = 'italic 14px Arial';
      const words = employeeProfile.quote.split(' ');
      let line = '';
      words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 620) {
          ctx.fillText(line, 40, yPos);
          line = word + ' ';
          yPos += 20;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, 40, yPos);
      yPos += 22;
      ctx.fillText('— Kier Eagan', 40, yPos);

      // Export
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `lumon-employee-${employeeProfile.employeeId}.png`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    };

    // Draw photo if exists
    if (employeeProfile.photo) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 40, 140, 180, 180);
        
        // Try to load logo
        logo.onload = () => {
          ctx.drawImage(logo, 20, 20, 80, 80);
          drawRestOfCard();
        };
        logo.onerror = () => {
          // Draw LUMON text if logo fails
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 32px Arial';
          ctx.fillText('LUMON', 30, 70);
          drawRestOfCard();
        };
        logo.src = '/lumon-severance/lumon-logo.jpg';
      };
      img.onerror = () => {
        ctx.fillStyle = '#cccccc';
        ctx.fillRect(40, 140, 180, 180);
        ctx.fillStyle = '#666666';
        ctx.font = '16px Arial';
        ctx.fillText('NO PHOTO', 80, 230);
        
        // Try to load logo
        logo.onload = () => {
          ctx.drawImage(logo, 20, 20, 80, 80);
          drawRestOfCard();
        };
        logo.onerror = () => {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 32px Arial';
          ctx.fillText('LUMON', 30, 70);
          drawRestOfCard();
        };
        logo.src = '/lumon-severance/lumon-logo.jpg';
      };
      img.src = employeeProfile.photo;
    } else {
      ctx.fillStyle = '#cccccc';
      ctx.fillRect(40, 140, 180, 180);
      ctx.fillStyle = '#666666';
      ctx.font = '16px Arial';
      ctx.fillText('NO PHOTO', 80, 230);
      
      // Try to load logo
      logo.onload = () => {
        ctx.drawImage(logo, 20, 20, 80, 80);
        drawRestOfCard();
      };
      logo.onerror = () => {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial';
        ctx.fillText('LUMON', 30, 70);
        drawRestOfCard();
      };
      logo.src = '/lumon-severance/lumon-logo.jpg';
    }
  };

  return (
    <div className="min-h-screen bg-stone-200 font-sans" style={{
      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.02) 2px, rgba(0,0,0,.02) 4px)`
    }}>
      {screen === 'welcome' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="max-w-2xl w-full bg-stone-50 shadow-2xl border border-stone-300 p-12">
            <div className="text-center mb-8">
              <img
                src="/lumon-severance/lumon-logo.jpg"
                alt="Lumon Industries"
                className="h-40 w-auto mx-auto mb-6"
                style={{
                  animation: 'glow 4s ease-in-out infinite'
                }}
              />
              <div className="w-24 h-1 bg-blue-900 mx-auto mb-6"></div>
              <p className="text-xl text-slate-600 italic">Severance Program Intake Form</p>
            </div>

            <div className="bg-blue-900 bg-opacity-10 border-l-4 border-blue-900 p-6 mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6">
                Want a better work-life balance?
              </h2>
              <p className="text-slate-700 text-lg leading-relaxed mb-5">
                At Lumon Industries, we make it possible. Our revolutionary severance procedure separates your work self from your home self, so you can fully enjoy your life outside the office.
              </p>
              <p className="text-slate-700 text-lg leading-relaxed mb-5">
                No interruptions. No stress. Just focus on living the life you’ve always wanted.
              </p>
              <p className="text-slate-600 italic text-base">
                Join Lumon Industries today to experience the freedom of true work-life balance.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 mb-8">
              <Users className="text-blue-900" size={24} />
              <p className="text-slate-600 text-lg">
                <span className="font-bold text-blue-900">{totalSevered}</span> employees successfully severed
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setScreen('intake')}
                className="col-span-2 bg-blue-900 text-white py-4 px-8 text-lg font-semibold hover:bg-blue-800 transition-colors tracking-wide"
              >
                BEGIN SEVERANCE APPLICATION
              </button>
              
              {totalSevered > 0 && (
                <button
                  onClick={() => setScreen('orgchart')}
                  className="col-span-2 bg-slate-600 text-white py-3 px-6 text-base font-semibold hover:bg-slate-700 transition-colors"
                >
                  VIEW SEVERED FLOOR DIRECTORY
                </button>
              )}
            </div>

            <p className="text-center text-sm text-slate-500 mt-6 italic">
              "{kierQuotes[Math.floor(Math.random() * kierQuotes.length)]}" — Kier Eagan
            </p>
          </div>
        </div>
      )}

      {screen === 'intake' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="max-w-2xl w-full bg-stone-50 shadow-2xl border border-stone-300 p-12">
            <img
                src="/lumon-severance/lumon-logo.jpg"
                alt="Lumon Industries"
                className="h-20 w-auto mx-auto mb-6"
                style={{
                  animation: 'glow 4s ease-in-out infinite'
                }}
              />
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Worker Assessment Protocol</h2>
            <p className="text-slate-600 mb-8">Your answers will determine your ideal department placement within Lumon Industries</p>
            
            <div className="space-y-8">
              <div>
                <label className="block text-slate-700 font-semibold mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-stone-300 bg-white focus:border-blue-900 focus:outline-none"
                  placeholder="First Last"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-3">
                  1. When you encounter information that defies comprehension, your instinct is to:
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'categorize', label: 'Sort it methodically into distinct categories' },
                    { value: 'beauty', label: 'Find the aesthetic harmony within the chaos' },
                    { value: 'nurture', label: 'Approach it gently, with patience and care' },
                    { value: 'secure', label: 'Identify potential threats or violations' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center p-3 border border-stone-300 bg-stone-50 hover:bg-stone-100 cursor-pointer">
                      <input
                        type="radio"
                        name="q1"
                        value={option.value}
                        checked={formData.q1 === option.value}
                        onChange={(e) => setFormData({...formData, q1: e.target.value})}
                        className="mr-3"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-3">
                  2. When given a task without explanation or context, you:
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'follow', label: 'Execute it precisely as instructed, finding peace in the clarity of directives' },
                    { value: 'context', label: 'Need to understand the "why" before you can proceed effectively' },
                    { value: 'protect', label: 'Assess whether the task poses any risk or breach of protocol' },
                    { value: 'feel', label: 'Tune into your emotional response and proceed with empathy' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center p-3 border border-stone-300 bg-stone-50 hover:bg-stone-100 cursor-pointer">
                      <input
                        type="radio"
                        name="q2"
                        value={option.value}
                        checked={formData.q2 === option.value}
                        onChange={(e) => setFormData({...formData, q2: e.target.value})}
                        className="mr-3"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-3">
                  3. When confronted with ambiguity or mystery in your work, you feel:
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'embrace', label: 'At peace - mystery is sacred and purposeful' },
                    { value: 'clarity', label: 'Driven to impose structure and clear definitions' },
                    { value: 'vigilant', label: 'Alert - ambiguity may conceal danger' },
                    { value: 'beauty', label: 'Captivated by its visual or sensory qualities' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center p-3 border border-stone-300 bg-stone-50 hover:bg-stone-100 cursor-pointer">
                      <input
                        type="radio"
                        name="q3"
                        value={option.value}
                        checked={formData.q3 === option.value}
                        onChange={(e) => setFormData({...formData, q3: e.target.value})}
                        className="mr-3"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-3">
                  4. Repetitive tasks make you feel:
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'meditative', label: 'Calm and focused - repetition brings clarity' },
                    { value: 'creativity', label: 'Restless - you crave variety and creative expression' },
                    { value: 'soothing', label: 'Comforted - like a gentle, rhythmic lullaby' },
                    { value: 'control', label: 'Secure - consistency equals safety and order' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center p-3 border border-stone-300 bg-stone-50 hover:bg-stone-100 cursor-pointer">
                      <input
                        type="radio"
                        name="q4"
                        value={option.value}
                        checked={formData.q4 === option.value}
                        onChange={(e) => setFormData({...formData, q4: e.target.value})}
                        className="mr-3"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-3">
                  5. Your ideal relationship with authority figures is:
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'obey', label: 'Total devotion - their wisdom guides my every movement' },
                    { value: 'guide', label: 'Collaborative - I need their support to help others thrive' },
                    { value: 'protect', label: 'Aligned - we share the mission of maintaining order' },
                    { value: 'care', label: 'Gentle - I respond best to kindness and encouragement' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center p-3 border border-stone-300 bg-stone-50 hover:bg-stone-100 cursor-pointer">
                      <input
                        type="radio"
                        name="q5"
                        value={option.value}
                        checked={formData.q5 === option.value}
                        onChange={(e) => setFormData({...formData, q5: e.target.value})}
                        className="mr-3"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setScreen('photo')}
                disabled={!formData.name || !formData.q1 || !formData.q2 || !formData.q3 || !formData.q4 || !formData.q5}
                className="w-full bg-blue-900 text-white py-4 px-8 text-lg font-semibold hover:bg-blue-800 transition-colors disabled:bg-slate-400 tracking-wide"
              >
                PROCEED TO BIOMETRIC CAPTURE
              </button>
            </div>
          </div>
        </div>
      )}

      {screen === 'photo' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="max-w-2xl w-full bg-stone-50 shadow-2xl border border-stone-300 p-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Biometric Registration</h2>
            
            {!cameraActive && !photo && (
              <div className="space-y-6">
                <p className="text-slate-600 text-center">
                  All severed employees require photographic documentation for identification purposes.
                </p>
                <button
                  onClick={startCamera}
                  className="w-full bg-blue-900 text-white py-4 px-8 text-lg font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center gap-3 tracking-wide"
                >
                  <Camera size={24} />
                  INITIATE CAPTURE PROTOCOL
                </button>
                <button
                  onClick={skipPhoto}
                  className="w-full bg-stone-400 text-white py-3 px-6 hover:bg-stone-500 transition-colors"
                >
                  Proceed Without Image
                </button>
              </div>
            )}

            {cameraActive && (
              <div className="space-y-6">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full border-4 border-blue-900"
                />
                <button
                  onClick={capturePhoto}
                  className="w-full bg-teal-800 text-white py-4 px-8 text-lg font-semibold hover:bg-teal-900 transition-colors tracking-wide"
                >
                  CAPTURE BIOMETRIC DATA
                </button>
              </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </div>
      )}

      {screen === 'calculating' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="max-w-2xl w-full bg-stone-50 shadow-2xl border border-stone-300 p-12">
            <div className="text-center">
              <img
                src="/lumon-severance/lumon-logo.jpg"
                alt="Lumon Industries"
                className="h-32 w-auto mx-auto mb-8"
                style={{
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              />
              <h2 className="text-3xl font-bold text-slate-800 mb-4">PROCESSING TEMPER ANALYSIS</h2>
              <div className="space-y-3 text-lg text-slate-600 mb-8">
                <p className="animate-pulse">Analyzing your Four Tempers...</p>
                <p className="animate-pulse" style={{animationDelay: '0.3s'}}>Consulting Kier's principles...</p>
                <p className="animate-pulse" style={{animationDelay: '0.6s'}}>Determining optimal department placement...</p>
              </div>
              <div className="flex justify-center gap-2 mb-6">
                <div className="w-3 h-3 bg-blue-900 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-900 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-blue-900 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <p className="text-sm text-slate-500 italic">
                "The work is mysterious and important."
              </p>
            </div>
          </div>
        </div>
      )}


      {screen === 'results' && employeeProfile && (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="max-w-3xl w-full bg-stone-50 shadow-2xl border border-stone-300 p-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-slate-800 mb-2 tracking-wide">SEVERANCE COMPLETE</h2>
              <p className="text-slate-600 italic">Welcome to Lumon Industries</p>
            </div>

            {/* COMBINED DEPARTMENT REVEAL + EMPLOYEE INFO */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white p-8 mb-8 border-4 border-blue-900 shadow-xl">
              <p className="text-sm uppercase tracking-widest mb-2 opacity-90 text-center">YOUR DEPARTMENT</p>
              <h3 className="text-5xl font-extrabold mb-4 tracking-wide text-center">{employeeProfile.department}</h3>
              <div className="w-32 h-1 bg-white mx-auto mb-4"></div>
              <p className="text-2xl font-semibold mb-4 text-center">{employeeProfile.role}</p>
              <p className="text-base opacity-90 italic max-w-2xl mx-auto leading-relaxed text-center mb-8">
                {departmentDescriptions[employeeProfile.department]}
              </p>

              {/* Employee Details */}
              <div className="border-t-2 border-white/30 pt-6 mt-6">
                {employeeProfile.photo && (
                  <div className="flex justify-center mb-6">
                    <img src={employeeProfile.photo} alt="Employee" className="w-40 h-40 object-cover border-4 border-white shadow-lg" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="text-center">
                    <p className="text-sm opacity-75 uppercase tracking-wide">Name</p>
                    <p className="text-xl font-bold">{employeeProfile.name}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm opacity-75 uppercase tracking-wide">Employee ID</p>
                    <p className="text-xl font-bold">{employeeProfile.employeeId}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm opacity-75 uppercase tracking-wide">Severance #</p>
                    <p className="text-xl font-bold">#{employeeProfile.employeeNumber}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm opacity-75 uppercase tracking-wide">Reports To</p>
                    <p className="text-xl font-bold">{employeeProfile.reportsTo || 'The Board'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-4 border-b-2 border-blue-900 pb-2">
                PERFORMANCE METRICS
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-stone-100 border border-stone-300 p-4">
                  <p className="text-sm text-slate-600">Files Refined</p>
                  <p className="text-2xl font-bold text-blue-900">{employeeProfile.fragmentsProcessed}</p>
                </div>

                <div className="bg-stone-100 border border-stone-300 p-4">
                  <p className="text-sm text-slate-600">Quota Fulfillment</p>
                  <p className="text-2xl font-bold text-blue-900">{employeeProfile.quotasMet}%</p>
                </div>

                <div className="bg-stone-100 border border-stone-300 p-4">
                  <p className="text-sm text-slate-600">Incentives Earned</p>
                  <p className="text-2xl font-bold text-blue-900">{employeeProfile.waffleParties}</p>
                </div>

                <div className="bg-stone-100 border border-stone-300 p-4">
                  <p className="text-sm text-slate-600">Compliance Rating</p>
                  <p className="text-2xl font-bold text-blue-900">{employeeProfile.complianceScore}%</p>
                </div>
              </div>

              {/* Commendations + Incentive Coupling */}
              <div className="bg-green-50 border-2 border-green-700 p-6 mb-6">
                <h4 className="font-bold text-green-800 mb-3 text-xl flex items-center gap-2">
                  <span>✓</span> Commendations
                </h4>
                <ul className="space-y-2 mb-6">
                  {employeeProfile.commendations.map((comm, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-700 mr-2">✓</span>
                      <span className="text-slate-700">{comm}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="border-t-2 border-green-600 pt-4 mt-4 bg-green-100 -m-6 mt-4 p-6">
                  <h5 className="font-bold text-green-900 mb-2 text-sm uppercase tracking-wide">
                    → Incentive Earned
                  </h5>
                  <p className="font-semibold text-green-900 mb-2">{employeeProfile.incentive.name}</p>
                  <p className="text-slate-700 text-sm mb-2">{employeeProfile.incentive.description}</p>
                  <p className="text-xs text-slate-600 italic bg-white bg-opacity-50 p-2 rounded">
                    Requires interaction with: <span className="font-semibold">{employeeProfile.incentive.requires}</span>
                  </p>
                </div>
              </div>

              {/* Areas for Improvement + Sanction Coupling */}
              <div className="bg-amber-50 border-2 border-amber-700 p-6">
                <h4 className="font-bold text-amber-900 mb-3 text-xl flex items-center gap-2">
                  <span>⚠</span> Areas for Improvement
                </h4>
                <ul className="space-y-2 mb-6">
                  {employeeProfile.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-amber-700 mr-2">•</span>
                      <span className="text-slate-700">{imp}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="border-t-2 border-red-600 pt-4 mt-4 bg-red-50 -m-6 mt-4 p-6">
                  <h5 className="font-bold text-red-900 mb-2 text-sm uppercase tracking-wide">
                    → Sanction Pending
                  </h5>
                  <p className="font-semibold text-red-900 mb-2">{employeeProfile.sanction.name}</p>
                  <p className="text-slate-700 text-sm mb-2">{employeeProfile.sanction.description}</p>
                  <p className="text-xs text-slate-600 italic bg-white bg-opacity-50 p-2 rounded">
                    Requires interaction with: <span className="font-semibold">{employeeProfile.sanction.requires}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-stone-100 border-l-4 border-blue-900 p-6 mb-8">
              <p className="text-slate-700 italic text-center">
                "{employeeProfile.quote}"
              </p>
              <p className="text-slate-500 text-sm text-center mt-2">— Kier Eagan</p>
            </div>

            <button
              onClick={downloadIDCard}
              className="w-full bg-blue-900 text-white py-4 px-8 text-lg font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center gap-3 mb-4 tracking-wide"
            >
              <Download size={24} />
              DOWNLOAD EMPLOYEE REPORT
            </button>

            <button
              onClick={() => {
                setScreen('welcome');
                setFormData({ name: '', q1: '', q2: '', q3: '', q4: '', q5: '' });
                setPhoto(null);
                setEmployeeProfile(null);
              }}
              className="w-full bg-stone-400 text-white py-3 px-6 hover:bg-stone-500 transition-colors"
            >
              Sever Another Employee
            </button>

            <p className="text-center text-xs text-slate-500 mt-6 italic">
              Your work self stays at work. Your life self stays at home.
            </p>
          </div>
        </div>
      )}

      {screen === 'orgchart' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="max-w-5xl w-full bg-stone-50 shadow-2xl border border-stone-300 p-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-slate-800 mb-2 tracking-wide">SEVERED FLOOR DIRECTORY</h2>
              <p className="text-slate-600">Organizational Structure — Lumon Industries</p>
            </div>

            {allEmployees.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">No employees have been severed yet.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Group employees by manager */}
                {(() => {
                  const managers = allEmployees.filter(emp => !emp.reportsTo);
                  const reports = allEmployees.filter(emp => emp.reportsTo);
                  
                  return (
                    <div className="space-y-6">
                      {/* Department Heads / Managers */}
                      {managers.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold text-blue-900 mb-4 pb-2 border-b-2 border-blue-900">
                            Department Leadership
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {managers.map((emp) => {
                              const directReports = reports.filter(r => r.reportsTo === emp.name);
                              return (
                                <div key={emp.employeeId} className="bg-blue-900 bg-opacity-5 border-2 border-blue-900 p-4">
                                  {emp.photo && (
                                    <img src={emp.photo} alt={emp.name} className="w-20 h-20 object-cover border-2 border-blue-900 mx-auto mb-3" />
                                  )}
                                  <h4 
                                    className="font-bold text-slate-800 text-center cursor-pointer hover:text-blue-900 hover:underline transition-colors"
                                    onClick={() => {
                                      setEmployeeProfile(emp);
                                      setScreen('results');
                                    }}
                                  >
                                    {emp.name}
                                  </h4>
                                  <p className="text-sm text-slate-600 text-center">{emp.role}</p>
                                  <p className="text-xs text-slate-500 text-center mb-2">{emp.department}</p>
                                  <div className="text-xs text-center text-blue-900 font-semibold">
                                    ID: {emp.employeeId}
                                  </div>
                                  {directReports.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-blue-900 border-opacity-30">
                                      <p className="text-xs text-slate-600 font-semibold mb-1">Direct Reports:</p>
                                      <ul className="text-xs text-slate-600 space-y-1">
                                        {directReports.map(r => (
                                          <li key={r.employeeId}>• {r.name}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* All Employees by Department */}
                      <div>
                        <h3 className="text-xl font-bold text-blue-900 mb-4 pb-2 border-b-2 border-blue-900">
                          All Severed Employees by Department
                        </h3>
                        {departments.map(dept => {
                          const deptEmployees = allEmployees.filter(emp => emp.department === dept);
                          if (deptEmployees.length === 0) return null;
                          
                          return (
                            <div key={dept} className="mb-6">
                              <h4 className="font-bold text-slate-700 mb-3 text-lg">{dept}</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {deptEmployees.map(emp => (
                                  <div key={emp.employeeId} className="bg-stone-100 border border-stone-300 p-3 text-center">
                                    {emp.photo && (
                                      <img src={emp.photo} alt={emp.name} className="w-16 h-16 object-cover border border-stone-400 mx-auto mb-2" />
                                    )}
                                    <p 
                                      className="font-semibold text-sm text-slate-800 cursor-pointer hover:text-blue-900 hover:underline transition-colors"
                                      onClick={() => {
                                        setEmployeeProfile(emp);
                                        setScreen('results');
                                      }}
                                    >
                                      {emp.name}
                                    </p>
                                    <p className="text-xs text-slate-600">{emp.role}</p>
                                    <p className="text-xs text-slate-500 mt-1">ID: {emp.employeeId}</p>
                                    {emp.reportsTo && (
                                      <p className="text-xs text-blue-900 mt-1">→ {emp.reportsTo}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Statistics */}
                      <div className="bg-blue-900 bg-opacity-5 border border-blue-900 p-6 mt-8">
                        <h3 className="text-lg font-bold text-blue-900 mb-3">Severance Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-2xl font-bold text-blue-900">{allEmployees.length}</p>
                            <p className="text-sm text-slate-600">Total Severed</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-blue-900">{departments.filter(d => allEmployees.some(e => e.department === d)).length}</p>
                            <p className="text-sm text-slate-600">Active Departments</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-blue-900">{managers.length}</p>
                            <p className="text-sm text-slate-600">Department Heads</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-blue-900">{Math.round(allEmployees.reduce((sum, e) => sum + e.complianceScore, 0) / allEmployees.length)}%</p>
                            <p className="text-sm text-slate-600">Avg Compliance</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <button
              onClick={() => setScreen('welcome')}
              className="w-full bg-blue-900 text-white py-3 px-6 hover:bg-blue-800 transition-colors mt-8"
            >
              RETURN TO MAIN
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes glow {
          0%, 100% {
            opacity: 1;
            filter: brightness(1) drop-shadow(0 0 0px #fff);
          }
          50% {
            opacity: 0.9;
            filter: brightness(1.15) drop-shadow(0 0 8px rgba(26, 77, 92, 0.3));
          }
        }
      `}</style>
    </div>
  );
}

export default App;